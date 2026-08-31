/*
 * Petites fonctions de formatage partagées par plusieurs composants.
 * Elles s'appuient sur l'API Intl du navigateur/Node : pas de dépendance.
 */
import type { ProductUnit } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** 2.95 → "2,95 €" */
export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

/**
 * `Record<ProductUnit, string>` oblige à fournir un libellé pour CHAQUE unité :
 * si on ajoute "botte" au type ProductUnit, TypeScript exigera de compléter ici.
 */
const unitLabels: Record<ProductUnit, string> = {
  kg: "/ kg",
  piece: "/ pièce",
};

export function formatUnit(unit: ProductUnit): string {
  return unitLabels[unit];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "2026-08-14" → "14 août 2026" */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/** 115 → "1,15 €". Nos montants panier circulent en centimes entiers ; la
 * conversion en euros n'a lieu qu'ici, au moment de l'affichage. */
export function formatPriceFromCents(cents: number): string {
  return formatPrice(cents / 100);
}

const weightFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

/**
 * Affiche une quantité stockée en unité de base (grammes ou pièces).
 * 1 → "1 pièce", 3 → "3 pièces", 500 → "500 g", 1500 → "1,5 kg", 1000 → "1 kg".
 * Intl (et non toFixed) : virgule française et décimales inutiles supprimées.
 */
export function formatQuantity(quantity: number, unit: ProductUnit): string {
  if (unit === "piece") {
    return `${quantity} pièce${quantity > 1 ? "s" : ""}`;
  }
  if (quantity < 1000) {
    return `${quantity} g`;
  }
  return `${weightFormatter.format(quantity / 1000)} kg`;
}
