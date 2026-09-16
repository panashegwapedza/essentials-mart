import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { CommerceApplicationService } from "../../src/application/CommerceApplicationService.js";
import type { AuthenticatedPrincipal, Basket, Order, Product } from "../../src/domain.js";
import type { ProductRepository } from "../../src/ports/ProductRepository.js";
import type { BasketRepository } from "../../src/ports/BasketRepository.js";
import type { OrderRepository } from "../../src/ports/OrderRepository.js";
import type { CheckoutTransaction } from "../../src/ports/CheckoutTransaction.js";

const principal = (id: string): AuthenticatedPrincipal => ({ customerId: id });
const product: Product = {
  id: "bread",
  name: "Bread",
  price: { amountMinor: 250, currency: "ZWL" },
  available: true,
};

class Products implements ProductRepository {
  async list() { return [product]; }
  async getById(id: string) { return id === product.id ? product : null; }
}

class Baskets implements BasketRepository {
  data = new Map<string, Basket>();
  async getByCustomerId(customerId: string) { return this.data.get(customerId) ?? null; }
  async save(basket: Basket) { this.data.set(basket.customerId, structuredClone(basket)); }
}

class Orders implements OrderRepository {
  data = new Map<string, Order>();
  async save(order: Order) { this.data.set(order.id, structuredClone(order)); }
  async getById(orderId: string) {
    const order = this.data.get(orderId);
    return order ? structuredClone(order) : null;
  }
  async getOwnedById(customerId: string, orderId: string) {
    const order = this.data.get(orderId);
    return order?.customerId === customerId ? structuredClone(order) : null;
  }
  async listOwnedByCustomer(customerId: string) {
    return [...this.data.values()]
      .filter((order) => order.customerId === customerId)
      .map((order) => structuredClone(order));
  }
}

class Transaction implements CheckoutTransaction {
  committed = 0;
  async run<T>(work: () => Promise<T>) { return work(); }
  async commitCheckout(input: { customerId: string; basketId: string; order: unknown }) {
    this.committed++;
    return input.order;
  }
}

test("checkout commits through the transaction boundary", async () => {
  const baskets = new Baskets();
  const orders = new Orders();
  const transaction = new Transaction();
  const service = new CommerceApplicationService(new Products(), baskets, orders, transaction);
  const customer = principal(randomUUID());
  const basket = await service.getOrCreateBasket(customer);
  basket.lines = [{ productId: product.id, quantity: 1, unitPrice: product.price }];
  await baskets.save(basket);

  const order = await service.checkout(customer, "pickup");

  assert.equal(transaction.committed, 1);
  assert.equal(order.customerId, customer.customerId);
  assert.equal(order.total.amountMinor, 250);
});

test("an order is not exposed to another customer", async () => {
  const baskets = new Baskets();
  const orders = new Orders();
  const transaction = new Transaction();
  const service = new CommerceApplicationService(new Products(), baskets, orders, transaction);
  const owner = principal("customer-owner");
  const other = principal("customer-other");
  const basket = await service.getOrCreateBasket(owner);
  basket.lines = [{ productId: product.id, quantity: 1, unitPrice: product.price }];
  await baskets.save(basket);

  const order = await service.checkout(owner, "pickup");
  await orders.save(order);

  await assert.rejects(
    () => service.getOwnedOrder(other, order.id),
    (error: unknown) => error instanceof Error && "code" in error && error.code === "NOT_FOUND",
  );
  assert.deepEqual(await service.listOwnedOrders(other), []);
});
