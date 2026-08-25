import type { Article } from "@/types/site";

export default function getLatestArticles(
  articles: Article[],
  maxDays: number,
): Article[] {
  const now = Date.now();
  const maxAge = maxDays * 24 * 60 * 60 * 1000;
  const limit = now - maxAge;

  return articles.filter((article) => {
    const articleTime = new Date(article.date).getTime();

    return articleTime >= limit && articleTime <= now;
  });
}