"use server";

/*
 * Server Actions du panier — la FRONTIÈRE DE CONFIANCE.
 *
 * Tout ce qui arrive ici (FormData) vient du client et peut être forgé : chaque
 * action revalide les types et l'existence du produit avant de toucher au cookie,
 * puis délègue les règles de quantité à la couche pure (utils/cart.ts).
 *
 * Schéma commun : lire (readCart) → transformer (fonction pure) → écrire
 * (writeCart) → revalidatePath("/", "layout"). Le "layout" n'est pas un excès :
 * le badge panier vit dans le layout racine et doit être re-rendu après chaque
 * modification.
 */
import { products } from "@/data/products";
import type { OrderUnit } from "@/types/cart";
import { readCart, writeCart } from "@/lib/cartStorage";
import {
  addLine,
  maxQuantityFor,
  removeLine,
  setLineQuantity,
} from "@/utils/cart";
import type { ProductUnit } from "@/types/product";
import { revalidatePath } from "next/cache";

export async function addToCart(formData: FormData): Promise<void> {
  const productId = formData.get("productId");
  if (typeof productId !== "string") {
    return;
  }
  const product = products.find((product) => product.id === productId);

  if (!product?.available) {
    return;
  }

  /** Quantité ajoutée par un clic « Ajouter » : 300 g au poids, 1 pièce sinon. */
  const defaultQuantity: Record<ProductUnit, number> = {
    kg: 300,
    piece: 1,
  };

  const orderUnit: OrderUnit = product.unit === "kg" ? "g" : "piece";

  const lines = await readCart();
  const next = addLine(
    lines,
    product.id,
    defaultQuantity[product.unit],
    orderUnit,
    maxQuantityFor(product),
  );
  await writeCart(next);

  revalidatePath("/", "layout");
}
export async function setQuantity(formData: FormData): Promise<void> {
  const productId = formData.get("productId");
  const rawQuantity = formData.get("quantity");

  if (typeof productId !== "string" || typeof rawQuantity !== "string") {
    return;
  }

  // Number("abc") → NaN : rejeté ensuite par les gardes « entier > 0 » de la couche pure.
  const quantity: number = Number(rawQuantity);

  const product = products.find((product) => productId === product.id);

  /*
   * Asymétrie voulue avec addToCart : ici seule l'EXISTENCE du produit est
   * exigée, pas sa disponibilité — un client doit pouvoir réduire ou vider la
   * ligne d'un produit devenu indisponible. Seul l'AJOUT exige un produit
   * disponible.
   */
  if (!product) {
    return;
  }

  const maxQuantity = maxQuantityFor(product);

  const lines = await readCart();
  const next = setLineQuantity(lines, productId, quantity, maxQuantity);
  await writeCart(next);

  revalidatePath("/", "layout");
}
/**
 * Retire une ligne entière. Aucune vérification catalogue : retirer un produit,
 * même disparu du catalogue, est toujours légitime.
 */
export async function removeFromCart(formData: FormData): Promise<void> {
  const productId = formData.get("productId");
  if (typeof productId !== "string") {
    return;
  }

  const lines = await readCart();
  const next = removeLine(lines, productId);
  await writeCart(next);

  revalidatePath("/", "layout");
}
