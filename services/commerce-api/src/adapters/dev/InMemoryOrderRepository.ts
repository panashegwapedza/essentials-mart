import type { CustomerId, Order, OrderId } from "../../domain.js";
import type { OrderRepository } from "../../ports/OrderRepository.js";

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<OrderId, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, structuredClone(order));
  }

  async getById(id: OrderId): Promise<Order | null> {
    const order = this.orders.get(id);
    return order ? structuredClone(order) : null;
  }

  async getOwnedById(customerId: CustomerId, id: OrderId): Promise<Order | null> {
    const order = await this.getById(id);
    return order?.customerId === customerId ? order : null;
  }
}
