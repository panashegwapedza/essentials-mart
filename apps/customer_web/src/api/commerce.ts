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

/**
 * Governed commerce boundary.
 * Browser state is only a projection of Commerce. The Commerce API is the
 * authority for catalogue, basket mutations and checkout decisions.
 */
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
    const message = typeof body === 'object' && body && 'error' in body
      ? body.error?.message
      : undefined;
    throw new Error(message ?? `Commerce request failed (${response.status}).`);
  }
  return body as T;
}

type ProductDto = {
  id: string;
  name: string;
  price: { amountMinor: number; currency: string };
  available: boolean;
};

const fromProductDto = (product: ProductDto): Product => ({
  id: product.id,
  name: product.name,
  category: categoryFor(product.id),
  price: product.price.amountMinor / 100,
  currency: product.price.currency,
  available: product.available,
});

const fromBasketDto = (basket: {
  id: string;
  lines: Array<{
    productId: string;
    quantity: number;
    unitPrice: { amountMinor: number; currency: string };
  }>;
}): Basket => ({
  id: basket.id,
  items: basket.lines.map((line) => ({
    productId: line.productId,
    quantity: line.quantity,
    unitPrice: line.unitPrice.amountMinor / 100,
    currency: line.unitPrice.currency,
  })),
});

const fromOrderDto = (order: {
  id: string;
  status: string;
  total: { amountMinor: number; currency: string };
  lines: Array<{
    productId: string;
    quantity: number;
    unitPrice: { amountMinor: number; currency: string };
  }>;
}): Order => ({
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

export const commerceClient: CommerceClient = {
  async listProducts() {
    const response = await request<{ products: ProductDto[] }>('/products');
    return response.products.map(fromProductDto);
  },
  async getProduct(productId) {
    return fromProductDto(await request<ProductDto>(`/products/${encodeURIComponent(productId)}`));
  },
  async getBasket() {
    return fromBasketDto(await request<Parameters<typeof fromBasketDto>[0]>('/basket'));
  },
  async addBasketItem(productId, quantity) {
    return fromBasketDto(await request<Parameters<typeof fromBasketDto>[0]>('/basket/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }));
  },
  async removeBasketItem(productId) {
    return fromBasketDto(await request<Parameters<typeof fromBasketDto>[0]>(`/basket/items/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    }));
  },
  async checkout() {
    return fromOrderDto(await request<Parameters<typeof fromOrderDto>[0]>('/checkout', { method: 'POST' }));
  },
};

/** Local-only adapter retained as a deterministic fallback for UI work. */
export const developmentCommerceClient: CommerceClient = {
  async listProducts() {
    return [
      { id: 'bread', name: 'Bread [DEV FIXTURE]', category: 'Bakery', price: 2.5, currency: 'ZWG', available: true },
      { id: 'milk', name: 'Milk [DEV FIXTURE]', category: 'Dairy', price: 3, currency: 'ZWG', available: true },
      { id: 'eggs', name: 'Eggs (dozen) [DEV FIXTURE]', category: 'Dairy', price: 4.5, currency: 'ZWG', available: true },
    ];
  },
  async getProduct(productId) {
    const product = await this.listProducts();
    const match = product.find((candidate) => candidate.id === productId);
    if (!match) throw new Error(`Product not found: ${productId}`);
    return match;
  },
  async getBasket() {
    return { id: 'local-basket', items: [] };
  },
  async addBasketItem() {
    return { id: 'local-basket', items: [] };
  },
  async removeBasketItem() {
    return { id: 'local-basket', items: [] };
  },
  async checkout() {
    throw new Error('Local adapter does not support checkout.');
  },
};
