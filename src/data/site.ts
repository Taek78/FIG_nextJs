/*
 * Contenu éditorial du site FIG : identité, navigation, avantages, articles, footer.
 * Centraliser ces données évite de les dupliquer dans le JSX et facilite
 * un futur branchement sur un CMS ou une API.
 */
import type { Article, Benefit, FooterColumn, NavLink } from "@/types/site";

export const siteName = "FIG";
export const siteTagline = "Fruits et légumes frais, livrés chez vous";

/** Nombre d'articles dans le panier fictif (pas de vrai panier pour l'instant). */
export const cartCount = 3;

export const mainNav: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalog" },
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


export const articles: Article[] = [
  {
    id: 1,
    title: "Que mange-t-on en août ?",
    slug: "calendrier-fruits-legumes-aout",
    description:
      "Découvrez les fruits et légumes à privilégier au mois d’août.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Saisonnalité",
    date: "2026-08-25",
    excerpt:
      "Tomates, pêches, courgettes et haricots verts sont au sommet de leur saison.",
    readingTime: "4 min",
    href: "/actualites/calendrier-fruits-legumes-aout",
    imageAlt: "Panier de fruits et légumes d’été",
    topic: "Saisonnalité",
  },
  {
    id: 2,
    title: "Comment bien conserver ses tomates ?",
    slug: "bien-conserver-tomates",
    description:
      "Nos conseils pour préserver le goût et la texture de vos tomates.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Conservation",
    date: "2026-08-24",
    excerpt:
      "Réfrigérateur ou panier à température ambiante ? Adoptez les bons gestes.",
    readingTime: "3 min",
    href: "/actualites/bien-conserver-tomates",
    imageAlt: "Tomates mûres disposées dans un panier",
    topic: "Conservation",
  },
  {
    id: 3,
    title: "Salade de pêches, tomates et basilic",
    slug: "salade-peches-tomates-basilic",
    description:
      "Une recette estivale fraîche, colorée et rapide à préparer.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Recettes",
    date: "2026-08-22",
    excerpt:
      "Associez la douceur des pêches à l’acidité des tomates en quelques minutes.",
    readingTime: "5 min",
    href: "/actualites/salade-peches-tomates-basilic",
    imageAlt: "Salade de pêches, tomates et feuilles de basilic",
    topic: "Cuisine",
  },
  {
    id: 4,
    title: "À la rencontre de nos producteurs locaux",
    slug: "rencontre-producteurs-locaux",
    description:
      "Découvrez les fermes et les personnes qui cultivent les produits FIG.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Producteurs",
    date: "2026-08-21",
    excerpt:
      "Des producteurs passionnés nous racontent leur métier et leurs méthodes.",
    readingTime: "6 min",
    href: "/actualites/rencontre-producteurs-locaux",
    imageAlt: "Producteur récoltant des légumes dans son exploitation",
    topic: "Producteurs",
  },
  {
    id: 5,
    title: "Pourquoi choisir des fruits et légumes bio ?",
    slug: "pourquoi-choisir-fruits-legumes-bio",
    description:
      "Les principes et les bénéfices de l’agriculture biologique expliqués simplement.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Agriculture biologique",
    date: "2026-08-18",
    excerpt:
      "Comprenez les labels et faites vos achats bio plus sereinement.",
    readingTime: "7 min",
    href: "/actualites/pourquoi-choisir-fruits-legumes-bio",
    imageAlt: "Cagette de fruits et légumes biologiques",
    topic: "Bio",
  },
  {
    id: 6,
    title: "Cinq astuces pour réduire le gaspillage alimentaire",
    slug: "reduire-gaspillage-alimentaire",
    description:
      "Des habitudes simples pour utiliser vos fruits et légumes jusqu’au bout.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Conseils",
    date: "2026-08-12",
    excerpt:
      "Conservation, congélation et recettes anti-gaspi : rien ne se perd.",
    readingTime: "5 min",
    href: "/actualites/reduire-gaspillage-alimentaire",
    imageAlt: "Épluchures de légumes préparées pour être réutilisées",
    topic: "Anti-gaspillage",
  },
  {
    id: 7,
    title: "Quels légumes conserver hors du réfrigérateur ?",
    slug: "legumes-hors-refrigerateur",
    description:
      "Tous les légumes ne se conservent pas mieux au froid.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Conservation",
    date: "2026-08-05",
    excerpt:
      "Pommes de terre, oignons et courges préfèrent un endroit frais et sec.",
    readingTime: "4 min",
    href: "/actualites/legumes-hors-refrigerateur",
    imageAlt: "Légumes conservés dans des paniers hors du réfrigérateur",
    topic: "Conservation",
  },
  {
    id: 8,
    title: "Poêlée de légumes d’été en vingt minutes",
    slug: "poelee-legumes-ete",
    description:
      "Un plat simple et savoureux pour cuisiner les légumes du panier.",
    image: "/images/articles/marche-legumes.jpg",
    category: "Recettes",
    date: "2026-07-31",
    excerpt:
      "Courgette, poivron, aubergine et tomate réunis dans une recette rapide.",
    readingTime: "3 min",
    href: "/actualites/poelee-legumes-ete",
    imageAlt: "Poêlée composée de légumes d’été colorés",
    topic: "Cuisine",
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
      { label: "Calendrier des saisons", href: "/actualites/calendrier-aout" },
      { label: "Actualités", href: "/actualites" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "CGV", href: "/cgv" },
];
