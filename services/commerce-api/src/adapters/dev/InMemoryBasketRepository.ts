import { randomUUID } from "node:crypto";
import type { Basket, CustomerId } from "../../domain.js";
import type { BasketRepository } from "../../ports/BasketRepository.js";

export class InMemoryBasketRepository implements BasketRepository {
  private readonly baskets = new Map<CustomerId, Basket>();

  async getByCustomerId(customerId: CustomerId): Promise<Basket | null> {
    const basket = this.baskets.get(customerId);
    return basket ? structuredClone(basket) : null;
  }

  async save(basket: Basket): Promise<void> {
    this.baskets.set(basket.customerId, structuredClone(basket));
  }

  static create(customerId: CustomerId): Basket {
    return { id: randomUUID(), customerId, lines: [] };
  }
}
