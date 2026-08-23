import type { AuthenticatedPrincipal, Basket, Money, Order, Product } from "./domain.js";

/**
 * Stable, machine-readable error codes. Set explicitly at each throw site
 * so the HTTP layer (respond.ts) can map to a status code by reading
 * `err.code` directly — never by pattern-matching on `err.message`, which
 * is free text meant for humans/logs and must remain safe to reword
 * without silently breaking API status-code behaviour.
 */
export type CommerceErrorCode =
  | "BASKET_EMPTY"
  | "INVALID_QUANTITY"
  | "PRODUCT_UNAVAILABLE"
  | "MIXED_CURRENCY"
  | "STALE_PRICE"
  | "BASKET_OWNERSHIP_VIOLATION"
  | "LINE_NOT_FOUND"
  | "NOT_FOUND"
  | "COMMERCE_ERROR";

export class CommerceError extends Error {
  public readonly code: CommerceErrorCode;

  /**
   * `code` is required, not defaulted. A CommerceError with no explicit
   * classification would otherwise silently fall back to a generic 400 —
   * misclassifying what might actually be a server-side/programming bug
   * as "the client's fault." Anything that isn't a deliberately classified
   * domain/business error should be a plain Error, not a CommerceError, so
   * it correctly falls through to sendErrorFromException's 500 INTERNAL
   * path instead.
   */
  constructor(message: string, code: CommerceErrorCode) {
    super(message);
    this.name = "CommerceError";
    this.code = code;
  }
}

export function calculateBasketTotal(basket: Basket, products: Map<string, Product>): Money {
  if (basket.lines.length === 0) {
    throw new CommerceError("Basket must contain at least one item", "BASKET_EMPTY");
  }

  const currency = basket.lines[0].unitPrice.currency;
  let amountMinor = 0;

  for (const line of basket.lines) {
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      throw new CommerceError("Quantity must be a positive integer", "INVALID_QUANTITY");
    }

    const product = products.get(line.productId);
    if (!product || !product.available) {
      throw new CommerceError(`Product unavailable: ${line.productId}`, "PRODUCT_UNAVAILABLE");
    }

    if (product.price.currency !== currency || line.unitPrice.currency !== currency) {
      throw new CommerceError("Basket contains mixed currencies", "MIXED_CURRENCY");
    }

    if (line.unitPrice.amountMinor !== product.price.amountMinor) {
      throw new CommerceError(`Basket price is stale: ${line.productId}`, "STALE_PRICE");
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
    throw new CommerceError("Customer does not own basket", "BASKET_OWNERSHIP_VIOLATION");
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
