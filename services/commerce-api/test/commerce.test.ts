import test from "node:test";
import assert from "node:assert/strict";
import { calculateBasketTotal, CommerceError, placeOrder } from "../src/commerce.js";
import type { Basket, Product } from "../src/domain.js";

const products = new Map<string, Product>([
  ["bread", { id: "bread", name: "Bread", price: { amountMinor: 250, currency: "USD" }, available: true }],
  ["milk", { id: "milk", name: "Milk", price: { amountMinor: 300, currency: "USD" }, available: true }],
]);

const basket: Basket = {
  id: "basket-1",
  customerId: "customer-1",
  lines: [
    { productId: "bread", quantity: 2, unitPrice: { amountMinor: 250, currency: "USD" } },
    { productId: "milk", quantity: 1, unitPrice: { amountMinor: 300, currency: "USD" } },
  ],
};

test("calculates the authoritative basket total from current product prices", () => {
  assert.deepEqual(calculateBasketTotal(basket, products), { amountMinor: 800, currency: "USD" });
});

test("places an order only for the authenticated customer's basket", () => {
  const order = placeOrder({ customerId: "customer-1" }, basket, products, "order-1");
  assert.equal(order.id, "order-1");
  assert.equal(order.status, "placed");
  assert.equal(order.total.amountMinor, 800);
});

test("rejects a basket owned by another customer", () => {
  assert.throws(
    () => placeOrder({ customerId: "customer-2" }, basket, products, "order-2"),
    CommerceError,
  );
});

test("rejects stale basket pricing", () => {
  const staleBasket = {
    ...basket,
    lines: [{ ...basket.lines[0], unitPrice: { amountMinor: 200, currency: "USD" } }],
  };
  assert.throws(() => calculateBasketTotal(staleBasket, products), CommerceError);
});
