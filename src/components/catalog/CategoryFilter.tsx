import Link from "next/link";
import { buildCatalogHref, type CatalogFilters } from "@/utils/catalog";

/*
 * Barre de rayons du catalogue.
 *
 * Ce sont de simples liens vers la même page avec d'autres paramètres : aucun
 * JavaScript côté navigateur, donc pas de "use client".
 *
 * Chaque rayon se COMBINE aux filtres déjà actifs au lieu de les remplacer :
 * depuis « Fruits », cliquer « Bio » mène à ?type=fruit&organic=true, et cliquer
 * de nouveau sur un rayon actif le retire. « Fruits » et « Légumes » restent
 * exclusifs entre eux, un produit ne pouvant pas être les deux.
 */
type Rayon = {
  label: string;
  isActive: (filters: CatalogFilters) => boolean;
  /** Filtres obtenus en cliquant sur ce rayon, à partir des filtres courants. */
  toggle: (filters: CatalogFilters) => CatalogFilters;
};

const NO_FILTER: CatalogFilters = {
  type: undefined,
  organic: false,
  seasonal: false,
};

const rayons: Rayon[] = [
  {
    label: "Tout le catalogue",
    isActive: (f) => !f.type && !f.organic && !f.seasonal,
    toggle: () => NO_FILTER,
  },
  {
    label: "Fruits",
    isActive: (f) => f.type === "fruit",
    toggle: (f) => ({ ...f, type: f.type === "fruit" ? undefined : "fruit" }),
  },
  {
    label: "Légumes",
    isActive: (f) => f.type === "vegetable",
    toggle: (f) => ({
      ...f,
      type: f.type === "vegetable" ? undefined : "vegetable",
    }),
  },
  {
    label: "De saison",
    isActive: (f) => f.seasonal,
    toggle: (f) => ({ ...f, seasonal: !f.seasonal }),
  },
  {
    label: "Bio",
    isActive: (f) => f.organic,
    toggle: (f) => ({ ...f, organic: !f.organic }),
  },
];

const baseChipClass =
  "inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function CategoryFilter({
  filters,
}: {
  filters: CatalogFilters;
}) {
  return (
    <nav aria-label="Filtrer par rayon" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {rayons.map((rayon) => {
          const active = rayon.isActive(filters);

          return (
            <li key={rayon.label}>
              <Link
                href={buildCatalogHref(rayon.toggle(filters))}
                /*
                 * `aria-current="true"` et non "page" : plusieurs rayons peuvent être
                 * actifs en même temps, ils désignent une sélection, pas la page courante.
                 * La couleur seule ne suffirait pas à signaler l'état.
                 */
                aria-current={active ? "true" : undefined}
                className={`${baseChipClass} ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-text hover:border-primary hover:text-primary-dark"
                }`}
              >
                {rayon.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
