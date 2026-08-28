import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

/*
 * En-tête commun à toutes les sections de l'accueil.
 * Les "props" sont les paramètres d'un composant : ici le texte à afficher et,
 * optionnellement (point d'interrogation), un surtitre, une description, un lien.
 */
type SectionHeadingProps = {
  /** id du <h2>, relié à aria-labelledby de la <section> parente pour nommer la région. */
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
};

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  link,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p className="text-muted mt-3 text-lg">{description}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-primary hover:bg-primary/10 focus-visible:outline-primary inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:self-auto"
        >
          {link.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
