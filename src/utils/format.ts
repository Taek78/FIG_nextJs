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
