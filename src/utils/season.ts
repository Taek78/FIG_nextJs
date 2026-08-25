/*
 * Logique de saisonnalité.
 *
 * Le mois est TOUJOURS passé en paramètre (1 = janvier … 12 = décembre).
 * On n'appelle jamais `new Date()` ici : la fonction reste pure (même entrée →
 * même sortie), donc prévisible et facile à tester. C'est l'appelant qui décide
 * du mois (aujourd'hui une constante, demain peut-être la date réelle ou un filtre).
 */
import type { Product } from "@/types/product";

/** Mois affiché par la maquette. À remplacer plus tard par la date réelle côté appelant. */
export const CURRENT_MONTH = 8;

/** Vrai si le produit est de saison pour le mois donné. */
export function isInSeason(product: Product, month: number): boolean {
  return product.seasonMonths.includes(month);
}

/**
 * Retourne les produits de saison pour un mois donné.
 * `filter` crée un nouveau tableau ne contenant que les éléments pour lesquels
 * la fonction renvoie `true` ; le tableau d'origine n'est pas modifié.
 */
export function getSeasonalProducts(list: Product[], month: number): Product[] {
  return list.filter((product) => isInSeason(product, month));
}
