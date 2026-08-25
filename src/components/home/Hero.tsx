import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

/*
 * Section d'ouverture : promesse de FIG + deux appels à l'action.
 * Sur mobile, le texte passe au-dessus de l'image (grid 1 colonne) ; dès lg, 2 colonnes.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-14"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient text-white shadow-lg">
        {/* Halo décoratif (aria-hidden : purement visuel). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-accent-lemon/30 blur-3xl"
        />
        <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:p-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent-lemon" />
              Livraison en vélo-cargo, du lundi au samedi
            </p>
            <h1
              id="hero-title"
              className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Des fruits et légumes frais,
              <br className="hidden sm:block" /> livrés le jour de la récolte.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
              FIG sélectionne chaque semaine le meilleur des producteurs de votre
              région et vous le livre à domicile, sans emballage superflu.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogue"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-primary-dark shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Voir le catalogue
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/catalogue?seasonal=true"
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/40 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Les produits de saison
              </Link>
            </div>
          </div>

          {/*
            Illustration provisoire (SVG) affichée via next/image.
            `priority` : c'est l'image au-dessus de la ligne de flottaison, on la charge tout de suite.
          */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-white/10">
            <Image
              src="/illustrations/hero-panier.svg"
              alt="Cagette en bois remplie de fruits et légumes frais"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
