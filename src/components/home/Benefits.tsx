import { benefits } from "@/data/site";
import type { Benefit } from "@/types/site";
import {
  LeafIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
} from "@/components/ui/icons";

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
    <section
      aria-labelledby="benefits-title"
      className="bg-primary-light/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
            Pourquoi FIG
          </p>
          <h2
            id="benefits-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Le goût du marché, le confort de la livraison
          </h2>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = iconByName[benefit.icon];
            return (
              <li
                key={benefit.id}
                className="border-border bg-surface flex flex-col rounded-3xl border p-6 shadow-sm"
              >
                <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                <p className="text-muted mt-2">{benefit.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
