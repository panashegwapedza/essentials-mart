import type { CustomerId, Order, OrderId } from "../../domain.js";
import type { OrderRepository } from "../../ports/OrderRepository.js";
export class InMemoryOrderRepository implements OrderRepository {
 private readonly orders=new Map<OrderId,Order>();
 async save(order:Order){this.orders.set(order.id,structuredClone(order));}
 async getById(id:OrderId){const order=this.orders.get(id);return order?structuredClone(order):null;}
 async getOwnedById(customerId:CustomerId,id:OrderId){const order=await this.getById(id);return order?.customerId===customerId?order:null;}
 async listOwnedByCustomer(customerId:CustomerId){return Array.from(this.orders.values()).filter(o=>o.customerId===customerId).sort((a,b)=>(b.createdAt??'').localeCompare(a.createdAt??'')).map(o=>structuredClone(o));}
}
