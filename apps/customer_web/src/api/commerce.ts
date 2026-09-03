export type Money = { amountMinor: number; currency: string };

export type Product = {
  id: string;
  name: string;
  price: Money;
  available: boolean;
  category: string;
};

export type BasketItem = {
  productId: string;
  quantity: number;
  unitPrice: Money;
};

export type Basket = {
  id: string;
  items: BasketItem[];
};

export type Order = {
  id: string;
  lines: BasketItem[];
  total: Money;
  status: 'placed';
};

export interface CommerceClient {
  listProducts(): Promise<Product[]>;
  getBasket(): Promise<Basket>;
  addBasketItem(productId: string, quantity: number): Promise<Basket>;
  removeBasketItem(productId: string): Promise<Basket>;
  checkout(): Promise<Order>;
}

const API_BASE = import.meta.env.VITE_COMMERCE_API_BASE ?? '/api';
const CUSTOMER_ID = import.meta.env.VITE_DEV_CUSTOMER_ID ?? 'web-demo-customer';

const categoryFor = (product: { id: string; name: string }): string => {
  const value = `${product.id} ${product.name}`.toLowerCase();
  if (value.includes('milk') || value.includes('egg')) return 'Dairy';
  if (value.includes('bread')) return 'Bakery';
  if (value.includes('rice') || value.includes('oil')) return 'Pantry';
  if (value.includes('wash') || value.includes('powder')) return 'Household';
  return 'Essentials';
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'x-dev-customer-id': CUSTOMER_ID,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | T
    | { error?: { message?: string; code?: string } }
    | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? payload.error?.message
        : undefined;
    throw new Error(message || `Commerce request failed (${response.status})`);
  }

  return payload as T;
}

export const commerceClient: CommerceClient = {
  async listProducts() {
    const result = await request<{ products: Array<Omit<Product, 'category'>> }>('/products');
    return result.products.map((product) => ({ ...product, category: categoryFor(product) }));
  },

  async getBasket() {
    const result = await request<{ id: string; lines: BasketItem[] }>('/basket');
    return { id: result.id, items: result.lines };
  },

  async addBasketItem(productId, quantity) {
    const result = await request<{ id: string; lines: BasketItem[] }>('/basket/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return { id: result.id, items: result.lines };
  },

  async removeBasketItem(productId) {
    const result = await request<{ id: string; lines: BasketItem[] }>(
      `/basket/items/${encodeURIComponent(productId)}`,
      { method: 'DELETE' },
    );
    return { id: result.id, items: result.lines };
  },

  async checkout() {
    const result = await request<Order>('/checkout', { method: 'POST' });
    return result;
  },
};
