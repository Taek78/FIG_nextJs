"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { NavLink } from "@/types/site";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

/*
 * Seul Client Component du site pour l'instant.
 * "use client" est nécessaire car on utilise un état (useState) et des événements (onClick,
 * écoute du clavier) : ces API n'existent que dans le navigateur, pas côté serveur.
 * Le reste du header reste un Server Component : seul ce petit morceau embarque du JS.
 */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  // useId génère un identifiant unique et stable pour relier le bouton au panneau (aria-controls).
  const panelId = useId();

  // Fermeture à la touche Échap, uniquement quand le menu est ouvert.
  // La fonction renvoyée "nettoie" l'écouteur quand le menu se ferme ou que le composant disparaît.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex size-11 items-center justify-center rounded-full text-text transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {/* sr-only : texte lu par les lecteurs d'écran mais invisible à l'écran. */}
        <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
        {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>

      {open && (
        <nav
          id={panelId}
          aria-label="Navigation mobile"
          className="absolute inset-x-0 top-full border-b border-border bg-surface shadow-lg"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
