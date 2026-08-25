/*
 * Les quatre entrées de navigation du catalogue affichées sur l'accueil.
 * Les URL utilisent des paramètres de requête (?type=, ?seasonal=, ?organic=)
 * que la future page /catalogue pourra lire pour filtrer les produits.
 */
import type { Category } from "@/types/site";

export const categories: Category[] = [
  {
    id: "fruits",
    name: "Fruits",
    description: "Du verger au panier, cueillis à maturité.",
    href: "/catalogue?type=fruit",
    image: "/illustrations/categorie-fruits.svg",
    imageAlt: "Pomme, orange et grappe de raisin",
    productType: "fruit",
  },
  {
    id: "legumes",
    name: "Légumes",
    description: "Racines, feuilles et légumes d'été.",
    href: "/catalogue?type=vegetable",
    image: "/illustrations/categorie-legumes.svg",
    imageAlt: "Tomate, carotte et poireau",
    productType: "vegetable",
  },
  {
    id: "saison",
    name: "De saison",
    description: "Ce qui pousse vraiment en ce moment.",
    href: "/catalogue?seasonal=true",
    image: "/illustrations/categorie-saison.svg",
    imageAlt: "Pêche, melon et courgette sous le soleil",
  },
  {
    id: "bio",
    name: "Bio",
    description: "Cultivé sans pesticides de synthèse.",
    href: "/catalogue?organic=true",
    image: "/illustrations/categorie-bio.svg",
    imageAlt: "Brocoli, radis et laitue sur fond vert",
  },
];
