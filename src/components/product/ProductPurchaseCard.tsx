import Image from "next/image";
import type { Product } from "@/types/product";
import { addToCart } from "@/lib/cartActions";
import { formatPrice, formatUnit } from "@/utils/format";
import QuantityPicker from "@/components/product/QuantityPicker";
import SubmitButton from "@/components/ui/SubmitButton";
import { CartIcon } from "@/components/ui/icons";

/*
 * Carte d'achat de la fiche produit (app/produit/[slug]) : identité complète
 * (image, variété, description, prix) + bloc d'achat. Server Component : seul
 * QuantityPicker embarque du JS, le <form> pointe directement sur addToCart.
 * Produit indisponible : les informations restent, le bloc d'achat disparaît.
 *
 * Style glassmorphique : la carte est translucide (bg-white/55 + backdrop-blur)
 * et tire sa profondeur des halos colorés placés DERRIÈRE elle par la page —
 * sans eux, le flou n'aurait rien à flouter.
 */
const addButtonClass =
  "bg-brand-gradient shadow-primary/25 hover:shadow-primary/35 focus-visible:outline-primary inline-flex h-13 w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4";

export default function ProductPurchaseCard({ product }: { product: Product }) {
  return (
    <article className="shadow-primary/10 ring-primary/10 relative grid gap-8 overflow-hidden rounded-4xl border border-white/60 bg-white/55 p-6 shadow-xl ring-1 backdrop-blur-xl sm:grid-cols-2 sm:p-8">
      {/* Reflet du verre : un voile dégradé très léger sur la moitié haute. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/60 to-transparent"
      />

      <div className="from-primary-light/60 to-accent-lemon/20 relative aspect-square overflow-hidden rounded-3xl bg-linear-to-br shadow-inner">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          priority
          sizes="(min-width: 640px) 50vw, 100vw"
          className={`object-cover ${product.available ? "" : "opacity-40 grayscale"}`}
        />
      </div>

      <div className="relative flex flex-col">
        <p className="text-muted text-sm font-medium tracking-wide">
          {product.variety} · {product.origin}
        </p>
        <p className="text-muted mt-4 leading-relaxed">{product.description}</p>
        <p className="mt-5 flex items-baseline gap-2">
          <span className="text-primary-dark text-3xl font-bold tracking-tight">
            {formatPrice(product.price)}
          </span>
          <span className="text-muted text-sm">{formatUnit(product.unit)}</span>
        </p>

        {product.available ? (
          /* Un seul <form> : hidden productId + quantité du picker + soumission. */
          <form
            action={addToCart}
            className="mt-6 flex flex-1 flex-col items-stretch gap-5"
          >
            <input type="hidden" name="productId" value={product.id} />
            <QuantityPicker product={product} />
            <SubmitButton className={addButtonClass}>
              <CartIcon className="size-5" />
              <span>Ajouter au panier</span>
              <span className="sr-only"> — {product.name}</span>
            </SubmitButton>
          </form>
        ) : (
          <p className="text-accent-berry mt-auto pt-8 text-sm font-medium">
            Indisponible pour le moment.
          </p>
        )}
      </div>
    </article>
  );
}
