import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

/*
 * État vide du panier. Un panier vide est une impasse : le rôle de ce composant
 * n'est pas d'afficher « rien », mais d'offrir la sortie — le catalogue.
 */
export default function EmptyCart() {
  return (
    <div className="border-border bg-surface rounded-3xl border border-dashed px-6 py-16 text-center">
      <div className="relative mx-auto h-40 w-56">
        <Image
          src="/illustrations/hero-panier.svg"
          alt=""
          fill
          sizes="224px"
          className="object-contain opacity-80"
        />
      </div>
      <h2 className="mt-6 text-xl font-semibold">Votre panier est vide</h2>
      <p className="text-muted mx-auto mt-2 max-w-md">
        Fruits et légumes de saison, récoltés la veille et livrés chez vous : le
        catalogue n&apos;attend que vous.
      </p>
      <Link
        href="/catalogue"
        className="bg-primary hover:bg-primary-dark focus-visible:outline-primary mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        Voir le catalogue
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}
