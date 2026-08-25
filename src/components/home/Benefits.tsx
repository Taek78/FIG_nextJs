import { benefits } from "@/data/site";
import type { Benefit } from "@/types/site";
import { LeafIcon, MapPinIcon, StarIcon, TruckIcon } from "@/components/ui/icons";

/*
 * Table de correspondance clé → composant d'icône.
 * `Record<Benefit["icon"], …>` : si on ajoute une clé au type Benefit sans l'ajouter ici,
 * TypeScript refuse de compiler. Impossible d'oublier une icône.
 */
const iconByName: Record<Benefit["icon"], typeof LeafIcon> = {
  leaf: LeafIcon,
  star: StarIcon,
  truck: TruckIcon,
  mapPin: MapPinIcon,
};

export default function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="bg-primary-light/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
            Pourquoi FIG
          </p>
          <h2 id="benefits-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Le goût du marché, le confort de la livraison
          </h2>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = iconByName[benefit.icon];
            return (
              <li
                key={benefit.id}
                className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-muted">{benefit.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
