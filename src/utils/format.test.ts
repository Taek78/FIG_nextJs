import { describe, expect, it } from "vitest";
import {
  formatPrice,
  formatPriceFromCents,
  formatQuantity,
} from "@/utils/format";

describe("formatPriceFromCents", () => {
  /*
   * On compare à formatPrice plutôt qu'à une chaîne littérale : Intl insère
   * une espace insécable avant le €, invisible et intestable à l'œil nu.
   * Le vrai contrat est la cohérence entre les deux fonctions.
   */
  it.each([
    [115, 1.15],
    [3500, 35],
    [0, 0],
    [1408, 14.08],
  ])("%i centimes → même rendu que formatPrice(%f)", (cents, euros) => {
    expect(formatPriceFromCents(cents)).toBe(formatPrice(euros));
  });
});

describe("formatQuantity", () => {
  it("singulier pour 1 pièce", () => {
    expect(formatQuantity(1, "piece")).toBe("1 pièce");
  });

  it("pluriel au-delà", () => {
    expect(formatQuantity(3, "piece")).toBe("3 pièces");
  });

  it.each([
    [500, "500 g"],
    [999, "999 g"],
  ])("%i g reste en grammes", (q, expected) => {
    expect(formatQuantity(q, "kg")).toBe(expected);
  });

  it.each([
    [1000, "1 kg"],
    [1500, "1,5 kg"],
    [1250, "1,25 kg"],
    [20000, "20 kg"],
  ])("%i g bascule en kilos : %s", (q, expected) => {
    expect(formatQuantity(q, "kg")).toBe(expected);
  });
});
