import type { Basket, Order, Product } from "../domain.js";

/**
 * Explicit response DTOs. Deliberately NOT a raw structuredClone of the
 * domain object — the API contract must not automatically inherit whatever
 * fields the domain type happens to grow later (e.g. an internal cost
 * price or supplier ID added to Product in future). Every field returned
 * to a client is named here explicitly.
 */

export function toProductDto(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: { amountMinor: product.price.amountMinor, currency: product.price.currency },
    available: product.available,
  };
}

export function toBasketDto(basket: Basket) {
  return {
    id: basket.id,
    lines: basket.lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: { amountMinor: line.unitPrice.amountMinor, currency: line.unitPrice.currency },
    })),
  };
}

export function toOrderDto(order: Order) {
  return {
    id: order.id,
    lines: order.lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: { amountMinor: line.unitPrice.amountMinor, currency: line.unitPrice.currency },
    })),
    total: { amountMinor: order.total.amountMinor, currency: order.total.currency },
    status: order.status,
  };
}
