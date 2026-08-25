import Image from "next/image";
import Link from "next/link";
import type { Article } from "../../types/site";

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={article.href}
        className="relative block aspect-[3/2] overflow-hidden"
      >
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-4 p-6">
        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-800">
          {article.topic}
        </span>

        <h3 className="text-xl font-bold leading-snug text-gray-900">
          <Link
            href={article.href}
            className="transition-colors hover:text-green-700"
          >
            {article.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
          <time dateTime={article.date}>
            {new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(article.date))}
          </time>

          <span>{article.readingTime}</span>
        </div>
      </div>
    </article>
  );
}