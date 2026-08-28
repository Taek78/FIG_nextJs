import { products } from "@/data/products";
import { CURRENT_MONTH, getSeasonalProducts } from "@/utils/season";
import ProductGrid from "@/components/ui/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";

/* Libellés des mois, indexés de 1 à 12 (l'index 0 est vide pour aligner sur les numéros de mois). */
const MONTH_NAMES = [
  "",
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export default function SeasonalProducts() {
  /*
   * Chaîne de traitement sur le tableau :
   *  1. getSeasonalProducts → filtre les produits du mois ;
   *  2. filter → on écarte les indisponibles de la vitrine ;
   *  3. slice(0, 8) → on ne garde que les 8 premiers pour l'accueil.
   * Chaque étape renvoie un nouveau tableau : `products` n'est jamais modifié.
   */
  const selection = getSeasonalProducts(products, CURRENT_MONTH)
    .filter((product) => product.available)
    .slice(0, 8);

  return (
    <section aria-labelledby="seasonal-title" className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="seasonal-title"
          eyebrow={`De saison en ${MONTH_NAMES[CURRENT_MONTH]}`}
          title="Au sommet de leur saison"
          description="Récoltés à maturité, ces fruits et légumes sont au meilleur de leur goût et de leur prix."
          link={{
            label: "Tous les produits de saison",
            href: "/catalogue?seasonal=true",
          }}
        />
        <ProductGrid products={selection} />
      </div>
    </section>
  );
}
