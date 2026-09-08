import type { AuthenticatedPrincipal, Basket, DeliveryMethod, Money, Order, Product } from "./domain.js";

export type CommerceErrorCode = "BASKET_EMPTY"|"INVALID_QUANTITY"|"PRODUCT_UNAVAILABLE"|"MIXED_CURRENCY"|"STALE_PRICE"|"BASKET_OWNERSHIP_VIOLATION"|"LINE_NOT_FOUND"|"NOT_FOUND"|"COMMERCE_ERROR";
export class CommerceError extends Error { public readonly code: CommerceErrorCode; constructor(message: string, code: CommerceErrorCode) { super(message); this.name="CommerceError"; this.code=code; } }

export const DELIVERY_PRICING: Record<DeliveryMethod, number> = { pickup: 0, standard: 3, express: 6 };
export function calculateBasketTotal(basket: Basket, products: Map<string, Product>): Money {
  if (!basket.lines.length) throw new CommerceError("Basket must contain at least one item", "BASKET_EMPTY");
  const currency=basket.lines[0].unitPrice.currency; let amountMinor=0;
  for (const line of basket.lines) {
    if (!Number.isInteger(line.quantity)||line.quantity<=0) throw new CommerceError("Quantity must be a positive integer","INVALID_QUANTITY");
    const product=products.get(line.productId);
    if (!product||!product.available) throw new CommerceError(`Product unavailable: ${line.productId}`,"PRODUCT_UNAVAILABLE");
    if (product.price.currency!==currency||line.unitPrice.currency!==currency) throw new CommerceError("Basket contains mixed currencies","MIXED_CURRENCY");
    if (line.unitPrice.amountMinor!==product.price.amountMinor) throw new CommerceError(`Basket price is stale: ${line.productId}`,"STALE_PRICE");
    amountMinor += line.unitPrice.amountMinor*line.quantity;
  }
  return {amountMinor,currency};
}
export function placeOrder(principal: AuthenticatedPrincipal,basket: Basket,products: Map<string,Product>,orderId:string,deliveryMethod:DeliveryMethod): Order {
  if (basket.customerId!==principal.customerId) throw new CommerceError("Customer does not own basket","BASKET_OWNERSHIP_VIOLATION");
  if (!(deliveryMethod in DELIVERY_PRICING)) throw new CommerceError("Invalid delivery method","COMMERCE_ERROR");
  const subtotal=calculateBasketTotal(basket,products); const deliveryFee={amountMinor:Math.round(DELIVERY_PRICING[deliveryMethod]*100),currency:subtotal.currency};
  return {id:orderId,customerId:principal.customerId,lines:structuredClone(basket.lines),subtotal,deliveryMethod,deliveryFee,total:{amountMinor:subtotal.amountMinor+deliveryFee.amountMinor,currency:subtotal.currency},status:"placed"};
}
