import ArticleCard from "@/components/ui/ArticleCard";
import type { Article } from "@/types/site";

type ArticlesGridProps = {
  articles: Article[];
};

export default function ArticlesGrid({ articles }: ArticlesGridProps) {
  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
        Aucun article disponible.
      </p>
    );
  }

  const sortedArticles = [...articles].sort( //[...articles] équivalent de toSorted (ES2023 => non reconnu par TS) en moderne 
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() //getTime retourne la date en milliseconde
  );

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sortedArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}