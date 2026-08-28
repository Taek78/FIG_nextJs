import type { Metadata } from "next";
import { products } from "@/data/products";
import { CURRENT_MONTH } from "@/utils/season";
import {
  describeFilters,
  filterProducts,
  parseCatalogFilters,
} from "@/utils/catalog";
import CategoryFilter from "@/components/catalog/CategoryFilter";
import ProductResults from "@/components/catalog/ProductResults";

export const metadata: Metadata = {
  title: "Catalogue — FIG",
  description:
    "Tous les fruits et légumes FIG : de saison, bio, de producteurs identifiés.",
};

/*
 * `searchParams` est une promesse depuis Next 15 : la page doit être `async` et
 * l'attendre. Sa simple lecture rend la page dynamique — normal, le rendu dépend
 * de l'URL demandée.
 */
type CataloguePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Catalogue({ searchParams }: CataloguePageProps) {
  const filters = parseCatalogFilters(await searchParams);
  const selection = filterProducts(products, filters, CURRENT_MONTH);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Rayons
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Le catalogue
        </h1>
        <p className="text-muted mt-3 text-lg">
          Nos {describeFilters(filters)}, cueillis à maturité chez des
          producteurs identifiés.
        </p>
      </div>

      <CategoryFilter filters={filters} />

      {/* `aria-live` : quand le filtre change, le lecteur d'écran annonce le nouveau total. */}
      <p aria-live="polite" className="text-muted mb-6 text-sm">
        {selection.length} produit{selection.length > 1 ? "s" : ""}
      </p>

      <ProductResults products={selection} />
    </div>
  );
}
