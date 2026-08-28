/*
 * Articles du magazine FIG.
 *
 * DONNÉES PROVISOIRES : les textes sont rédigés pour la maquette et les pages de
 * détail (/actualites/<slug>) restent à créer.
 *
 * Le champ `href` a été supprimé du modèle : l'URL se déduit du slug, la stocker
 * en double exposait à ce que les deux divergent.
 */
import type { Article } from "@/types/site";

export const articles: Article[] = [
  {
    id: "a01",
    slug: "calendrier-fruits-legumes-aout",
    title: "Que mange-t-on en août ?",
    excerpt:
      "Tomates, pêches, courgettes et haricots verts sont au sommet de leur saison.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Panier de fruits et légumes d’été",
    date: "2026-08-25",
    topic: "Saisonnalité",
    readingMinutes: 4,
  },
  {
    id: "a02",
    slug: "bien-conserver-tomates",
    title: "Comment bien conserver ses tomates ?",
    excerpt:
      "Réfrigérateur ou panier à température ambiante ? Adoptez les bons gestes.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Tomates mûres disposées dans un panier",
    date: "2026-08-24",
    topic: "Conservation",
    readingMinutes: 3,
  },
  {
    id: "a03",
    slug: "salade-peches-tomates-basilic",
    title: "Salade de pêches, tomates et basilic",
    excerpt:
      "Associez la douceur des pêches à l’acidité des tomates en quelques minutes.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Salade de pêches, tomates et feuilles de basilic",
    date: "2026-08-22",
    topic: "Cuisine",
    readingMinutes: 5,
  },
  {
    id: "a04",
    slug: "rencontre-producteurs-locaux",
    title: "À la rencontre de nos producteurs locaux",
    excerpt:
      "Des producteurs passionnés nous racontent leur métier et leurs méthodes.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Producteur récoltant des légumes dans son exploitation",
    date: "2026-08-21",
    topic: "Producteurs",
    readingMinutes: 6,
  },
  {
    id: "a05",
    slug: "pourquoi-choisir-fruits-legumes-bio",
    title: "Pourquoi choisir des fruits et légumes bio ?",
    excerpt: "Comprenez les labels et faites vos achats bio plus sereinement.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Cagette de fruits et légumes biologiques",
    date: "2026-08-18",
    topic: "Bio",
    readingMinutes: 7,
  },
  {
    id: "a06",
    slug: "reduire-gaspillage-alimentaire",
    title: "Cinq astuces pour réduire le gaspillage alimentaire",
    excerpt:
      "Conservation, congélation et recettes anti-gaspi : rien ne se perd.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Épluchures de légumes préparées pour être réutilisées",
    date: "2026-08-12",
    topic: "Anti-gaspillage",
    readingMinutes: 5,
  },
  {
    id: "a07",
    slug: "legumes-hors-refrigerateur",
    title: "Quels légumes conserver hors du réfrigérateur ?",
    excerpt:
      "Pommes de terre, oignons et courges préfèrent un endroit frais et sec.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Légumes conservés dans des paniers hors du réfrigérateur",
    date: "2026-08-05",
    topic: "Conservation",
    readingMinutes: 4,
  },
  {
    id: "a08",
    slug: "poelee-legumes-ete",
    title: "Poêlée de légumes d’été en vingt minutes",
    excerpt:
      "Courgette, poivron, aubergine et tomate réunis dans une recette rapide.",
    image: "/images/articles/marche-legumes.jpg",
    imageAlt: "Poêlée composée de légumes d’été colorés",
    date: "2026-07-31",
    topic: "Cuisine",
    readingMinutes: 3,
  },
];
