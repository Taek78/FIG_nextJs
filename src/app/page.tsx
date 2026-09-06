import Hero from "@/components/home/Hero";
import CategoryList from "@/components/home/CategoryList";
import SeasonalProducts from "@/components/home/SeasonalProducts";
import OrganicProducts from "@/components/home/OrganicProducts";
import Benefits from "@/components/home/Benefits";
import LatestArticles from "@/components/home/LatestArticles";

/*
 * Page d'accueil : un simple assemblage de sections, dans l'ordre de lecture.
 * Chaque section est un Server Component autonome qui va chercher ses propres données.
 */

/*
 * `revalidate` date d'avant le panier : la page était alors prérendue, et
 * LatestArticles (qui dépend de la date du jour) devait être régénéré au plus
 * une fois par heure. Depuis que le badge panier lit un cookie dans le layout,
 * TOUTES les pages sont rendues à la requête et cette constante est sans effet.
 * Conservée en garde-fou : si l'accueil redevenait statique un jour,
 * « À lire cette semaine » ne se figerait pas à la date du build.
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryList />
      <SeasonalProducts />
      <OrganicProducts />
      <Benefits />
      <LatestArticles />
    </>
  );
}
