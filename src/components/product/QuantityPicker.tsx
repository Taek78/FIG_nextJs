"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import {
  QUANTITY_STEP,
  computeLineTotalCents,
  maxQuantityFor,
} from "@/utils/cart";
import { formatPriceFromCents, formatQuantity } from "@/utils/format";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

/*
 * Sélecteur de quantité de la fiche produit. État LOCAL : la quantité choisie
 * n'est pas encore dans le panier, elle ne vit que dans ce composant.
 *
 * Le pont vers le serveur est l'<input hidden> : React le met à jour à chaque
 * clic, et il part dans le FormData du <form> parent (ProductPurchaseCard)
 * vers addToCart à la soumission.
 *
 * Total et quantité passent par les MÊMES fonctions pures que le panier :
 * la fiche annonce au centime près ce que summarize facturera.
 *
 * Le conteneur est flex-1 : il occupe l'espace libre de la colonne d'achat
 * (le form parent est une colonne flex) et y centre stepper + total.
 */
const stepperButtonClass =
  "inline-flex size-12 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function QuantityPicker({ product }: { product: Product }) {
  const step = QUANTITY_STEP[product.unit];
  const max = maxQuantityFor(product);
  // Plancher = un pas, jamais 0 : sur une fiche, ne pas acheter ≠ retirer.
  const [quantity, setQuantity] = useState(step);

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-4">
      {/* Pilule de verre pleine largeur : − et + repoussés aux extrémités. */}
      <div className="ring-primary/10 flex w-full items-center justify-between rounded-full border border-white/60 bg-white/50 p-1.5 shadow-sm ring-1 backdrop-blur-md">
        {/* type="button" obligatoire : dans un form, un bouton nu est type="submit". */}
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(step, q - step))}
          className={`${stepperButtonClass} from-accent-berry/15 text-accent-berry hover:from-accent-berry/25 bg-linear-to-br to-white`}
        >
          <span className="sr-only">Diminuer la quantité</span>
          <MinusIcon className="size-5" />
        </button>
        <span className="text-base font-bold tabular-nums">
          {formatQuantity(quantity, product.unit)}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(max, q + step))}
          className={`${stepperButtonClass} from-primary-light/70 to-accent-lemon/40 text-primary-dark hover:from-primary-light bg-linear-to-br`}
        >
          <span className="sr-only">Augmenter la quantité</span>
          <PlusIcon className="size-5" />
        </button>
      </div>

      {/* aria-live : le lecteur d'écran annonce le nouveau total à chaque clic. */}
      <p
        aria-live="polite"
        className="from-primary/10 to-accent-lemon/15 ring-primary/10 flex w-full items-baseline justify-between rounded-2xl border border-white/60 bg-linear-to-r px-5 py-3 ring-1 backdrop-blur-md"
      >
        <span className="text-muted text-xs font-semibold tracking-wide uppercase">
          Total
        </span>
        <span className="text-primary-dark text-3xl font-bold tracking-tight tabular-nums">
          {formatPriceFromCents(computeLineTotalCents(product, quantity))}
        </span>
      </p>

      {/* La quantité choisie voyage vers addToCart par ce champ. */}
      <input type="hidden" name="quantity" value={quantity} />
    </div>
  );
}
