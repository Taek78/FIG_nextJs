import Link from "next/link";
import { footerColumns, legalLinks, siteName, siteTagline } from "@/data/site";
import Logo from "@/components/layout/Logo";

/*
 * Pied de page : marque + newsletter, colonnes de liens, barre légale.
 * Server Component. Le formulaire n'a pas de logique pour l'instant.
 */
export default function Footer() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
        <div className="lg:col-span-4">
          <Logo size="lg" />
          <p className="text-muted mt-4 text-base">{siteTagline}.</p>
          <p className="text-muted mt-2 max-w-sm text-sm">
            Recevez chaque semaine le calendrier de saison et nos idées de
            recettes.
          </p>
          <form
            action="/newsletter"
            className="mt-6 flex max-w-sm flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Votre adresse e-mail
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="votre@email.fr"
              className="border-border bg-background placeholder:text-muted focus:border-primary focus-visible:ring-primary/40 h-12 flex-1 rounded-full border px-5 text-sm focus:outline-none focus-visible:ring-2"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark focus-visible:outline-primary h-12 rounded-full px-6 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              S&apos;abonner
            </button>
          </form>
        </div>

        <nav
          aria-label="Liens du pied de page"
          className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8"
        >
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-primary focus-visible:outline-primary text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-border border-t">
        <div className="text-muted mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 {siteName}. Fruits et légumes livrés avec soin.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-primary focus-visible:outline-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
