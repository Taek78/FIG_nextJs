/*
 * Filtres du catalogue.
 *
 * Les liens du site pointaient déjà vers /catalogue?type=fruit, ?organic=true et
 * ?seasonal=true : ce fichier lit enfin ces paramètres. Comme utils/season.ts, tout
 * est pur — le mois est un paramètre, pas une lecture d'horloge.
 */
import type { Product, ProductType } from "@/types/product";
import { isInSeason } from "@/utils/season";

export type CatalogFilters = {
  type?: ProductType;
  organic: boolean;
  seasonal: boolean;
};

/** Forme des paramètres d'URL fournis par Next à une page. */
type SearchParams = Record<string, string | string[] | undefined>;

/** Une URL peut répéter un paramètre (?type=a&type=b) : on ne garde que la 1re valeur. */
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Traduit les paramètres d'URL en filtres typés.
 * Une valeur inconnue (?type=fromage) est ignorée plutôt que de faire échouer la page.
 */
export function parseCatalogFilters(params: SearchParams): CatalogFilters {
  const type = firstValue(params.type);

  return {
    type: type === "fruit" || type === "vegetable" ? type : undefined,
    organic: firstValue(params.organic) === "true",
    seasonal: firstValue(params.seasonal) === "true",
  };
}

/** Applique les filtres actifs. Un filtre absent ne restreint rien. */
export function filterProducts(
  list: Product[],
  filters: CatalogFilters,
  month: number,
): Product[] {
  return list.filter((product) => {
    if (filters.type && product.type !== filters.type) return false;
    if (filters.organic && !product.organic) return false;
    if (filters.seasonal && !isInSeason(product, month)) return false;
    return true;
  });
}

/**
 * Reconstruit l'URL du catalogue à partir d'un jeu de filtres.
 * Opération inverse de `parseCatalogFilters` : les filtres inactifs disparaissent
 * de l'URL, pour que /catalogue reste /catalogue et non /catalogue?organic=false.
 */
export function buildCatalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  if (filters.type) params.set("type", filters.type);
  if (filters.organic) params.set("organic", "true");
  if (filters.seasonal) params.set("seasonal", "true");

  const query = params.toString();
  return query ? `/catalogue?${query}` : "/catalogue";
}

/** Phrase décrivant la sélection courante, affichée sous le titre de la page. */
export function describeFilters(filters: CatalogFilters): string {
  const parts: string[] = [];

  if (filters.type === "fruit") parts.push("fruits");
  else if (filters.type === "vegetable") parts.push("légumes");
  else parts.push("produits");

  if (filters.organic) parts.push("issus de l'agriculture biologique");
  if (filters.seasonal) parts.push("de pleine saison");

  return parts.join(" ");
}
