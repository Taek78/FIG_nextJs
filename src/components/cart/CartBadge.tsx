//Server Component qui lit le cookie panier et réutilise le calcul de la page panier (même itemCount, jamais de divergence entre header et récapitulatif).
//Conséquence : le layout dépend d'un cookie → toutes les pages sont rendues dynamiquement. Coût accepté en phase 0.
//La mise à jour après « Ajouter » est assurée par revalidatePath("/", "layout") dans les actions — c'est pour ce composant que le "layout" existe.

import { products } from "@/data/products";

import { readCart } from "@/lib/cartStorage";
import { summarize, hydrateCart } from "@/utils/cart";
import Link from "next/link";
import { CartIcon } from "@/components/ui/icons";

// { className }: { className?: string } car le style du bouton rond (iconButtonClass) appartient au Header, qui l'applique à ses trois icônes. Le badge ne doit pas le dupliquer — le parent le lui passe.
export default async function CartBadge({ className }: { className?: string }) {
  const lines = await readCart();
  const items = hydrateCart(lines, products);
  const itemCount = summarize(items).itemCount;

  return (
    <Link
      href="/panier"
      className={className}
      // Le lecteur d'écran lit "Panier, 3 articles" ; la pastille visuelle est donc masquée (aria-hidden).
      aria-label={`Panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`}
    >
      <CartIcon className="size-5" />
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="bg-accent-orange absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}
