import { SupabaseBuckPayRepository } from '../../../services/commerce-api/src/adapters/supabase/SupabaseBuckPayRepository.js';
import { BuckPayApplicationService } from '../../../services/commerce-api/src/application/BuckPayApplicationService.js';
import type { AuthenticatedPrincipal } from '../../../services/commerce-api/src/domain.js';
import { devPrincipal, principal as authPrincipal } from './_auth.js';

const buckPay = new BuckPayApplicationService(new SupabaseBuckPayRepository());

async function principal(req: any): Promise<AuthenticatedPrincipal | null> {
  return devPrincipal(req) ?? authPrincipal(req);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-dev-customer-id');
  res.setHeader('Vary', 'Origin, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is supported.' } });
  const user = await principal(req);
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'A valid Supabase Auth session is required.' } });
  try {
    const account = await buckPay.getAccount(user.customerId);
    return res.status(200).json({ balance: account.balance, status: account.status });
  } catch (err: any) {
    console.error('buckpay-api error', err);
    return res.status(500).json({ error: { code: err?.code ?? 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected server error.' } });
  }
}
