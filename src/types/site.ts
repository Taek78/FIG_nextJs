/*
 * Modèles de données éditoriales du site (hors produits, décrits dans types/product.ts).
 */
import type { ProductType } from "@/types/product";

export type Article = {
  id: string;
  /** Identifiant lisible utilisé dans l'URL (/actualites/<slug>). L'URL est dérivée, jamais stockée. */
  slug: string;
  title: string;
  /** Résumé affiché sur la carte, sous le titre. */
  excerpt: string;
  image: string;
  /** Texte alternatif décrivant l'image pour les lecteurs d'écran. */
  imageAlt: string;
  /** Date de publication au format ISO (AAAA-MM-JJ). */
  date: string;
  /** Rubrique affichée en pastille sur la carte (ex. "Conservation"). */
  topic: string;
  /** Durée de lecture en minutes. Un nombre, pour rester triable et traduisible. */
  readingMinutes: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  /** Lien vers le catalogue, pré-filtré via des paramètres de requête. */
  href: string;
  image: string;
  imageAlt: string;
  /** Renseigné uniquement pour les rayons qui ciblent un type de produit. */
  productType?: ProductType;
};

export type NavLink = {
  label: string;
  href: string;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
  icon: "leaf" | "star" | "truck" | "mapPin";
};

export type FooterColumn = {
  title: string;
  links: NavLink[];
};
