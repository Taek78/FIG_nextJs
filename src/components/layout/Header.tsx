import Link from "next/link";
import { cartCount, mainNav } from "@/data/site";
import Logo from "@/components/layout/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import { CartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";

/*
 * En-tête du site (Server Component). Il inclut MobileMenu, qui est un Client Component :
 * un composant serveur peut tout à fait rendre un composant client.
 */
const iconButtonClass =
  "relative inline-flex size-11 items-center justify-center rounded-full text-text transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="relative mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileMenu links={mainNav} />
        <Logo />

        {/* Navigation desktop : masquée sous md (768 px), remplacée par le menu burger. */}
        <nav aria-label="Navigation principale" className="ml-8 hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-base font-medium text-text transition-colors hover:bg-primary/10 hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Recherche : simple formulaire GET vers /catalogue?q=… (aucune logique pour l'instant). */}
        <form role="search" action="/catalogue" className="ml-auto hidden items-center sm:flex">
          <label htmlFor="site-search" className="sr-only">
            Rechercher un fruit ou un légume
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Rechercher…"
              className="h-11 w-44 rounded-full border border-border bg-background pr-4 pl-10 text-sm transition-all placeholder:text-muted focus:w-60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:w-60 lg:focus:w-72"
            />
          </div>
        </form>

        {/* Actions : recherche (mobile), compte, panier fictif. */}
        <div className="ml-auto flex items-center gap-1 sm:ml-2">
          <Link href="/catalogue" className={`${iconButtonClass} sm:hidden`}>
            <span className="sr-only">Rechercher</span>
            <SearchIcon className="size-5" />
          </Link>
          <Link href="/compte" className={iconButtonClass}>
            <span className="sr-only">Mon compte</span>
            <UserIcon className="size-5" />
          </Link>
          <Link
            href="/panier"
            className={iconButtonClass}
            // Le lecteur d'écran lit "Panier, 3 articles" ; la pastille visuelle est donc masquée (aria-hidden).
            aria-label={`Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
          >
            <CartIcon className="size-5" />
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-accent-orange text-[11px] font-bold text-white"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
