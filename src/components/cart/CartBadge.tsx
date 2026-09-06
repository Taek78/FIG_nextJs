/*
 * Badge panier du header : lit le cookie et réutilise le calcul de la page panier
 * (même itemCount via summarize — jamais de divergence entre header et récapitulatif).
 *
 * Conséquence assumée (phase 0) : le layout dépend d'un cookie, toutes les pages
 * sont donc rendues dynamiquement. La mise à jour après un ajout est assurée par
 * revalidatePath("/", "layout") dans les Server Actions — c'est pour ce composant
 * que le "layout" existe.
 */

import { products } from "@/data/products";
import { readCart } from "@/lib/cartStorage";
import { summarize, hydrateCart } from "@/utils/cart";
import Link from "next/link";
import { CartIcon } from "@/components/ui/icons";

/* Le style du bouton rond (iconButtonClass) appartient au Header, qui l'applique
   à ses trois icônes : il l'injecte via `className` au lieu d'être dupliqué ici. */
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
