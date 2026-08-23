import type { CustomerId, Order, OrderId } from "../domain.js";

export interface OrderRepository {
  save(order: Order): Promise<void>;
  getById(id: OrderId): Promise<Order | null>;
  getOwnedById(customerId: CustomerId, id: OrderId): Promise<Order | null>;
}
