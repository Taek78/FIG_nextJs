import type { Metadata } from "next";
import { products } from "@/data/products";
import { hydrateCart, summarize } from "@/utils/cart";
import CartLineItem from "@/components/cart/CartLineItem";
import CartSummaryPanel from "@/components/cart/CartSummaryPanel";
import EmptyCart from "@/components/cart/EmptyCart";
import { readCart } from "@/lib/cartStorage";

export const metadata: Metadata = {
  title: "Panier — FIG",
  description: "Votre panier de fruits et légumes frais.",
};

export default async function Panier() {
  const lines = await readCart();
  const summary = summarize(hydrateCart(lines, products));
  const isEmpty = summary.items.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Votre commande
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Panier
        </h1>
        {!isEmpty && (
          <p className="text-muted mt-2">
            {summary.itemCount} article{summary.itemCount > 1 ? "s" : ""} prêt
            {summary.itemCount > 1 ? "s" : ""} à être livré
            {summary.itemCount > 1 ? "s" : ""}.
          </p>
        )}
      </div>

      {isEmpty ? (
        <div className="mx-auto max-w-2xl">
          <EmptyCart />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* La liste : un <ul> (comme partout), une carte par ligne, séparées d'un filet. */}
          <ul className="border-border bg-surface divide-border divide-y rounded-3xl border shadow-sm lg:col-span-2">
            {summary.items.map((item) => (
              <CartLineItem key={item.product.id} item={item} />
            ))}
          </ul>

          <aside aria-label="Récapitulatif de la commande">
            <CartSummaryPanel summary={summary} />
          </aside>
        </div>
      )}
    </div>
  );
}
