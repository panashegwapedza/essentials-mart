export type CustomerId = string;
export type ProductId = string;
export type BasketId = string;
export type OrderId = string;
export type Money = { amountMinor: number; currency: string };

export type AuthenticatedPrincipal = {
  customerId: CustomerId;
  assuranceLevel?: string;
};

export type Product = {
  id: ProductId;
  name: string;
  price: Money;
  available: boolean;
};

export type BasketLine = {
  productId: ProductId;
  quantity: number;
  unitPrice: Money;
};

export type Basket = {
  id: BasketId;
  customerId: CustomerId;
  lines: BasketLine[];
};

export type Order = {
  id: OrderId;
  customerId: CustomerId;
  lines: BasketLine[];
  total: Money;
  status: "placed";
};
