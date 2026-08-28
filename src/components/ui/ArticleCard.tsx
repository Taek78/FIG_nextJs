import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/site";
import { formatDate } from "@/utils/format";

/*
 * Carte article, alignée sur ProductCard : mêmes tokens de couleur, même rayon,
 * et surtout UN SEUL lien par carte. `after:absolute after:inset-0` étend la zone
 * cliquable du titre à toute la carte (l'<article> est en `relative`), ce qui évite
 * d'annoncer deux fois la même destination aux lecteurs d'écran.
 */
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group border-border bg-surface focus-within:ring-primary relative flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-background relative aspect-3/2 overflow-hidden">
        {/* `sizes` suit la grille d'ArticleGrid : 1 colonne, puis 2 dès sm, puis 3 dès lg. */}
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <span className="bg-primary/10 text-primary-dark w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
          {article.topic}
        </span>

        <h3 className="text-xl leading-snug font-semibold">
          <Link
            href={`/actualites/${article.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>

        <p className="text-muted line-clamp-3 text-sm leading-6">
          {article.excerpt}
        </p>

        <div className="border-border text-muted mt-auto flex items-center justify-between border-t pt-4 text-xs">
          {/* `dateTime` donne la date lisible par une machine, le texte la version française. */}
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span>{article.readingMinutes} min de lecture</span>
        </div>
      </div>
    </article>
  );
}
