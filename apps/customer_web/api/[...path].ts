import { SupabaseBuckPayRepository } from '../../../services/commerce-api/src/adapters/supabase/SupabaseBuckPayRepository.js';
import { BuckPayApplicationService } from '../../../services/commerce-api/src/application/BuckPayApplicationService.js';
import { CommerceApplicationService } from '../../../services/commerce-api/src/application/CommerceApplicationService.js';
import { SupabaseProductRepository, SupabaseBasketRepository, SupabaseOrderRepository, SupabaseCheckoutTransaction } from '../../../services/commerce-api/src/adapters/supabase/SupabaseCommerceRepositories.js';
import type { AuthenticatedPrincipal } from '../../../services/commerce-api/src/domain.js';
import { devPrincipal, principal as authPrincipal } from './_auth.js';

const commerce = new CommerceApplicationService(new SupabaseProductRepository(), new SupabaseBasketRepository(), new SupabaseOrderRepository(), new SupabaseCheckoutTransaction());
const buckPay = new BuckPayApplicationService(new SupabaseBuckPayRepository());

function json(res: any, status: number, body: unknown) { res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body)); }
function error(res: any, status: number, code: string, message: string) { json(res, status, { error: { code, message } }); }
function productDto(product: any) { return { id: product.id, name: product.name, price: product.price, available: product.available }; }
function basketDto(basket: any) { return { id: basket.id, lines: basket.lines }; }
function orderDto(order: any) { return { id: order.id, status: order.status, total: order.total, lines: order.lines }; }
function requestPath(req: any): string {
  const url = typeof req.url === 'string' ? req.url : '';
  const pathname = url.split('?')[0];
  if (pathname.startsWith('/api/')) return decodeURIComponent(pathname.slice('/api'.length));
  if (pathname === '/api') return '/';
  const rawPath = typeof req.query?.path === 'string' ? `/${req.query.path}` : Array.isArray(req.query?.path) ? `/${req.query.path.join('/')}` : '/';
  return decodeURIComponent(rawPath);
}

async function resolvePrincipal(req: any): Promise<AuthenticatedPrincipal | null> {
  const dev = devPrincipal(req);
  if (dev) return dev;
  return authPrincipal(req);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-dev-customer-id');
  res.setHeader('Vary', 'Origin, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const path = requestPath(req);
  try {
    if (path === '/products' && req.method === 'GET') return json(res, 200, { products: (await commerce.listProducts()).map(productDto) });
    if (path.startsWith('/products/') && req.method === 'GET') return json(res, 200, productDto(await commerce.getProduct(path.slice('/products/'.length))));

    const user = await resolvePrincipal(req);
    if (!user) return error(res, 401, 'UNAUTHENTICATED', 'A valid Supabase Auth session is required.');

    if (path === '/basket' && req.method === 'GET') return json(res, 200, basketDto(await commerce.getOrCreateBasket(user)));
    if (path === '/basket/items' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || typeof body.productId !== 'string' || !Number.isInteger(body.quantity) || body.quantity <= 0) return error(res, 400, 'VALIDATION_ERROR', 'productId must be a non-empty string and quantity must be a positive integer.');
      return json(res, 201, basketDto(await commerce.addItem(user, body.productId, body.quantity)));
    }
    if (path.startsWith('/basket/items/') && req.method === 'DELETE') return json(res, 200, basketDto(await commerce.removeItem(user, path.slice('/basket/items/'.length))));
    if (path === '/checkout' && req.method === 'POST') return json(res, 201, orderDto(await commerce.checkout(user)));
    if (path === '/buckpay' && req.method === 'GET') { const account = await buckPay.getAccount(user.customerId); return json(res, 200, { balance: account.balance, status: account.status }); }
    if (path === '/buckpay/transactions' && req.method === 'GET') { const transactions = await buckPay.getTransactions(user.customerId); return json(res, 200, { transactions: transactions.map((item) => ({ id: item.id, type: item.type, amount: item.amount, reference: item.reference, createdAt: item.createdAt })) }); }
    return error(res, 404, 'NOT_FOUND', 'No such route.');
  } catch (err: any) {
    const status = err?.code === 'NOT_FOUND' ? 404 : err?.code === 'PRODUCT_UNAVAILABLE' ? 409 : 500;
    console.error('commerce-api error', err);
    return error(res, status, err?.code ?? 'INTERNAL_ERROR', err instanceof Error ? err.message : 'Unexpected server error.');
  }
}
