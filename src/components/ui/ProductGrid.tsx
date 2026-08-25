import type { Product } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";

/*
 * Grille responsive de cartes produit : 2 colonnes sur mobile, 3 sur tablette, 4 sur ordinateur.
 * `map` transforme chaque produit du tableau en un <li> contenant une carte.
 * La prop `key` (unique et stable) aide React à suivre chaque élément entre deux rendus.
 */
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
