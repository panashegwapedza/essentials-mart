async function principal(req:any){ const auth=await import('../apps/customer_web/api/_auth.js'); return auth.principal(req); }
import { runAISociety } from '../services/intelligence/ai-society-runtime';
import type { CommerceActionRequest, CommerceActionProduct, CommerceActionInventory } from '../services/intelligence/commerce/commerce-action-engine';

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
  const response = await fetch(url + '/rest/v1/' + path, {
    headers: { apikey: key, Authorization: 'Bearer ' + key, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('Supabase intelligence request failed (' + response.status + ').');
  return await response.json() as T;
}

export default async function intelligenceActionHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').json({ error: { message: 'Method not allowed.' } });

  try {
    const user = await principal(req);
    if (!user) return json(res, 401, { error: { code: 'UNAUTHENTICATED', message: 'A valid Supabase Auth session is required.' } });

    const body = (req.body ?? {}) as { requests?: CommerceActionRequest[] };
    const requests = Array.isArray(body.requests)
      ? body.requests.filter((request): request is CommerceActionRequest => typeof request?.productId === 'string')
      : [];

    if (!requests.length) return json(res, 400, { error: { code: 'INVALID_REQUEST', message: 'At least one product action request is required.' } });

    const catalogue = await supabase<Array<{
      id: string;
      name: string;
      price: number;
      currency: string;
      is_active: boolean;
    }>>('products?select=id,name,price,currency,is_active&is_active=eq.true&limit=1000');

    const inventory = await supabase<Array<{
      product_id: string;
      quantity: number;
      reserved_quantity: number;
    }>>('inventory?select=product_id,quantity,reserved_quantity&limit=5000');

    const products: CommerceActionProduct[] = catalogue.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      currency: product.currency,
      available: product.is_active,
    }));

    const stock: CommerceActionInventory[] = inventory.map(row => ({
      productId: row.product_id,
      quantity: Number(row.quantity),
      reservedQuantity: Number(row.reserved_quantity),
    }));

    const result = runAISociety({
      capability: 'commerce-action-preparation',
      requests,
      catalogue: products,
      inventory: stock,
    });

    return json(res, 200, result);
  } catch (error) {
    return json(res, 500, {
      error: {
        code: 'INTELLIGENCE_ACTION_FAILED',
        message: error instanceof Error ? error.message : 'Commerce action preparation failed.',
      },
    });
  }
}
