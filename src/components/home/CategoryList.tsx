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
              className="group border-border bg-surface focus-visible:outline-primary flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="bg-background relative aspect-4/3 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="group-hover:text-primary-dark block text-lg font-semibold">
                  {category.name}
                </span>
                <span className="text-muted mt-1 block text-sm">
                  {category.description}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
