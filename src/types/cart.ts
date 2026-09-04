/*
 * Modèle de données du panier.
 *
 * Deux représentations, à ne jamais confondre :
 *
 *   CartLine  — ce qui est PERSISTÉ (cookie). Le strict minimum, rien de dérivable.
 *   CartItem  — ce qui est AFFICHÉ. Recalculé à chaque rendu depuis les lignes + le catalogue.
 *
 * Règle pour savoir où placer un champ : s'il doit survivre à un rechargement de page,
 * il appartient à CartLine ; s'il se recalcule, il appartient à CartItem.
 *
 * ─── DEUX CONVENTIONS D'UNITÉS, VALABLES DANS TOUTE LA LOGIQUE PANIER ───
 *
 * 1. LES MONTANTS SONT DES ENTIERS DE CENTIMES, suffixés `Cents`.
 *    `number` ne porte aucune unité : seul le nom peut la transporter.
 *    En euros flottants, 6 poires + 3 framboises + 1 melon donnent 34.99999999999999.
 *    L'affichage montre « 35,00 € » (Intl arrondit) mais le test `>= 35` échoue : le client
 *    lit « livraison offerte dès 35 € », voit 35,00 €, et paie quand même 4,90 € de port.
 *    60 paniers du catalogue actuel sont dans ce cas. En centimes : 3500 >= 3500, fin du problème.
 *    On ne repasse en euros que dans formatPrice, au moment du rendu.
 *
 * 2. LES QUANTITÉS SONT DES ENTIERS DANS L'UNITÉ DE BASE DU PRODUIT.
 *    Grammes pour un produit vendu au kg, nombre de pièces pour un produit vendu à la pièce.
 *    1 kg → 1000, 500 g → 500, 3 melons → 3.
 *    Même raisonnement que les centimes : 0,5 kg en flottant subit les mêmes arrondis que 2,95 €.
 *    Surtout, fusionner 1 kg et 500 g redevient une addition (1000 + 500), ce qui permet à
 *    addLine / setLineQuantity / removeLine de travailler SANS consulter le catalogue.
 */
import type { Product } from "@/types/product";

/**
 * Unité dans laquelle le client passe commande.
 *
 * À distinguer de `ProductUnit` (types/product.ts), qui est la base de FACTURATION :
 * `price` s'entend toujours par kg ou par pièce, jamais par gramme.
 *
 * Toutes les combinaisons ne sont pas valides — 300 g de laitue n'a pas de sens.
 * TypeScript ne peut pas l'interdire (la contrainte vient du produit, pas de l'unité),
 * c'est donc vérifié à l'exécution, côté serveur, avant d'écrire dans le panier.
 */
export const ORDER_UNITS = ["kg", "g", "piece"] as const;
export type OrderUnit = (typeof ORDER_UNITS)[number]; //

/** Ce qui est réellement persisté dans le cookie : le strict minimum. */
export type CartLine = {
  productId: string;
  /** Entier, dans l'unité de base du produit : grammes si vendu au kg, pièces sinon. */
  quantity: number;
  /** Unité choisie par le client. N'affecte QUE la saisie et l'affichage, jamais les calculs. */
  orderUnit: OrderUnit;
};

/** Une ligne jointe à son produit, prête à l'affichage. Jamais persistée. */
export type CartItem = {
  product: Product;
  /** Reprise de la ligne : entier, dans l'unité de base du produit. */
  quantity: number;
  /** Prix × quantité, en centimes. L'unité de vente se lit dans `product.unit`. */
  lineTotalCents: number;
  /** Le produit est au panier mais n'est plus commandable : affiché, exclu du total. */
  unavailable: boolean;
  /** Unité choisie par le client, reprise de la ligne. Sert à afficher « 500 g » ou « 0,5 kg ». */
  orderUnit: OrderUnit;
};

export type CartSummary = {
  items: CartItem[];
  /** Nombre d'articles annoncé par le badge du header. Voir summarize() pour la règle. */
  itemCount: number;
  /** Total des lignes commandables, en centimes. Exclut les lignes indisponibles. */
  subtotalCents: number;
  /** Frais de port, en centimes. Vaut 0 sur un panier vide. */
  deliveryCents: number;
  /** subtotalCents + deliveryCents. */
  totalCents: number;
};
