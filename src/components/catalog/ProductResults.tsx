import Link from "next/link";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/ui/ProductGrid";

/*
 * Résultats du catalogue : la grille, ou un message quand un filtre ne renvoie rien.
 * (Anciennement ProductPage.tsx — le nom laissait croire à une page alors que c'est
 * une section rendue par app/catalogue/page.tsx.)
 */
export default function ProductResults({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border-border bg-surface rounded-3xl border border-dashed p-10 text-center">
        <p className="text-muted">
          Aucun produit ne correspond à ce rayon pour le moment.
        </p>
        <Link
          href="/catalogue"
          className="text-primary hover:bg-primary/10 focus-visible:outline-primary mt-4 inline-flex items-center rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Voir tout le catalogue
        </Link>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
