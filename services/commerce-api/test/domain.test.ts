import test from "node:test";
import assert from "node:assert/strict";
import { calculateBasketTotal } from "../src/commerce.js";
import type { Basket, Product } from "../src/domain.js";

const products = new Map<string, Product>([
  ["bread", { id: "bread", name: "Bread", price: { amountMinor: 250, currency: "TEST" }, available: true }],
]);

test("calculateBasketTotal uses authoritative product price", () => {
  const basket: Basket = {
    id: "b",
    customerId: "c",
    lines: [{ productId: "bread", quantity: 2, unitPrice: { amountMinor: 250, currency: "TEST" } }],
  };
  assert.deepEqual(calculateBasketTotal(basket, products), { amountMinor: 500, currency: "TEST" });
});
