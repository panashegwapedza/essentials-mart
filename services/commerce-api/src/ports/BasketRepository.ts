import type { Basket, CustomerId } from "../domain.js";

export interface BasketRepository {
  getByCustomerId(customerId: CustomerId): Promise<Basket | null>;
  save(basket: Basket): Promise<void>;
}
