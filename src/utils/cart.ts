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
import type { Product } from "@/types/product";
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
 * À implémenter :
 *  1. Ignorer silencieusement une quantité qui n'est pas un entier > 0 (renvoyer `lines`).
 *  2. Chercher la ligne existante par productId.
 *  3. Si elle existe : nouvelle quantité = ancienne + quantity, plafonnée à `maxQuantity`.
 *     Utiliser `map` (et non une affectation) pour conserver la POSITION de la ligne :
 *     réajouter un produit ne doit pas le faire sauter en bas du panier.
 *  4. Sinon : `[...lines, { productId, quantity, orderUnit }]`.
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
 * À implémenter :
 *  1. `quantity <= 0` → déléguer à `removeLine`, ne pas réécrire la suppression.
 *  2. Plafonner à `maxQuantity`.
 *  3. Produit absent du panier → renvoyer `lines` INCHANGÉ. Ne pas l'ajouter :
 *     c'est le travail d'addLine, et un « + » fantôme ne doit pas ressusciter
 *     un produit qu'on vient de retirer.
 *  4. Quand rien ne change, renvoyer la référence `lines` elle-même : React
 *     et useOptimistic sautent alors le rendu.
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

    const lineTotalCents = Math.round(
      (toCents(product.price) * line.quantity) / baseQuantityFor(product),
    );

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
 * Récapitulatif du panier.
 *
 * À implémenter :
 *  1. Panier vide → tout à zéro, FRAIS DE PORT COMPRIS. Le seuil de gratuité seul
 *     facturerait 4,90 € sur un panier sans rien.
 *  2. subtotalCents : somme des `lineTotalCents` des lignes commandables uniquement
 *     (exclure `unavailable`).
 *  3. deliveryCents : 0 si subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS, sinon
 *     DELIVERY_FEE_CENTS. Le seuil est inclusif — décision prise, à tester.
 *  4. totalCents = subtotalCents + deliveryCents.
 *  5. itemCount : additionner des grammes et des pièces n'a aucun sens. Compter le
 *     NOMBRE DE LIGNES commandables (« Panier, 3 articles ») est la seule règle
 *     cohérente ici. À figer par un test.
 *  6. Toujours passer la valeur initiale à `reduce` : `[].reduce((a, b) => a + b)`
 *     lève un TypeError, et le panier vide est justement ce cas.
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

  //count ne compte que les lignes commandables, pas les indisponibles.
  //motif : les items indisponibles ne seront jamais facturés ni livré : donc pas de panier.
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
