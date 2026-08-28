import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { sortByDateDesc } from "@/utils/articles";
import ArticleGrid from "@/components/ui/ArticleGrid";

export const metadata: Metadata = {
  title: "Actualités — FIG",
  description:
    "Recettes de saison, conseils de conservation et portraits de producteurs : le magazine FIG.",
};

export default function Actualites() {
  const sorted = sortByDateDesc(articles);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Le magazine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Actualités
        </h1>
        <p className="text-muted mt-3 text-lg">
          Recettes de saison, conseils de conservation et portraits de
          producteurs.
        </p>
      </div>
      <ArticleGrid articles={sorted} />
    </div>
  );
}
