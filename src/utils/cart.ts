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

/** 20 kg, en grammes. Plafond par ligne pour un produit vendu au poids. */
export const MAX_GRAMS_PER_LINE = 20_000;

/** Plafond par ligne pour un produit vendu à la pièce. */
export const MAX_PIECES_PER_LINE = 20;

/** Livraison offerte à partir de 35,00 €. Seuil INCLUSIF : 3500 exactement suffit. */
export const FREE_DELIVERY_THRESHOLD_CENTS = 3_500;

/** Frais de port en deçà du seuil : 4,90 €. */
export const DELIVERY_FEE_CENTS = 490;

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
  throw new Error("addLine : à implémenter");
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
  throw new Error("setLineQuantity : à implémenter");
}

/**
 * Retire une ligne entière. Idempotente : retirer un produit absent ne lève pas.
 * Un `filter` suffit.
 */
export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  throw new Error("removeLine : à implémenter");
}

/**
 * Jointure lignes × catalogue. Seule fonction du module à connaître les produits.
 *
 * À implémenter :
 *  1. Indexer le catalogue : `new Map(products.map((p) => [p.id, p]))`.
 *     À 32 produits, un `find()` dans la boucle serait tout aussi rapide — c'est
 *     une habitude prise avant que ça compte, pas une optimisation. Le dire, plutôt
 *     que de prétendre optimiser.
 *  2. Écarter les lignes orphelines (productId inconnu du catalogue) : `flatMap`
 *     filtre et transforme en une passe. Ne jamais produire `product: undefined`.
 *  3. lineTotalCents = Math.round(toCents(product.price) * quantity / baseQuantityFor(product))
 *     Arrondir UNE SEULE FOIS, ici. Courgette à 2,30 €/kg, 500 g → 230 × 500 / 1000 = 115.
 *  4. unavailable = !product.available — la ligne reste visible, mais hors total.
 *  5. Conserver l'ordre du panier, pas celui du catalogue.
 */
export function hydrateCart(
  lines: CartLine[],
  products: Product[],
): CartItem[] {
  throw new Error("hydrateCart : à implémenter");
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
  throw new Error("summarize : à implémenter");
}
