import type { CartSummary } from "@/types/cart";
import { FREE_DELIVERY_THRESHOLD_CENTS } from "@/utils/cart";
import { formatPriceFromCents } from "@/utils/format";

/*
 * Le « bas de ticket » : sous-total, livraison, total. Tout est déjà calculé
 * par summarize() — ce composant ne fait qu'afficher un CartSummary, aucune
 * logique métier ici.
 *
 * `aria-live="polite"` : quand les quantités deviendront modifiables (phase 5),
 * le lecteur d'écran annoncera le nouveau total sans travail supplémentaire.
 */
export default function CartSummaryPanel({
  summary,
}: {
  summary: CartSummary;
}) {
  const unavailableCount = summary.items.filter((i) => i.unavailable).length;
  const remainingForFreeDelivery =
    FREE_DELIVERY_THRESHOLD_CENTS - summary.subtotalCents;

  return (
    <div className="border-border bg-surface rounded-3xl border p-6 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold">Récapitulatif</h2>

      <dl aria-live="polite" className="mt-5 space-y-3 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-muted">
            Sous-total ({summary.itemCount} article
            {summary.itemCount > 1 ? "s" : ""})
          </dt>
          <dd className="font-medium tabular-nums">
            {formatPriceFromCents(summary.subtotalCents)}
          </dd>
        </div>

        <div className="flex items-baseline justify-between">
          <dt className="text-muted">Livraison</dt>
          <dd className="font-medium tabular-nums">
            {summary.deliveryCents === 0 ? (
              <span className="text-primary font-semibold">Offerte</span>
            ) : (
              formatPriceFromCents(summary.deliveryCents)
            )}
          </dd>
        </div>

        {unavailableCount > 0 && (
          <p className="text-muted text-xs">
            {unavailableCount} article{unavailableCount > 1 ? "s" : ""}{" "}
            indisponible{unavailableCount > 1 ? "s" : ""} non compté
            {unavailableCount > 1 ? "s" : ""} dans le total.
          </p>
        )}

        <div className="border-border flex items-baseline justify-between border-t pt-4">
          <dt className="text-base font-semibold">Total</dt>
          <dd className="text-primary-dark text-xl font-bold tabular-nums">
            {formatPriceFromCents(summary.totalCents)}
          </dd>
        </div>
      </dl>

      {/* Incitation commerçante : n'apparaît que si la gratuité est encore atteignable. */}
      {summary.deliveryCents > 0 && (
        <p className="bg-primary-light/40 text-primary-dark mt-5 rounded-2xl p-3 text-sm">
          Plus que{" "}
          <strong>{formatPriceFromCents(remainingForFreeDelivery)}</strong> pour
          la livraison offerte.
        </p>
      )}

      <button
        type="button"
        disabled
        title="Paiement hors périmètre de la maquette"
        className="bg-primary mt-6 inline-flex h-12 w-full items-center justify-center rounded-full text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Commander
      </button>
      <p className="text-muted mt-2 text-center text-xs">
        Le paiement n&apos;est pas disponible dans cette maquette.
      </p>
    </div>
  );
}
