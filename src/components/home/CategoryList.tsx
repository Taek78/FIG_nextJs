import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * Quatre entrées vers le catalogue. Chaque <li> est un lien entier (image + texte).
 * Responsive : 2 colonnes sur mobile, 4 dès lg.
 */
export default function CategoryList() {
  return (
    <section
      aria-labelledby="categories-title"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        id="categories-title"
        eyebrow="Rayons"
        title="Que cherchez-vous aujourd'hui ?"
        link={{ label: "Tout le catalogue", href: "/catalogue" }}
      />
      <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={category.href}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-background">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="block text-lg font-semibold group-hover:text-primary-dark">
                  {category.name}
                </span>
                <span className="mt-1 block text-sm text-muted">{category.description}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
