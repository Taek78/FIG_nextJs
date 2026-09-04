import { describe, expect, it } from "vitest";
import type { CartItem, CartLine } from "@/types/cart";
import type { Product } from "@/types/product";
import {
  DELIVERY_FEE_CENTS,
  FREE_DELIVERY_THRESHOLD_CENTS,
  MAX_CART_LINES,
  addLine,
  hydrateCart,
  isCartLine,
  parseCartLines,
  removeLine,
  setLineQuantity,
  summarize,
} from "@/utils/cart";

/*
 * Fabriques de données de test.
 * On construit nos propres produits plutôt que d'importer le vrai catalogue :
 * les valeurs sont maîtrisées, et aucun test ne cassera le jour où un prix change.
 */
const line = (
  productId: string,
  quantity: number,
  orderUnit: CartLine["orderUnit"] = "g",
): CartLine => ({ productId, quantity, orderUnit });

const product = (
  overrides: Partial<Product> & Pick<Product, "id">,
): Product => ({
  slug: overrides.id,
  name: `Produit ${overrides.id}`,
  origin: "Test, France",
  variety: "Test",
  price: 1,
  unit: "kg",
  available: true,
  type: "vegetable",
  organic: false,
  packaging: "vrac",
  caliber: "-",
  image: `/products/${overrides.id}.svg`,
  imageAlt: "",
  seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  ...overrides,
});

/** Catalogue de test : la courgette du bug d'arrondi, un produit à la pièce, un indisponible. */
const CATALOGUE: Product[] = [
  product({ id: "v05", name: "Courgette verte", price: 2.3, unit: "kg" }),
  product({ id: "f12", name: "Melon charentais", price: 3.9, unit: "piece" }),
  product({
    id: "v09",
    name: "Laitue batavia",
    price: 1.2,
    unit: "piece",
    available: false,
  }),
];

const item = (lineTotalCents: number, unavailable = false): CartItem => ({
  product: CATALOGUE[0],
  quantity: 1,
  orderUnit: "g",
  lineTotalCents,
  unavailable,
});

describe("removeLine", () => {
  it("retire la ligne visée et conserve l'ordre des autres", () => {
    const r = removeLine([line("a", 1), line("b", 2), line("c", 3)], "b");
    expect(r.map((l) => l.productId)).toEqual(["a", "c"]);
  });

  it("est idempotente : retirer un produit absent ne change rien", () => {
    expect(removeLine([line("a", 1)], "z")).toHaveLength(1);
  });

  it("ne mute pas le tableau d'origine", () => {
    const source = [line("a", 1)];
    removeLine(source, "a");
    expect(source).toHaveLength(1);
  });
});

describe("addLine", () => {
  it("ajoute dans un panier vide", () => {
    const r = addLine([], "v05", 1000, "kg", 20000);
    expect(r).toEqual([{ productId: "v05", quantity: 1000, orderUnit: "kg" }]);
  });

  it("fusionne les quantités quand le produit est déjà présent", () => {
    const r = addLine([line("v05", 1000)], "v05", 500, "g", 20000);
    expect(r).toHaveLength(1);
    expect(r[0].quantity).toBe(1500);
  });

  it("plafonne la fusion à maxQuantity", () => {
    const r = addLine([line("v05", 19000)], "v05", 5000, "g", 20000);
    expect(r[0].quantity).toBe(20000);
  });

  it("plafonne aussi une nouvelle ligne", () => {
    const r = addLine([], "v05", 99999, "g", 20000);
    expect(r[0].quantity).toBe(20000);
  });

  it("conserve la position de la ligne fusionnée", () => {
    const r = addLine(
      [line("a", 1), line("b", 1), line("c", 1)],
      "a",
      1,
      "g",
      20000,
    );
    expect(r.map((l) => l.productId)).toEqual(["a", "b", "c"]);
  });

  it("ne touche pas aux autres lignes", () => {
    const r = addLine([line("a", 1), line("b", 2)], "a", 1, "g", 20000);
    expect(r[1].quantity).toBe(2);
  });

  it.each([0, -3, 1.5, NaN, Infinity])(
    "ignore la quantité invalide %p",
    (q) => {
      const source = [line("a", 5)];
      expect(addLine(source, "a", q, "g", 20000)).toBe(source);
    },
  );

  it("ne mute ni le tableau ni les objets d'origine", () => {
    const original = line("v05", 1000);
    const source = [original];
    addLine(source, "v05", 500, "g", 20000);
    expect(original.quantity).toBe(1000);
    expect(source).toHaveLength(1);
  });
});

describe("setLineQuantity", () => {
  it("REMPLACE la quantité, ne l'additionne pas", () => {
    const r = setLineQuantity([line("v05", 1000)], "v05", 500, 20000);
    expect(r[0].quantity).toBe(500);
  });

  it.each([0, -3])("quantité %p → retire la ligne", (q) => {
    expect(setLineQuantity([line("v05", 1000)], "v05", q, 20000)).toHaveLength(
      0,
    );
  });

  it("plafonne au-delà de maxQuantity", () => {
    const r = setLineQuantity([line("v05", 1000)], "v05", 99999, 20000);
    expect(r[0].quantity).toBe(20000);
  });

  it("accepte un réglage exactement au plafond", () => {
    const r = setLineQuantity([line("v05", 5000)], "v05", 20000, 20000);
    expect(r[0].quantity).toBe(20000);
  });

  it("produit absent → même référence, sans ajout", () => {
    const source = [line("v05", 1000)];
    expect(setLineQuantity(source, "inconnu", 500, 20000)).toBe(source);
  });

  it("quantité inchangée → même référence (pas de rendu inutile)", () => {
    const source = [line("v05", 1000)];
    expect(setLineQuantity(source, "v05", 1000, 20000)).toBe(source);
  });

  it("déjà au plafond, on demande plus → même référence", () => {
    const source = [line("v05", 20000)];
    expect(setLineQuantity(source, "v05", 25000, 20000)).toBe(source);
  });

  it.each([1.5, NaN])("ignore la quantité invalide %p", (q) => {
    const source = [line("v05", 1000)];
    expect(setLineQuantity(source, "v05", q, 20000)).toBe(source);
  });

  it("ne mute pas l'objet d'origine", () => {
    const original = line("v05", 1000);
    setLineQuantity([original], "v05", 500, 20000);
    expect(original.quantity).toBe(1000);
  });
});

describe("hydrateCart", () => {
  it("joint chaque ligne à son produit, dans l'ordre du panier", () => {
    const r = hydrateCart(
      [line("f12", 3, "piece"), line("v05", 500)],
      CATALOGUE,
    );
    expect(r.map((i) => i.product.id)).toEqual(["f12", "v05"]);
  });

  it("LE test des centimes : courgette 2,30 €/kg × 500 g = 115", () => {
    const r = hydrateCart([line("v05", 500)], CATALOGUE);
    expect(r[0].lineTotalCents).toBe(115);
  });

  it("produit à la pièce : melon 3,90 € × 3 = 1170", () => {
    const r = hydrateCart([line("f12", 3, "piece")], CATALOGUE);
    expect(r[0].lineTotalCents).toBe(1170);
  });

  it("arrondit une seule fois : 230 × 333 / 1000 = 76,59 → 77", () => {
    const r = hydrateCart([line("v05", 333)], CATALOGUE);
    expect(r[0].lineTotalCents).toBe(77);
  });

  it("écarte silencieusement une ligne orpheline", () => {
    const r = hydrateCart([line("v05", 500), line("zzz", 1)], CATALOGUE);
    expect(r).toHaveLength(1);
  });

  it("panier vide → tableau vide", () => {
    expect(hydrateCart([], CATALOGUE)).toEqual([]);
  });

  it("marque un produit indisponible sans l'écarter", () => {
    const r = hydrateCart([line("v09", 2, "piece")], CATALOGUE);
    expect(r).toHaveLength(1);
    expect(r[0].unavailable).toBe(true);
  });

  it("produit exactement les champs de CartItem, sans fuite de CartLine", () => {
    const r = hydrateCart([line("v05", 500)], CATALOGUE);
    expect(Object.keys(r[0]).sort()).toEqual([
      "lineTotalCents",
      "orderUnit",
      "product",
      "quantity",
      "unavailable",
    ]);
  });
});

describe("summarize", () => {
  it("exclut les lignes indisponibles du sous-total mais les garde dans items", () => {
    const r = summarize([item(115), item(1170), item(240, true)]);
    expect(r.subtotalCents).toBe(1285);
    expect(r.items).toHaveLength(3);
  });

  it("itemCount ne compte que les lignes commandables", () => {
    const r = summarize([item(115), item(240, true)]);
    expect(r.itemCount).toBe(1);
  });

  it("facture la livraison sous le seuil", () => {
    const r = summarize([item(3499)]);
    expect(r.deliveryCents).toBe(DELIVERY_FEE_CENTS);
    expect(r.totalCents).toBe(3499 + DELIVERY_FEE_CENTS);
  });

  it("le seuil est inclusif : 35,00 € pile → livraison offerte", () => {
    expect(summarize([item(FREE_DELIVERY_THRESHOLD_CENTS)]).deliveryCents).toBe(
      0,
    );
  });

  it("panier vide → tout à zéro, frais de port compris", () => {
    expect(summarize([])).toEqual({
      items: [],
      itemCount: 0,
      subtotalCents: 0,
      deliveryCents: 0,
      totalCents: 0,
    });
  });
});

describe("isCartLine", () => {
  it("accepte une ligne bien formée", () => {
    expect(
      isCartLine({ productId: "v05", quantity: 500, orderUnit: "g" }),
    ).toBe(true);
  });

  it.each([
    ["null", null],
    ["un nombre", 7],
    ["une chaîne", "panier"],
    ["productId absent", { quantity: 1, orderUnit: "g" }],
    ["productId vide", { productId: "  ", quantity: 1, orderUnit: "g" }],
    ["quantité 0", { productId: "a", quantity: 0, orderUnit: "g" }],
    ["quantité négative", { productId: "a", quantity: -1, orderUnit: "g" }],
    ["quantité décimale", { productId: "a", quantity: 1.5, orderUnit: "g" }],
    ["quantité en chaîne", { productId: "a", quantity: "3", orderUnit: "g" }],
    ["unité inventée", { productId: "a", quantity: 1, orderUnit: "tonne" }],
  ])("rejette %s", (_label, value) => {
    expect(isCartLine(value)).toBe(false);
  });
});

describe("parseCartLines", () => {
  it.each([null, undefined, 42, "texte", { items: [] }, true])(
    "non-tableau %p → panier vide",
    (raw) => {
      expect(parseCartLines(raw)).toEqual([]);
    },
  );

  it("conserve les lignes valides d'un tableau mêlé d'entrées hostiles", () => {
    const mixte = [
      line("v05", 500),
      null,
      7,
      { productId: "a", quantity: 0, orderUnit: "g" },
      line("f12", 3, "piece"),
    ];
    expect(parseCartLines(mixte).map((l) => l.productId)).toEqual([
      "v05",
      "f12",
    ]);
  });

  it("borne à MAX_CART_LINES", () => {
    const flood = Array.from({ length: 200 }, (_, i) => line(`p${i}`, 1));
    expect(parseCartLines(flood)).toHaveLength(MAX_CART_LINES);
  });

  it("aller-retour : stringify puis parse rend le panier intact", () => {
    const panier = [line("v05", 500), line("f12", 3, "piece")];
    expect(parseCartLines(JSON.parse(JSON.stringify(panier)))).toEqual(panier);
  });
});
