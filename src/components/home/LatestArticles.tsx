import getLatestArticles from "../../lib/articlesFunction";
import { articles } from "../../data/site";

export default function LatestArticles() {
  const latestArticles = getLatestArticles(articles, 7);

  return (
    <section>
      <h2>Articles récents</h2>

      {latestArticles.length > 0 ? (
        <ul>
          {latestArticles.map((article) => (
            <li key={article.id}>
              <a href={`/actualites/${article.slug}`}>
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun article récent.</p>
      )}
    </section>
  );
}