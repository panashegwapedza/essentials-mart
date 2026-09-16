import { describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { CommerceApplicationService } from "../../src/application/CommerceApplicationService.js";
import type { AuthenticatedPrincipal, Basket, Order, Product } from "../../src/domain.js";
import type { ProductRepository } from "../../src/ports/ProductRepository.js";
import type { BasketRepository } from "../../src/ports/BasketRepository.js";
import type { OrderRepository } from "../../src/ports/OrderRepository.js";
import type { CheckoutTransaction } from "../../src/ports/CheckoutTransaction.js";

const principal = (id: string): AuthenticatedPrincipal => ({ customerId: id });
const product: Product = { id: "bread", name: "Bread", price: { amountMinor: 250, currency: "ZWL" }, available: true };

class Products implements ProductRepository { async list() { return [product]; } async getById(id: string) { return id === product.id ? product : null; } }
class Baskets implements BasketRepository {
  data = new Map<string, Basket>();
  async getByCustomerId(customerId: string) { return this.data.get(customerId) ?? null; }
  async save(basket: Basket) { this.data.set(basket.customerId, structuredClone(basket)); }
}
class Orders implements OrderRepository {
  data = new Map<string, Order>();
  async save(order: Order) { this.data.set(order.id, structuredClone(order)); }
  async getOwnedById(customerId: string, orderId: string) { const order = this.data.get(orderId); return order?.customerId === customerId ? structuredClone(order) : null; }
  async listOwnedByCustomer(customerId: string) { return [...this.data.values()].filter(o => o.customerId === customerId).map(o => structuredClone(o)); }
}
class Transaction implements CheckoutTransaction {
  committed = 0;
  async run<T>(work: () => Promise<T>) { return work(); }
  async commitCheckout(input: { customerId: string; basketId: string; order: Order }) { this.committed++; return input.order; }
}

describe("commerce integrity", () => {
  it("commits checkout through the transaction boundary", async () => {
    const baskets = new Baskets();
    const orders = new Orders();
    const transaction = new Transaction();
    const service = new CommerceApplicationService(new Products(), baskets, orders, transaction);
    const p = principal(randomUUID());
    const basket = await service.getOrCreateBasket(p);
    basket.lines = [{ productId: product.id, quantity: 1, unitPrice: product.price }];
    await baskets.save(basket);

    const order = await service.checkout(p, "pickup");

    expect(transaction.committed).toBe(1);
    expect(order.customerId).toBe(p.customerId);
    expect(order.total.amountMinor).toBe(250);
  });

  it("does not expose an order to another customer", async () => {
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

    await expect(service.getOwnedOrder(other, order.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(service.listOwnedOrders(other)).resolves.toEqual([]);
  });
});
