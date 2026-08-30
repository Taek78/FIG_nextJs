/*
 * Persistance du panier — la seule couche qui touche aux cookies.
 * Niveau E/S : lire la chaîne, la parser, puis déléguer toute la validation
 * à parseCartLines (utils/cart.ts), qui est pure et testée.
 *
 * Règle : readCart ne lève JAMAIS. Un cookie corrompu est un panier vide,
 * pas une erreur 500 — sinon un visiteur au cookie cassé serait bloqué
 * définitivement (recharger renverrait le même cookie, donc la même erreur).
 */
import { cookies } from "next/headers";
import type { CartLine } from "@/types/cart";
import { parseCartLines } from "@/utils/cart";

const CART_COOKIE_NAME = "fig_cart";

/* `as const` requis : sans lui, sameSite s'élargit en `string` et set() refuse l'objet. */
const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 jours, en secondes
  secure: process.env.NODE_ENV === "production",
} as const;

export async function readCart(): Promise<CartLine[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE_NAME)?.value;

  // Pas de cookie : première visite. Cas normal, pas une erreur.
  if (!raw) {
    return [];
  }

  /*
   * `try` le plus étroit possible : seule JSON.parse a le DROIT d'échouer
   * (la chaîne vient du client). Un bug dans notre propre code doit
   * exploser en développement, pas devenir silencieusement un panier vide.
   * Le `let` déclaré dehors survit au bloc ; affecté dedans, consommé après.
   */
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  return parseCartLines(parsed);
}

/*
 * ⚠️ N'a d'appelant légitime que dans une Server Action ou un Route Handler :
 * pendant le rendu d'un composant, les en-têtes de réponse sont déjà partis
 * et Next lève « Cookies can only be modified in a Server Action… ».
 */
export async function writeCart(lines: CartLine[]): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE_NAME, JSON.stringify(lines), CART_COOKIE_OPTIONS);
}
