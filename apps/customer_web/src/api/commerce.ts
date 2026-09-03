export type SupportedCurrency = 'USD' | 'ZiG' | 'ZAR';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  available: boolean;
};

export type BasketItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};

export type Basket = {
  id: string;
  items: BasketItem[];
};

export type Order = {
  id: string;
  status: string;
  total: number;
  currency: string;
  items: BasketItem[];
};

export const SUPPORTED_CURRENCIES: Array<{ code: SupportedCurrency; label: string; symbol: string }> = [
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'ZiG', label: 'ZiG', symbol: 'ZiG' },
  { code: 'ZAR', label: 'ZAR', symbol: 'R' },
];

/**
 * Development display rates only. Production conversion must come from the
 * governed pricing/currency service rather than browser constants.
 * Base currency: ZiG.
 */
export const DISPLAY_RATES_FROM_ZIG: Record<SupportedCurrency, number> = {
  ZiG: 1,
  USD: 0.0275,
  ZAR: 0.49,
};

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const meta = SUPPORTED_CURRENCIES.find((item) => item.code === currency);
  return `${meta?.symbol ?? currency} ${amount.toFixed(2)}`;
}

export function convertDisplayAmount(amount: number, fromCurrency: string, toCurrency: SupportedCurrency): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = DISPLAY_RATES_FROM_ZIG[fromCurrency as SupportedCurrency];
  const toRate = DISPLAY_RATES_FROM_ZIG[toCurrency];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
}

export interface CommerceClient {
  listProducts(): Promise<Product[]>;
  getProduct(productId: string): Promise<Product>;
  getBasket(): Promise<Basket>;
  addBasketItem(productId: string, quantity: number): Promise<Basket>;
  removeBasketItem(productId: string): Promise<Basket>;
  checkout(): Promise<Order>;
}

const API_BASE_URL = import.meta.env.VITE_COMMERCE_API_URL ?? 'http://localhost:3000';
const CUSTOMER_ID = import.meta.env.VITE_DEV_CUSTOMER_ID ?? 'web-demo-customer';

const categoryFor = (id: string): string => {
  const categories: Record<string, string> = {
    bread: 'Bakery',
    milk: 'Dairy',
    eggs: 'Dairy',
    'discontinued-item': 'Household',
  };
  return categories[id] ?? 'Essentials';
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      'x-dev-customer-id': CUSTOMER_ID,
      ...init?.headers,
    },
  });

  const body = (await response.json()) as T | { error?: { message?: string } };
  if (!response.ok) {
    const message = typeof body === 'object' && body && 'error' in body ? body.error?.message : undefined;
    throw new Error(message ?? `Commerce request failed (${response.status}).`);
  }
  return body as T;
}

type ProductDto = { id: string; name: string; price: { amountMinor: number; currency: string }; available: boolean };

type BasketDto = {
  id: string;
  lines: Array<{ productId: string; quantity: number; unitPrice: { amountMinor: number; currency: string } }>;
};

type OrderDto = {
  id: string;
  status: string;
  total: { amountMinor: number; currency: string };
  lines: Array<{ productId: string; quantity: number; unitPrice: { amountMinor: number; currency: string } }>;
};

const fromProductDto = (product: ProductDto): Product => ({
  id: product.id,
  name: product.name.replace(' [DEV FIXTURE]', ''),
  category: categoryFor(product.id),
  price: product.price.amountMinor / 100,
  currency: product.price.currency,
  available: product.available,
});

const fromBasketDto = (basket: BasketDto): Basket => ({
  id: basket.id,
  items: basket.lines.map((line) => ({
    productId: line.productId,
    quantity: line.quantity,
    unitPrice: line.unitPrice.amountMinor / 100,
    currency: line.unitPrice.currency,
  })),
});

const fromOrderDto = (order: OrderDto): Order => ({
  id: order.id,
  status: order.status,
  total: order.total.amountMinor / 100,
  currency: order.total.currency,
  items: order.lines.map((line) => ({
    productId: line.productId,
    quantity: line.quantity,
    unitPrice: line.unitPrice.amountMinor / 100,
    currency: line.unitPrice.currency,
  })),
});

export const developmentCommerceClient: CommerceClient = {
  async listProducts() {
    return [
      { id: 'bread', name: 'Fresh Bread', category: 'Bakery', price: 2.5, currency: 'ZiG', available: true },
      { id: 'milk', name: 'Fresh Milk', category: 'Dairy', price: 3, currency: 'ZiG', available: true },
      { id: 'eggs', name: 'Eggs (dozen)', category: 'Dairy', price: 4.5, currency: 'ZiG', available: true },
      { id: 'rice', name: 'Rice', category: 'Pantry', price: 8.5, currency: 'ZiG', available: true },
      { id: 'soap', name: 'Bath Soap', category: 'Household', price: 3.25, currency: 'ZiG', available: true },
      { id: 'toothpaste', name: 'Toothpaste', category: 'Personal Care', price: 5.75, currency: 'ZiG', available: true },
    ];
  },
  async getProduct(productId) {
    const products = await this.listProducts();
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) throw new Error(`Product not found: ${productId}`);
    return product;
  },
  async getBasket() { return { id: 'local-basket', items: [] }; },
  async addBasketItem() { return { id: 'local-basket', items: [] }; },
  async removeBasketItem() { return { id: 'local-basket', items: [] }; },
  async checkout() { throw new Error('Local adapter does not support checkout.'); },
};

export const commerceClient: CommerceClient = {
  async listProducts() {
    try {
      const response = await request<{ products: ProductDto[] }>('/products');
      const products = response.products.map(fromProductDto);
      return products.length > 0 ? products : developmentCommerceClient.listProducts();
    } catch {
      return developmentCommerceClient.listProducts();
    }
  },
  async getProduct(productId) {
    try {
      return fromProductDto(await request<ProductDto>(`/products/${encodeURIComponent(productId)}`));
    } catch {
      return developmentCommerceClient.getProduct(productId);
    }
  },
  async getBasket() {
    return fromBasketDto(await request<BasketDto>('/basket'));
  },
  async addBasketItem(productId, quantity) {
    return fromBasketDto(await request<BasketDto>('/basket/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }));
  },
  async removeBasketItem(productId) {
    return fromBasketDto(await request<BasketDto>(`/basket/items/${encodeURIComponent(productId)}`, { method: 'DELETE' }));
  },
  async checkout() {
    return fromOrderDto(await request<OrderDto>('/checkout', { method: 'POST' }));
  },
};
