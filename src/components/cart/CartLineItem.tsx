import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/types/cart";
import { removeFromCart, setQuantity } from "@/lib/cartActions";
import {
  formatPrice,
  formatPriceFromCents,
  formatQuantity,
  formatUnit,
} from "@/utils/format";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import type { ProductUnit } from "@/types/product";

/*
 * Une ligne du panier, branchée sur les Server Actions.
 *
 * UN MINI-<form> PAR BOUTON, et non un formulaire unique avec `formAction` +
 * name/value sur les boutons : quand `formAction` est une FONCTION, React 19
 * réquisitionne le canal nom/valeur du bouton pour encoder l'action et ne
 * transmet PAS la paire name/value du bouton dans le FormData (vérifié sur le
 * HTML rendu : l'attribut name des boutons est retiré). Les <input hidden>,
 * eux, passent toujours — chaque bouton embarque donc ses propres champs.
 */
const stepperButtonClass =
  "inline-flex size-9 items-center justify-center rounded-full text-text transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const QUANTITY_STEP: Record<ProductUnit, number> = {
  kg: 300, // en g jusqu'à 1000 puis passe en kg
  piece: 1,
};

export default function CartLineItem({ item }: { item: CartItem }) {
  const { product } = item;
  const step = QUANTITY_STEP[product.unit];

  return (
    <li className="flex gap-4 p-5 sm:gap-5">
      {/* Illustration : vignette carrée, grisée si le produit n'est plus commandable. */}
      <div className="bg-background relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="96px"
          className={`object-cover ${item.unavailable ? "opacity-40 grayscale" : ""}`}
        />
      </div>

      {/* Identité du produit : nom (lien vers la fiche), brève description, prix unitaire. */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base leading-snug font-semibold sm:text-lg">
          <Link
            href={`/produit/${product.slug}`}
            className="hover:text-primary-dark focus-visible:outline-primary rounded focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-muted mt-0.5 truncate text-sm">
          {product.variety} · {product.origin}
        </p>
        <p className="text-muted mt-1 text-sm">
          {formatPrice(product.price)}{" "}
          <span className="text-muted/80">{formatUnit(product.unit)}</span>
        </p>

        {item.unavailable ? (
          <p className="text-accent-berry mt-3 text-sm font-medium">
            Indisponible — non compté dans le total.
          </p>
        ) : (
          /* Compteur − / quantité / + : les nouvelles quantités sont calculées
             AU RENDU, côté serveur ; le client ne fait que choisir un bouton.
             `quantity - step` peut atteindre 0 : setLineQuantity retire alors
             la ligne — le contrat « 0 supprime » de la phase 1 sert ici. */
          <div className="border-border bg-background mt-3 inline-flex items-center gap-1 rounded-full border p-0.5">
            <form action={setQuantity}>
              <input type="hidden" name="productId" value={product.id} />
              <input
                type="hidden"
                name="quantity"
                value={item.quantity - step}
              />
              <button type="submit" className={stepperButtonClass}>
                <span className="sr-only">
                  Diminuer la quantité de {product.name}
                </span>
                <MinusIcon className="size-4" />
              </button>
            </form>
            <span className="min-w-16 text-center text-sm font-semibold tabular-nums">
              {formatQuantity(item.quantity, product.unit)}
            </span>
            <form action={setQuantity}>
              <input type="hidden" name="productId" value={product.id} />
              <input
                type="hidden"
                name="quantity"
                value={item.quantity + step}
              />
              <button type="submit" className={stepperButtonClass}>
                <span className="sr-only">
                  Augmenter la quantité de {product.name}
                </span>
                <PlusIcon className="size-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Colonne droite : total de ligne et retrait. */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        {item.unavailable ? (
          <span className="text-muted text-base line-through">
            {formatPriceFromCents(item.lineTotalCents)}
          </span>
        ) : (
          <span className="text-primary-dark text-base font-semibold sm:text-lg">
            {formatPriceFromCents(item.lineTotalCents)}
          </span>
        )}
        <form action={removeFromCart}>
          <input type="hidden" name="productId" value={product.id} />
          <button
            type="submit"
            className="text-muted hover:text-accent-berry focus-visible:outline-primary inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <TrashIcon className="size-4" />
            Retirer
            <span className="sr-only"> {product.name} du panier</span>
          </button>
        </form>
      </div>
    </li>
  );
}
