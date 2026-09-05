import type { Basket, BasketLine, CustomerId, Money, Order, OrderId, Product, ProductId } from "../../domain.js";
import type { ProductRepository } from "../../ports/ProductRepository.js";
import type { BasketRepository } from "../../ports/BasketRepository.js";
import type { OrderRepository } from "../../ports/OrderRepository.js";
import type { CheckoutTransaction } from "../../ports/CheckoutTransaction.js";

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase persistence requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  return { url: url.replace(/\/$/, ""), key };
}

export async function supabaseRest<T>(table: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${table}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${table} request failed (${response.status}): ${body.slice(0, 500)}`);
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function supabaseRpc<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = await response.text();
    let message = payload.slice(0, 500);
    try {
      const parsed = JSON.parse(payload);
      message = parsed.message ?? message;
    } catch {}
    throw new Error(`Supabase RPC ${functionName} failed (${response.status}): ${message}`);
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

function money(row: any): Money {
  return { amountMinor: Math.round(Number(row.price) * 100), currency: row.currency };
}

function product(row: any): Product {
  return { id: row.id, name: row.name, price: money(row), available: Boolean(row.is_active) };
}

async function ensureCustomer(externalCustomerId: CustomerId): Promise<string> {
  const found = await supabaseRest<any[]>(`customers?select=id&external_customer_id=eq.${encodeURIComponent(externalCustomerId)}&limit=1`);
  if (found?.[0]?.id) return found[0].id;
  const created = await supabaseRest<any[]>("customers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ external_customer_id: externalCustomerId }),
  });
  return created?.[0]?.id ?? (() => { throw new Error("Supabase customer creation returned no id."); })();
}

export class SupabaseProductRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    const rows = await supabaseRest<any[]>("products?select=id,name,price,currency,is_active&is_active=eq.true&order=name.asc");
    return rows.map(product);
  }

  async getById(id: ProductId): Promise<Product | null> {
    const rows = await supabaseRest<any[]>(`products?select=id,name,price,currency,is_active&id=eq.${encodeURIComponent(id)}&limit=1`);
    return rows[0] ? product(rows[0]) : null;
  }
}

async function basketCustomerId(basket: Basket): Promise<string> {
  return ensureCustomer(basket.customerId);
}

function basketFromRows(basketRow: any, itemRows: any[]): Basket {
  return {
    id: basketRow.id,
    customerId: basketRow.external_customer_id,
    lines: itemRows.map((row) => ({
      productId: row.product_id,
      quantity: row.quantity,
      unitPrice: { amountMinor: Math.round(Number(row.unit_price) * 100), currency: basketRow.currency },
    })),
  };
}

export class SupabaseBasketRepository implements BasketRepository {
  async getByCustomerId(customerId: CustomerId): Promise<Basket | null> {
    const customerRows = await supabaseRest<any[]>(`customers?select=id,external_customer_id&external_customer_id=eq.${encodeURIComponent(customerId)}&limit=1`);
    const customer = customerRows[0];
    if (!customer) return null;
    const baskets = await supabaseRest<any[]>(`baskets?select=id,currency,status,updated_at,customers!inner(external_customer_id)&customer_id=eq.${customer.id}&status=eq.active&order=updated_at.desc&limit=1`);
    const basket = baskets[0];
    if (!basket) return null;
    const items = await supabaseRest<any[]>(`basket_items?select=product_id,quantity,unit_price&basket_id=eq.${basket.id}&order=created_at.asc`);
    return basketFromRows({ ...basket, external_customer_id: customer.external_customer_id }, items);
  }

  async save(basket: Basket): Promise<void> {
    const customerId = await basketCustomerId(basket);
    await supabaseRest("baskets", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: basket.id, customer_id: customerId, status: "active", currency: basket.lines[0]?.unitPrice.currency ?? "USD", updated_at: new Date().toISOString() }),
    });
    await supabaseRest(`basket_items?basket_id=eq.${basket.id}`, { method: "DELETE" });
    if (basket.lines.length) {
      await supabaseRest("basket_items", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(basket.lines.map((line: BasketLine) => ({ basket_id: basket.id, product_id: line.productId, quantity: line.quantity, unit_price: line.unitPrice.amountMinor / 100 }))),
      });
    }
  }
}

function orderRows(order: Order) {
  return {
    order: {
      id: order.id,
      order_number: order.id,
      status: "placed",
      payment_status: "unpaid",
      currency: order.total.currency,
      subtotal: order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice.amountMinor, 0) / 100,
      total: order.total.amountMinor / 100,
    },
    items: order.lines.map((line) => ({
      product_id: line.productId,
      product_name: line.productId,
      quantity: line.quantity,
      unit_price: line.unitPrice.amountMinor / 100,
      line_total: (line.quantity * line.unitPrice.amountMinor) / 100,
    })),
  };
}

export class SupabaseOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    const customerId = await ensureCustomer(order.customerId);
    const rows = orderRows(order);
    await supabaseRest("orders", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ ...rows.order, customer_id: customerId }),
    });
    await supabaseRest(`order_items?order_id=eq.${order.id}`, { method: "DELETE" });
    if (rows.items.length) {
      await supabaseRest("order_items", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(rows.items.map((item) => ({ ...item, order_id: order.id }))),
      });
    }
  }

  private async load(id: OrderId): Promise<Order | null> {
    const orders = await supabaseRest<any[]>(`orders?select=id,customer_id,currency,total,status,customers!inner(external_customer_id)&id=eq.${encodeURIComponent(id)}&limit=1`);
    const row = orders[0];
    if (!row) return null;
    const items = await supabaseRest<any[]>(`order_items?select=product_id,quantity,unit_price&order_id=eq.${encodeURIComponent(id)}&order=created_at.asc`);
    return {
      id: row.id,
      customerId: row.customers.external_customer_id,
      lines: items.map((item) => ({ productId: item.product_id, quantity: item.quantity, unitPrice: { amountMinor: Math.round(Number(item.unit_price) * 100), currency: row.currency } })),
      total: { amountMinor: Math.round(Number(row.total) * 100), currency: row.currency },
      status: "placed",
    };
  }

  async getById(id: OrderId): Promise<Order | null> { return this.load(id); }

  async getOwnedById(customerId: CustomerId, id: OrderId): Promise<Order | null> {
    const order = await this.load(id);
    return order?.customerId === customerId ? order : null;
  }
}

export class SupabaseCheckoutTransaction implements CheckoutTransaction {
  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }

  async commitCheckout(input: { customerId: string; basketId: string; order: unknown }): Promise<Order> {
    const order = input.order as Order;
    const result = await supabaseRpc<any>("checkout_basket", {
      p_customer_external_id: input.customerId,
      p_order_id: order.id,
      p_basket_id: input.basketId,
    });
    return {
      id: result.id,
      customerId: result.customerId,
      status: result.status,
      total: result.total,
      lines: (result.lines ?? []).map((line: any) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: { amountMinor: Math.round(Number(line.unitPrice) * 100), currency: result.total.currency },
      })),
    };
  }
}
