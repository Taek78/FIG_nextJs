import ArticleCard from "@/components/ui/ArticleCard";
import type { Article } from "@/types/site";

/*
 * Grille responsive de cartes article : 1 colonne sur mobile, 2 sur tablette, 3 sur ordinateur.
 * Composant purement présentatif : il affiche les articles DANS L'ORDRE REÇU.
 * Le tri appartient à l'appelant (voir utils/articles.ts), qui seul sait ce qu'il veut montrer.
 *
 * Même structure <ul>/<li> que ProductGrid : une liste d'éléments est une liste,
 * et les lecteurs d'écran annoncent alors le nombre de résultats.
 */
type ArticleGridProps = {
  articles: Article[];
  /** Message affiché quand la liste est vide. */
  emptyMessage?: string;
};

export default function ArticleGrid({
  articles,
  emptyMessage = "Aucun article disponible.",
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <p className="border-border bg-surface text-muted rounded-3xl border border-dashed p-8 text-center">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
}
