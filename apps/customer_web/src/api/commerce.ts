import { ensureFreshSession } from '../auth';

export type SupportedCurrency = 'USD' | 'ZiG' | 'ZAR';
export type Product = { id: string; name: string; category: string; price: number; currency: string; available: boolean };
export type BasketItem = { productId: string; quantity: number; unitPrice: number; currency: string };
export type Basket = { id: string; items: BasketItem[] };
export type Order = { id: string; status: string; total: number; currency: string; items: BasketItem[] };
export type BuckPayAccount = { balance: number; currency: string; status: 'active' | 'suspended' };
export type BuckPayTransaction = { id: string; type: 'earned_reward' | 'customer_funding' | 'commerce_redemption' | 'reversal'; amount: number; currency: string; reference: string; createdAt: string };

export const SUPPORTED_CURRENCIES: Array<{ code: SupportedCurrency; label: string; symbol: string }> = [
  { code: 'USD', label: 'USD', symbol: '$' }, { code: 'ZiG', label: 'ZiG', symbol: 'ZiG' }, { code: 'ZAR', label: 'ZAR', symbol: 'R' },
];
export const DISPLAY_RATES_FROM_ZIG: Record<SupportedCurrency, number> = { ZiG: 1, USD: 0.0275, ZAR: 0.49 };
export function formatMoney(amount: number, currency: SupportedCurrency): string { const meta = SUPPORTED_CURRENCIES.find((item) => item.code === currency); return `${meta?.symbol ?? currency}${amount.toFixed(2)}`; }
export function convertDisplayAmount(amount: number, fromCurrency: string, toCurrency: SupportedCurrency): number { if (fromCurrency === toCurrency) return amount; const fromRate = DISPLAY_RATES_FROM_ZIG[fromCurrency as SupportedCurrency]; const toRate = DISPLAY_RATES_FROM_ZIG[toCurrency]; if (!fromRate || !toRate) return amount; return (amount / fromRate) * toRate; }

export interface CommerceClient {
  listProducts(): Promise<Product[]>; getProduct(productId: string): Promise<Product>; getBasket(): Promise<Basket>;
  addBasketItem(productId: string, quantity: number): Promise<Basket>; removeBasketItem(productId: string): Promise<Basket>;
  checkout(): Promise<Order>; getBuckPayAccount(): Promise<BuckPayAccount>; getBuckPayTransactions(): Promise<BuckPayTransaction[]>;
}

const API_BASE_URL = import.meta.env.VITE_COMMERCE_API_URL ?? '/api';
const categoryFor = (id: string): string => ({ bread: 'Bakery', milk: 'Dairy', eggs: 'Dairy', 'discontinued-item': 'Household', rice: 'Pantry', soap: 'Household', toothpaste: 'Personal Care' }[id] ?? 'Essentials');
const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const attempts = method === 'GET' ? 3 : 1;
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const session = await ensureFreshSession();
      const headers = new Headers(init?.headers);
      headers.set('Accept', 'application/json');
      if (init?.body) headers.set('Content-Type', 'application/json');
      if (session?.access_token) headers.set('Authorization', `Bearer ${session.access_token}`);
      const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
      const text = await response.text();
      let body: unknown;
      try { body = text ? JSON.parse(text) : null; } catch { throw new Error(`Commerce API returned an invalid response (${response.status}).`); }
      if (!response.ok) {
        const errorBody = body as { error?: { code?: string; message?: string } } | null;
        const message = errorBody?.error?.message ?? `Commerce request failed (${response.status}).`;
        if (response.status === 401) throw new Error('Please sign in again to continue.');
        if (method === 'GET' && (response.status >= 500 || response.status === 429) && attempt < attempts) { await sleep(250 * attempt); continue; }
        throw new Error(message);
      }
      if (body === null || body === undefined) throw new Error('Commerce API returned an empty response.');
      return body as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Commerce request failed.');
      if (method === 'GET' && attempt < attempts && !lastError.message.startsWith('Commerce API returned an invalid response')) { await sleep(250 * attempt); continue; }
      throw lastError;
    }
  }
  throw lastError ?? new Error('Commerce request failed.');
}

type ProductDto = { id: string; name: string; price: { amountMinor: number; currency: string }; available: boolean };
type BasketDto = { id: string; lines: Array<{ productId: string; quantity: number; unitPrice: { amountMinor: number; currency: string } }> };
type OrderDto = { id: string; status: string; total: { amountMinor: number; currency: string }; lines: Array<{ productId: string; quantity: number; unitPrice: { amountMinor: number; currency: string } }> };
type BuckPayAccountDto = { balance: { amountMinor: number; currency: string }; status: 'active' | 'suspended' };
type BuckPayTransactionDto = { id: string; type: BuckPayTransaction['type']; amount: { amountMinor: number; currency: string }; reference: string; createdAt: string };
const fromProductDto = (product: ProductDto): Product => ({ id: product.id, name: product.name.replace(' [DEV FIXTURE]', ''), category: categoryFor(product.id), price: product.price.amountMinor / 100, currency: product.price.currency, available: product.available });
const fromBasketDto = (basket: BasketDto): Basket => ({ id: basket.id, items: basket.lines.map((line) => ({ productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice.amountMinor / 100, currency: line.unitPrice.currency })) });
const fromOrderDto = (order: OrderDto): Order => ({ id: order.id, status: order.status, total: order.total.amountMinor / 100, currency: order.total.currency, items: order.lines.map((line) => ({ productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice.amountMinor / 100, currency: line.unitPrice.currency })) });

export const developmentCommerceClient: CommerceClient = {
  async listProducts() { return [{ id: 'bread', name: 'Fresh Bread', category: 'Bakery', price: 2.5, currency: 'ZiG', available: true }, { id: 'milk', name: 'Fresh Milk', category: 'Dairy', price: 3, currency: 'ZiG', available: true }, { id: 'eggs', name: 'Eggs (dozen)', category: 'Dairy', price: 4.5, currency: 'ZiG', available: true }, { id: 'rice', name: 'Rice', category: 'Pantry', price: 8.5, currency: 'ZiG', available: true }, { id: 'soap', name: 'Bath Soap', category: 'Household', price: 3.25, currency: 'ZiG', available: true }, { id: 'toothpaste', name: 'Toothpaste', category: 'Personal Care', price: 5.75, currency: 'ZiG', available: true }]; },
  async getProduct(productId) { const product = (await this.listProducts()).find((candidate) => candidate.id === productId); if (!product) throw new Error(`Product not found: ${productId}`); return product; },
  async getBasket() { return { id: 'local-basket', items: [] }; }, async addBasketItem() { return { id: 'local-basket', items: [] }; }, async removeBasketItem() { return { id: 'local-basket', items: [] }; },
  async checkout() { throw new Error('Local adapter does not support checkout.'); }, async getBuckPayAccount() { return { balance: 0, currency: 'ZiG', status: 'active' }; }, async getBuckPayTransactions() { return []; },
};

export const commerceClient: CommerceClient = {
  async listProducts() { const response = await request<{ products: ProductDto[] }>('/products'); if (!Array.isArray(response.products)) throw new Error('Commerce API returned an invalid product catalogue.'); return response.products.map(fromProductDto); },
  async getProduct(productId) { return fromProductDto(await request<ProductDto>(`/products/${encodeURIComponent(productId)}`)); },
  async getBasket() { return fromBasketDto(await request<BasketDto>('/basket')); },
  async addBasketItem(productId, quantity) { return fromBasketDto(await request<BasketDto>('/basket/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) })); },
  async removeBasketItem(productId) { return fromBasketDto(await request<BasketDto>(`/basket/items/${encodeURIComponent(productId)}`, { method: 'DELETE' })); },
  async checkout() { return fromOrderDto(await request<OrderDto>('/checkout', { method: 'POST' })); },
  async getBuckPayAccount() { const dto = await request<BuckPayAccountDto>('/buckpay'); return { balance: dto.balance.amountMinor / 100, currency: dto.balance.currency, status: dto.status }; },
  async getBuckPayTransactions() { const response = await request<{ transactions: BuckPayTransactionDto[] }>('/buckpay/transactions'); if (!Array.isArray(response.transactions)) throw new Error('Commerce API returned invalid BuckPay history.'); return response.transactions.map((item) => ({ id: item.id, type: item.type, amount: item.amount.amountMinor / 100, currency: item.amount.currency, reference: item.reference, createdAt: item.createdAt })); },
};
