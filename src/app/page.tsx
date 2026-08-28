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
 * La page est prérendue (aucune donnée par requête), mais LatestArticles dépend de la
 * date du jour. `revalidate` demande à Next de régénérer la page au maximum une fois
 * par heure : sans cela, « À lire cette semaine » resterait figé sur la date du build.
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
