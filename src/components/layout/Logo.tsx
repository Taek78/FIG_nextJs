import Link from "next/link";
import { siteName } from "@/data/site";

/*
 * Logo FIG : pastille verte + nom en capitales. Réutilisé dans le header et le footer.
 * La prop `size` évite de dupliquer le composant pour deux tailles.
 */
export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const textSize = size === "lg" ? "text-3xl" : "text-2xl";
  const markSize = size === "lg" ? "size-10 text-lg" : "size-9 text-base";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      aria-label={`${siteName}, retour à l'accueil`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-full bg-brand-gradient font-bold text-white ${markSize}`}
      >
        F
      </span>
      <span className={`font-bold tracking-tight text-primary-dark ${textSize}`}>
        {siteName}
      </span>
    </Link>
  );
}
