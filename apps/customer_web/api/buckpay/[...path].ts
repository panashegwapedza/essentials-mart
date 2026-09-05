import { SupabaseBuckPayRepository } from '../../../../services/commerce-api/src/adapters/supabase/SupabaseBuckPayRepository.js';
import { BuckPayApplicationService } from '../../../../services/commerce-api/src/application/BuckPayApplicationService.js';
import type { AuthenticatedPrincipal } from '../../../../services/commerce-api/src/domain.js';

const buckPay = new BuckPayApplicationService(new SupabaseBuckPayRepository());

function principal(req: any): AuthenticatedPrincipal | null {
  const value = req.headers?.['x-dev-customer-id'];
  const id = Array.isArray(value) ? value[0] : value;
  return typeof id === 'string' && id.trim() ? { customerId: id } : null;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-dev-customer-id');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is supported.' } });

  const user = principal(req);
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'No authenticated principal could be resolved for this request.' } });

  const segments = Array.isArray(req.query?.path) ? req.query.path : typeof req.query?.path === 'string' ? [req.query.path] : [];
  if (segments.join('/') !== 'transactions') return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No such route.' } });

  try {
    const transactions = await buckPay.getTransactions(user);
    return res.status(200).json({ transactions: transactions.map((item) => ({ id: item.id, type: item.type, amount: item.amount, reference: item.reference, createdAt: item.createdAt })) });
  } catch (err: any) {
    console.error('buckpay-api error', err);
    return res.status(500).json({ error: { code: err?.code ?? 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected server error.' } });
  }
}
