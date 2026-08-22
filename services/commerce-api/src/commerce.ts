import type { AuthenticatedPrincipal, Basket, Money, Order, Product } from "./domain.js";

export class CommerceError extends Error {}

export function calculateBasketTotal(basket: Basket, products: Map<string, Product>): Money {
  if (basket.lines.length === 0) {
    throw new CommerceError("Basket must contain at least one item");
  }

  const currency = basket.lines[0].unitPrice.currency;
  let amountMinor = 0;

  for (const line of basket.lines) {
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      throw new CommerceError("Quantity must be a positive integer");
    }

    const product = products.get(line.productId);
    if (!product || !product.available) {
      throw new CommerceError(`Product unavailable: ${line.productId}`);
    }

    if (product.price.currency !== currency || line.unitPrice.currency !== currency) {
      throw new CommerceError("Basket contains mixed currencies");
    }

    if (line.unitPrice.amountMinor !== product.price.amountMinor) {
      throw new CommerceError(`Basket price is stale: ${line.productId}`);
    }

    amountMinor += line.unitPrice.amountMinor * line.quantity;
  }

  return { amountMinor, currency };
}

export function placeOrder(
  principal: AuthenticatedPrincipal,
  basket: Basket,
  products: Map<string, Product>,
  orderId: string,
): Order {
  if (basket.customerId !== principal.customerId) {
    throw new CommerceError("Customer does not own basket");
  }

  const total = calculateBasketTotal(basket, products);

  return {
    id: orderId,
    customerId: principal.customerId,
    lines: structuredClone(basket.lines),
    total,
    status: "placed",
  };
}
