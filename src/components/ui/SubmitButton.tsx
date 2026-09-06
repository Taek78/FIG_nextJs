"use client";

import { useFormStatus } from "react-dom";

/*
 * Bouton de soumission générique avec état « en vol » (pending).
 *
 * `useFormStatus` lit l'état du <form> PARENT le plus proche, comme un consommateur
 * de contexte : ce composant doit donc vivre À L'INTÉRIEUR du form, séparé du
 * composant qui rend le form — c'est sa raison d'être, et c'est pourquoi seul le
 * formulaire soumis se grise, jamais ses voisins.
 *
 * Pendant l'action : `disabled` bloque les re-clics (donc les doubles envois
 * involontaires) et `aria-busy` expose l'état aux lecteurs d'écran.
 *
 * Générique : ne sait rien du panier. Le parent injecte le contenu (children) et
 * le style (className) ; le composant n'ajoute que ses classes d'état désactivé.
 * Utilisé par AddToCartForm ; prévu pour les steppers et tout futur formulaire.
 */
export default function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
      aria-busy={pending}
    >
      {children}
    </button>
  );
}
