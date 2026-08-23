import { randomUUID } from "node:crypto";
import { CommerceError, placeOrder } from "../commerce.js";
import type { AuthenticatedPrincipal, Basket, Product, Order } from "../domain.js";
import type { ProductRepository } from "../ports/ProductRepository.js";
import type { BasketRepository } from "../ports/BasketRepository.js";
import type { OrderRepository } from "../ports/OrderRepository.js";
import type { CheckoutTransaction } from "../ports/CheckoutTransaction.js";

export class CommerceApplicationService {
  constructor(
    private readonly products: ProductRepository,
    private readonly baskets: BasketRepository,
    private readonly orders: OrderRepository,
    private readonly transaction: CheckoutTransaction,
  ) {}

  async listProducts(): Promise<Product[]> {
    return this.products.list();
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.products.getById(id);
    if (!product) throw new CommerceError(`Product not found: ${id}`, "NOT_FOUND");
    return product;
  }

  async getOrCreateBasket(principal: AuthenticatedPrincipal): Promise<Basket> {
    const existing = await this.baskets.getByCustomerId(principal.customerId);
    if (existing) return existing;
    const basket: Basket = { id: randomUUID(), customerId: principal.customerId, lines: [] };
    await this.baskets.save(basket);
    return basket;
  }

  async addItem(principal: AuthenticatedPrincipal, productId: string, quantity: number): Promise<Basket> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new CommerceError("Quantity must be a positive integer", "INVALID_QUANTITY");
    }
    const product = await this.products.getById(productId);
    if (!product) throw new CommerceError(`Product not found: ${productId}`, "NOT_FOUND");
    if (!product.available) throw new CommerceError(`Product unavailable: ${productId}`, "PRODUCT_UNAVAILABLE");

    const basket = await this.getOrCreateBasket(principal);
    const lines = structuredClone(basket.lines);
    const existing = lines.find((line) => line.productId === product.id);
    if (existing) existing.quantity += quantity;
    else lines.push({ productId: product.id, quantity, unitPrice: structuredClone(product.price) });

    const updated = { ...basket, lines };
    await this.baskets.save(updated);
    return updated;
  }

  async removeItem(principal: AuthenticatedPrincipal, productId: string): Promise<Basket> {
    const basket = await this.getOrCreateBasket(principal);
    const lines = basket.lines.filter((line) => line.productId !== productId);
    if (lines.length === basket.lines.length) {
      throw new CommerceError(`Basket has no line for product: ${productId}`, "LINE_NOT_FOUND");
    }
    const updated = { ...basket, lines };
    await this.baskets.save(updated);
    return updated;
  }

  async checkout(principal: AuthenticatedPrincipal): Promise<Order> {
    return this.transaction.run(async () => {
      const basket = await this.getOrCreateBasket(principal);
      const freshProducts = new Map<string, Product>();
      for (const line of basket.lines) {
        const product = await this.products.getById(line.productId);
        if (product) freshProducts.set(product.id, product);
      }
      const order = placeOrder(principal, basket, freshProducts, randomUUID());
      await this.orders.save(order);
      await this.baskets.save({ ...basket, lines: [] });
      return order;
    });
  }

  async getOwnedOrder(principal: AuthenticatedPrincipal, orderId: string): Promise<Order> {
    const order = await this.orders.getOwnedById(principal.customerId, orderId);
    if (!order) throw new CommerceError(`Order not found: ${orderId}`, "NOT_FOUND");
    return order;
  }
}
