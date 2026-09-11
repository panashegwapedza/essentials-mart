export type CustomerId = string;
export type ProductId = string;
export type BasketId = string;
export type OrderId = string;
export type Money = { amountMinor: number; currency: string };
export type DeliveryMethod = "pickup" | "standard" | "express";
export type OrderStatus = "placed" | "confirmed" | "fulfilling" | "fulfilled" | "cancelled" | "refunded";
export type DeliveryStatus = "pending" | "preparing" | "ready_for_pickup" | "out_for_delivery" | "delivered" | "failed" | "cancelled";
export type DeliveryHistoryEntry = { fromStatus: DeliveryStatus | null; toStatus: DeliveryStatus; trackingReference?: string; changedAt: string };
export type DeliverySummary = { status: DeliveryStatus; trackingReference?: string; scheduledFor?: string; deliveredAt?: string; history: DeliveryHistoryEntry[] };

export type AuthenticatedPrincipal = { customerId: CustomerId; assuranceLevel?: string };
export type Product = {
  id: ProductId;
  name: string;
  category?: string;
  productFamily?: string;
  brand?: string;
  variantLabel?: string;
  sizeLabel?: string;
  price: Money;
  available: boolean;
};
export type BasketLine = { productId: ProductId; quantity: number; unitPrice: Money };
export type Basket = { id: BasketId; customerId: CustomerId; lines: BasketLine[] };
export type Order = {
  id: OrderId;
  customerId: CustomerId;
  lines: BasketLine[];
  subtotal: Money;
  deliveryMethod: DeliveryMethod;
  deliveryFee: Money;
  total: Money;
  status: OrderStatus;
  delivery?: DeliverySummary;
  createdAt?: string;
};
