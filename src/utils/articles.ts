/*
 * Logique éditoriale des articles.
 *
 * Comme dans utils/season.ts, ces fonctions sont PURES : la date de référence est
 * toujours passée en paramètre, jamais lue via `new Date()` ici. C'est l'appelant
 * qui décide du « maintenant ».
 *
 * Ce n'est pas qu'une question de style : la page d'accueil est prérendue par Next,
 * donc un `Date.now()` enfoui dans cette fonction serait figé à la date du build et
 * la liste « articles récents » ne bougerait plus jamais.
 */
import type { Article } from "@/types/site";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Trie du plus récent au plus ancien.
 * `[...articles]` crée une copie : `sort` modifie le tableau sur place, on ne veut
 * pas réordonner le tableau d'origine partagé par toute l'application.
 */
export function sortByDateDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Articles publiés dans les `maxDays` derniers jours, du plus récent au plus ancien.
 *
 * Les articles datés dans le futur sont volontairement exclus : ils servent de
 * publication programmée et ne doivent pas apparaître avant leur date.
 */
export function getLatestArticles(
  articles: Article[],
  maxDays: number,
  referenceDate: Date,
): Article[] {
  const reference = referenceDate.getTime();
  const limit = reference - maxDays * DAY_IN_MS;

  return sortByDateDesc(articles).filter((article) => {
    const published = new Date(article.date).getTime();
    return published >= limit && published <= reference;
  });
}
