import { addToCart } from "@/lib/cartActions";
import type { Product } from "@/types/product";
import { CartIcon } from "@/components/ui/icons";
import SubmitButton from "@/components/ui/SubmitButton";

/*
 * Bouton « Ajouter » des cartes produit (ProductCard) : un mini-formulaire par
 * carte dont la seule donnée est le productId en champ caché — la quantité
 * ajoutée est décidée côté serveur (addToCart, lib/cartActions.ts), jamais par
 * le client. Reste un Server Component : l'état pending est délégué à
 * SubmitButton, seule feuille cliente.
 */
const addButtonClass =
  "bg-primary hover:bg-primary-dark focus-visible:outline-primary relative z-10 mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4";

export default function AddToCartForm({
  productId,
  productName,
}: {
  productId: Product["id"];
  productName: Product["name"];
}) {
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />

      {/* relative z-10 : passe au-dessus de la nappe cliquable du lien titre
    (after:absolute inset-0) — sans ça, le clic ouvre la fiche produit. */}
      <SubmitButton className={addButtonClass}>
        <CartIcon className="size-5" />

        <span>Ajouter</span>

        <span className="sr-only">{productName} au panier</span>
      </SubmitButton>
    </form>
  );
}
