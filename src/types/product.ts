/*
 * Modèle de données d'un produit FIG.
 *
 * Un "type" TypeScript décrit la forme d'un objet : quelles propriétés existent
 * et de quel type elles sont. Si une donnée oublie un champ ou se trompe de type,
 * la compilation échoue — c'est notre filet de sécurité tant qu'il n'y a pas de backend.
 */

/** Un produit est soit un fruit, soit un légume (union de chaînes littérales). */
export type ProductType = "fruit" | "vegetable";

/** Unité de vente : au kilo ou à la pièce. Sert à afficher "/ kg" ou "/ pièce". */
export type ProductUnit = "kg" | "piece";

export type Product = {
  id: string;
  /** Identifiant lisible utilisé dans les URL (ex. /produit/pomme-gala). */
  slug: string;
  name: string;
  origin: string;
  variety: string;
  /** Prix en euros, pour une unité (1 kg ou 1 pièce). */
  price: number;
  unit: ProductUnit;
  available: boolean;
  type: ProductType;
  organic: boolean;
  /** Conditionnement (ex. "vrac", "barquette 250 g"). Stocké mais pas affiché sur l'accueil. */
  packaging: string;
  caliber: string;
  /** Chemin public de l'image (ex. /products/pomme-gala.svg). */
  image: string;
  /** Texte alternatif décrivant l'image pour les lecteurs d'écran. */
  imageAlt: string;
  /** Mois de pleine saison, de 1 (janvier) à 12 (décembre). */
  seasonMonths: number[];
};
