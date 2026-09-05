import { SupabaseBuckPayRepository } from '../../../services/commerce-api/src/adapters/supabase/SupabaseBuckPayRepository.js';
import { BuckPayApplicationService } from '../../../services/commerce-api/src/application/BuckPayApplicationService.js';
import type { AuthenticatedPrincipal } from '../../../services/commerce-api/src/domain.js';

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

  try {
    const account = await buckPay.getAccount(user);
    return res.status(200).json({ balance: account.balance, status: account.status });
  } catch (err: any) {
    console.error('buckpay-api error', err);
    return res.status(500).json({ error: { code: err?.code ?? 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected server error.' } });
  }
}
