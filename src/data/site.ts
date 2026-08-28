/*
 * Contenu éditorial du site FIG : identité, navigation, avantages, footer.
 * Centraliser ces données évite de les dupliquer dans le JSX et facilite
 * un futur branchement sur un CMS ou une API.
 *
 * Les articles vivent dans data/articles.ts, les produits dans data/products.ts.
 */
import type { Benefit, FooterColumn, NavLink } from "@/types/site";

export const siteName = "FIG";
export const siteTagline = "Fruits et légumes frais, livrés chez vous";

/** Nombre d'articles dans le panier fictif (pas de vrai panier pour l'instant). */
export const cartCount = 3;

export const mainNav: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Actualités", href: "/actualites" },
];

export const benefits: Benefit[] = [
  {
    id: "fraicheur",
    title: "Fraîcheur garantie",
    description:
      "Récoltés au plus tard la veille de la livraison et préparés le matin même.",
    icon: "leaf",
  },
  {
    id: "selection",
    title: "Sélection exigeante",
    description:
      "Chaque variété est goûtée et choisie pour sa saveur, pas seulement pour son calibre.",
    icon: "star",
  },
  {
    id: "livraison",
    title: "Livraison locale",
    description:
      "Tournées en vélo-cargo et utilitaires électriques, créneau de 2 h au choix.",
    icon: "truck",
  },
  {
    id: "producteurs",
    title: "Producteurs identifiés",
    description:
      "Le nom de la ferme et sa région figurent sur chaque fiche produit.",
    icon: "mapPin",
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Boutique",
    links: [
      { label: "Tous les produits", href: "/catalogue" },
      { label: "Fruits", href: "/catalogue?type=fruit" },
      { label: "Légumes", href: "/catalogue?type=vegetable" },
      { label: "De saison", href: "/catalogue?seasonal=true" },
      { label: "Bio", href: "/catalogue?organic=true" },
    ],
  },
  {
    title: "Livraison",
    links: [
      { label: "Zones et créneaux", href: "/aide/livraison" },
      { label: "Suivre ma commande", href: "/compte/commandes" },
      { label: "Questions fréquentes", href: "/aide/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "FIG",
    links: [
      { label: "Notre démarche", href: "/a-propos" },
      { label: "Nos producteurs", href: "/producteurs" },
      {
        label: "Calendrier des saisons",
        href: "/actualites/calendrier-fruits-legumes-aout",
      },
      { label: "Actualités", href: "/actualites" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "CGV", href: "/cgv" },
];
