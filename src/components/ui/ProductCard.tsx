import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, formatUnit } from "@/utils/format";

/*
 * Carte produit réutilisée par les sections "de saison" et "bio".
 * Server Component : aucune interaction, donc pas de "use client".
 */
export default function ProductCard({ product }: { product: Product }) {
  const unavailable = !product.available;

  return (
    <article className="group border-border bg-surface focus-within:ring-primary relative flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-shadow duration-300 focus-within:ring-2 focus-within:ring-offset-2 hover:shadow-lg">
      {/*
        next/image optimise le chargement (lazy, dimensions réservées → pas de saut de mise en page).
        `fill` remplit le conteneur parent positionné (relative + aspect-square = ratio 1:1 uniforme).
        `sizes` indique la largeur réelle de l'image selon l'écran pour choisir la bonne résolution.
      */}
      <div className="bg-background relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            unavailable ? "opacity-40 grayscale" : ""
          }`}
        />

        {/* Badges : bio (vert) et indisponible (gris). Ils restent lisibles pour tous. */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.organic && (
            <span className="bg-primary rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Bio
            </span>
          )}
          {unavailable && (
            <span className="bg-text/80 rounded-full px-2.5 py-1 text-xs font-semibold text-white">
              Indisponible
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-muted text-sm">
          {product.variety} · {product.origin}
        </p>
        <h3 className="text-lg leading-snug font-semibold">
          {/*
            Un seul lien par carte (bon pour les lecteurs d'écran). `after:absolute after:inset-0`
            étend sa zone cliquable à toute la carte, car l'<article> est en `relative`.
          */}
          <Link
            href={`/produit/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto flex items-baseline gap-1.5 pt-3">
          <span className="text-primary-dark text-xl font-semibold">
            {formatPrice(product.price)}
          </span>
          <span className="text-muted text-sm">{formatUnit(product.unit)}</span>
        </p>
      </div>
    </article>
  );
}
