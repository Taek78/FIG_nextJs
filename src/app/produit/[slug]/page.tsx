import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductPurchaseCard from "@/components/product/ProductPurchaseCard";

/*
 * Fiche produit /produit/[slug]. Comme searchParams, `params` est une Promise :
 * la page est async et l'attend. Slug inconnu → notFound() interrompt le rendu
 * et affiche la page 404 — pas besoin de return après.
 */
type ProduitPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProduitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Produit introuvable — FIG" };
  }
  return {
    title: `${product.name} — FIG`,
    description: product.description,
  };
}

export default async function Produit({ params }: ProduitPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          {product.type === "fruit" ? "Fruit" : "Légume"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
      </div>

      {/*
        Halos colorés DERRIÈRE la carte : c'est eux que son backdrop-blur floute —
        le verre n'existe que s'il a quelque chose à déformer. Décoratifs
        (aria-hidden), hors interaction (pointer-events-none).
      */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="bg-primary/25 pointer-events-none absolute -top-16 -left-20 size-72 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-accent-lemon/35 pointer-events-none absolute -right-16 -bottom-12 size-80 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-accent-orange/20 pointer-events-none absolute top-1/3 left-1/2 size-56 rounded-full blur-3xl"
        />
        <ProductPurchaseCard product={product} />
      </div>
    </div>
  );
}
