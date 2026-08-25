import { products } from "@/data/products";
import ProductGrid from "@/components/ui/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export default function OrganicProducts() {
  /*
   * On garde les produits bio disponibles, triés du moins cher au plus cher,
   * puis on prend les 4 premiers.
   * `sort` modifie le tableau sur place : on l'applique donc au résultat de `filter`
   * (déjà une copie), jamais directement à `products`.
   */
  const selection = products
    .filter((product) => product.organic && product.available)
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  return (
    <section
      aria-labelledby="organic-title"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        id="organic-title"
        eyebrow="Agriculture biologique"
        title="Nos essentiels bio"
        description="Certifiés AB, cultivés sans pesticides de synthèse, à des prix qui restent accessibles."
        link={{ label: "Tout le rayon bio", href: "/catalogue?organic=true" }}
      />
      <ProductGrid products={selection} />
    </section>
  );
}
