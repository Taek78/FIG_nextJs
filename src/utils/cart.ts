/*
 * Logique du panier — fonctions PURES, comme utils/season.ts et utils/catalog.ts.
 * Ni cookie, ni date, ni accès direct au catalogue : tout arrive en paramètre.
 *
 * Le pipeline à trois étages :
 *
 *   CartLine[]  ──hydrateCart(products)──▶  CartItem[]  ──summarize()──▶  CartSummary
 *    (persisté)                              (affichable)                 (récapitulé)
 *        ▲
 *        └── addLine / setLineQuantity / removeLine
 *
 * Les trois mutations ignorent VOLONTAIREMENT le catalogue : elles se testent sans
 * fixture, et la validation (produit existant, disponible, unité compatible) appartient
 * à la Server Action, qui est la frontière de confiance.
 *
 * Conventions d'unités : voir l'en-tête de types/cart.ts.
 * Montants en centimes entiers, quantités en unité de base du produit.
 */
import type { Product, ProductUnit } from "@/types/product";
import type { CartItem, CartLine, CartSummary, OrderUnit } from "@/types/cart";
import { ORDER_UNITS } from "@/types/cart";
/** 20 kg, en grammes. Plafond par ligne pour un produit vendu au poids. */
export const MAX_GRAMS_PER_LINE = 20_000;

/** Plafond par ligne pour un produit vendu à la pièce. */
export const MAX_PIECES_PER_LINE = 20;

/** Livraison offerte à partir de 35,00 €. Seuil INCLUSIF : 3500 exactement suffit. */
export const FREE_DELIVERY_THRESHOLD_CENTS = 3_500;

/** Frais de port en deçà du seuil : 4,90 €. */
export const DELIVERY_FEE_CENTS = 490;

/** Un cookie plafonne à ~4 Ko ; une ligne pèse ~60 octets en JSON. */
export const MAX_CART_LINES = 50;

/** Pas d'incrément des steppers, dans l'unité de base du produit. */
export const QUANTITY_STEP: Record<ProductUnit, number> = {
  kg: 300, // grammes — l'affichage bascule en kg dès 1000 (formatQuantity)
  piece: 1,
};

/**
 * 2.3 € → 230 centimes.
 * `Math.round` et non `Math.trunc` : 2.3 * 100 vaut 229.999…, que trunc ramènerait à 229.
 * La courgette verte du catalogue est exactement dans ce cas.
 */
export function toCents(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Combien d'unités de base valent une unité de facturation.
 * 1000 g pour un produit au kg, 1 pièce pour un produit à la pièce.
 * Sert de diviseur dans le calcul du total de ligne.
 */
export function baseQuantityFor(product: Product): number {
  return product.unit === "kg" ? 1000 : 1;
}

/** Plafond de quantité applicable à ce produit, dans son unité de base. */
export function maxQuantityFor(product: Product): number {
  return product.unit === "kg" ? MAX_GRAMS_PER_LINE : MAX_PIECES_PER_LINE;
}

/**
 * Ajoute une quantité au panier, en FUSIONNANT si le produit y est déjà.
 *
 * - Quantité non entière ou <= 0 : ignorée silencieusement (renvoie `lines`).
 * - Ligne existante : quantités additionnées, plafonnées à `maxQuantity`, via `map`
 *   pour conserver la POSITION de la ligne (réajouter ne la fait pas sauter en bas).
 * - Sinon : la ligne est ajoutée en fin de panier.
 *
 * @param quantity Dans l'unité de base du produit (grammes ou pièces).
 * @param maxQuantity Fourni par l'appelant via `maxQuantityFor` — c'est la seule façon
 *                    de plafonner sans que cette fonction ait besoin du catalogue.
 */
export function addLine(
  lines: CartLine[],
  productId: string,
  quantity: number,
  orderUnit: OrderUnit,
  maxQuantity: number,
): CartLine[] {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return lines;
  }

  const lineExist = lines.some((line) => line.productId === productId);

  if (lineExist) {
    return lines.map((line) => {
      if (line.productId === productId) {
        const newQuantity = Math.min(line.quantity + quantity, maxQuantity);
        return { ...line, quantity: newQuantity };
      }
      return line;
    });
  }

  return [
    ...lines,
    {
      productId,
      quantity: Math.min(quantity, maxQuantity),
      orderUnit,
    },
  ];
}

/**
 * REMPLACE la quantité d'une ligne (bouton − / +), au lieu de l'additionner.
 *
 * - `quantity <= 0` : délègue à `removeLine` — le contrat « 0 supprime »,
 *   exploité par le bouton − de CartLineItem.
 * - Plafonne à `maxQuantity`.
 * - Produit absent du panier : renvoie `lines` INCHANGÉ. L'ajouter serait le
 *   travail d'addLine, et un « + » fantôme ne doit pas ressusciter un produit
 *   qu'on vient de retirer.
 * - Quand rien ne change, renvoie la référence `lines` elle-même : React et
 *   useOptimistic sautent alors le rendu.
 */
export function setLineQuantity(
  lines: CartLine[],
  productId: string,
  quantity: number,
  maxQuantity: number,
): CartLine[] {
  if (!Number.isInteger(quantity)) {
    return lines;
  }
  if (quantity <= 0) {
    return removeLine(lines, productId);
  }

  const lineExist = lines.find((line) => line.productId === productId);
  if (!lineExist) {
    return lines;
  }
  const newQuantity = Math.min(quantity, maxQuantity);

  if (lineExist.quantity === newQuantity) {
    return lines;
  }

  return lines.map((line) =>
    productId === line.productId ? { ...line, quantity: newQuantity } : line,
  );
}

/**
 * Retire une ligne entière. Idempotente : retirer un produit absent ne lève pas.
 * Un `filter` suffit.
 */
export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.productId !== productId);
}

/**
 * Calcule le total en centimes pour une ligne de commande.
 **/
export function computeLineTotalCents(product: Product, quantity: number): number {
  return Math.round(
    (toCents(product.price) * quantity) / baseQuantityFor(product),
  );
}

/**
 * Jointure lignes × catalogue : CartLine[] → CartItem[]. Seule fonction du module
 * à connaître les produits.
 *
 * - Catalogue indexé en Map — à 32 produits un `find` suffirait ; c'est une
 *   habitude prise avant que ça compte, pas une optimisation.
 * - `flatMap` écarte les lignes orphelines (productId inconnu) en une passe :
 *   jamais de `product: undefined` en sortie.
 * - lineTotalCents est arrondi UNE SEULE FOIS, ici : prix (centimes) × quantité ÷
 *   quantité de base (courgette 2,30 €/kg, 500 g → 230 × 500 / 1000 = 115).
 * - L'ordre du panier est conservé, pas celui du catalogue.
 */
export function hydrateCart(
  lines: CartLine[],
  products: Product[],
): CartItem[] {
  const productMap = new Map(products.map((p) => [p.id, p]));

  return lines.flatMap((line) => {
    const product = productMap.get(line.productId);
    if (!product) {
      return [];
    }

    const lineTotalCents = computeLineTotalCents(product, line.quantity);

    return [
      {
        product,
        quantity: line.quantity,
        orderUnit: line.orderUnit,
        lineTotalCents,
        unavailable: !product.available,
      },
    ];
  });
}

/**
 * CartItem[] → CartSummary : le « bas de ticket », affiché par CartSummaryPanel.
 *
 * - Panier vide : tout à zéro, FRAIS DE PORT COMPRIS — le seuil de gratuité seul
 *   facturerait 4,90 € sur un panier sans rien.
 * - subtotalCents : somme des lignes commandables uniquement (`unavailable`
 *   exclu : jamais facturé, jamais livré).
 * - deliveryCents : 0 dès que FREE_DELIVERY_THRESHOLD_CENTS est atteint
 *   (seuil INCLUSIF, figé par un test).
 * - itemCount : nombre de LIGNES commandables — additionner des grammes et des
 *   pièces n'aurait aucun sens. C'est le compte partagé par le badge du header
 *   et le récapitulatif.
 */
export function summarize(items: CartItem[]): CartSummary {
  if (items.length === 0) {
    return {
      items: [],
      itemCount: 0,
      subtotalCents: 0,
      deliveryCents: 0,
      totalCents: 0,
    };
  }

  const subtotalCents = items.reduce((acc, item) => {
    if (!item.unavailable) {
      return acc + item.lineTotalCents;
    }
    return acc;
  }, 0);

  const delivery =
    subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS;

  const total = subtotalCents + delivery;

  const count = items.reduce((acc, item) => {
    if (!item.unavailable) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return {
    items,
    itemCount: count,
    subtotalCents,
    deliveryCents: delivery,
    totalCents: total,
  };
}

/**
 * Vrai si `value` a exactement la forme d'une CartLine.
 * Niveau LIGNE : cette fonction juge UN candidat, jamais une collection.
 * Le `as` de la ligne 2 est une hypothèse immédiatement vérifiée par les
 * conditions qui suivent — c'est le seul endroit où un `as` est légitime.
 */
export function isCartLine(value: unknown): value is CartLine {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.productId === "string" &&
    candidate.productId.trim().length > 0 &&
    typeof candidate.quantity === "number" &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity > 0 &&
    typeof candidate.orderUnit === "string" &&
    (ORDER_UNITS as readonly string[]).includes(candidate.orderUnit)
  );
}

/**
 * Transforme une valeur inconnue (sortie de JSON.parse) en panier sûr.
 * Niveau TABLEAU : borne puis filtre, en déléguant le jugement de chaque
 * ligne à isCartLine. Le slice AVANT le filter : sur une entrée hostile
 * de 10 000 lignes, on borne le travail avant de le faire.
 */
export function parseCartLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.slice(0, MAX_CART_LINES).filter(isCartLine);
}


