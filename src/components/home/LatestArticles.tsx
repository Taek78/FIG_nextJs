import { articles } from "@/data/articles";
import { getLatestArticles } from "@/utils/articles";
import ArticleGrid from "@/components/ui/ArticleGrid";
import SectionHeading from "@/components/ui/SectionHeading";

/** Fenêtre de « fraîcheur » éditoriale, et nombre de cartes affichées sur l'accueil. */
const RECENT_DAYS = 7;
const MAX_ARTICLES = 3;

export default function LatestArticles() {
  /*
   * `new Date()` est appelé ICI, au bord de l'application, et passé à une fonction pure.
   * La page déclare `revalidate` (voir app/page.tsx) pour que ce « maintenant » soit
   * recalculé régulièrement au lieu de rester figé à la date du build.
   */
  const latest = getLatestArticles(articles, RECENT_DAYS, new Date()).slice(
    0,
    MAX_ARTICLES,
  );

  return (
    <section
      aria-labelledby="latest-articles-title"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        id="latest-articles-title"
        eyebrow="Le magazine"
        title="À lire cette semaine"
        description="Recettes, conseils de conservation et portraits de producteurs."
        link={{ label: "Toutes les actualités", href: "/actualites" }}
      />
      <ArticleGrid
        articles={latest}
        emptyMessage="Aucun article publié ces sept derniers jours."
      />
    </section>
  );
}
