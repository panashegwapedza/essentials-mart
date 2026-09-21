import { principal } from '../apps/customer_web/api/_auth.js';
import { runAISociety } from '../services/intelligence/ai-society-runtime';
import type { BasketIntelligenceBasketItem, BasketIntelligenceProduct, BasketIntelligenceInventory } from '../services/intelligence/commerce/basket-intelligence-engine';

function json(res: any, status: number, body: unknown) {
  return res.status(status).setHeader('Content-Type', 'application/json').setHeader('Cache-Control', 'no-store').json(body);
}
function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase intelligence configuration is missing.');
  return { url: url.replace(/\/$/, ''), key };
}
async function supabase<T>(path: string): Promise<T> {
  const { url, key } = config();
  const response = await fetch(url + '/rest/v1/' + path, { headers: { apikey: key, Authorization: 'Bearer ' + key, Accept: 'application/json' } });
  if (!response.ok) throw new Error('Supabase intelligence request failed (' + response.status + ').');
  return await response.json() as T;
}

export default async function basketIntelligenceHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').json({ error: { message: 'Method not allowed.' } });
  try {
    const user = await principal(req);
    if (!user) return json(res, 401, { error: { code: 'UNAUTHENTICATED', message: 'A valid Supabase Auth session is required.' } });

    const body = (req.body ?? {}) as { basket?: { items?: BasketIntelligenceBasketItem[] } };
    const basketLines = Array.isArray(body.basket?.items)
      ? body.basket.items.filter((line): line is BasketIntelligenceBasketItem => typeof line?.productId === 'string')
      : [];
    if (!basketLines.length) return json(res, 200, { items: [], summary: { itemCount: 0, healthyCount: 0, lowStockCount: 0, outOfStockCount: 0, overRequestedCount: 0, estimatedSubtotal: 0, currency: null }, trace: null });

    const catalogue = await supabase<Array<{ id: string; name: string; price: number; currency: string; is_active: boolean }>>(
      'products?select=id,name,price,currency,is_active&limit=1000',
    );
    const inventory = await supabase<Array<{ product_id: string; quantity: number; reserved_quantity: number }>>(
      'inventory?select=product_id,quantity,reserved_quantity&limit=5000',
    );
    const products: BasketIntelligenceProduct[] = catalogue.map(product => ({
      id: product.id, name: product.name, price: Number(product.price), currency: product.currency, available: product.is_active,
    }));
    const stock: BasketIntelligenceInventory[] = inventory.map(row => ({
      productId: row.product_id, quantity: Number(row.quantity), reservedQuantity: Number(row.reserved_quantity),
    }));
    return json(res, 200, runAISociety({ capability: 'basket-intelligence', basket: basketLines, catalogue: products, inventory: stock }));
  } catch (error) {
    return json(res, 500, { error: { code: 'BASKET_INTELLIGENCE_FAILED', message: error instanceof Error ? error.message : 'Basket intelligence failed.' } });
  }
}
