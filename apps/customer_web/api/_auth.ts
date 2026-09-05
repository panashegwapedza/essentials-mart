import type { AuthenticatedPrincipal } from '../../../services/commerce-api/src/domain.js';

type AuthUser = { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null };

type CustomerRow = { id: string; auth_user_id: string; email: string | null; display_name: string | null };

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase authentication requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  return { url: url.replace(/\/$/, ''), key };
}

function bearer(req: any): string | null {
  const raw = req.headers?.authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== 'string' || !/^Bearer\s+\S+$/i.test(value)) return null;
  return value.replace(/^Bearer\s+/i, '').trim();
}

async function getAuthUser(token: string): Promise<AuthUser | null> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Supabase Auth verification failed (${response.status}).`);
  return await response.json() as AuthUser;
}

async function resolveCustomer(user: AuthUser): Promise<CustomerRow> {
  const { url, key } = config();
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const query = new URLSearchParams({ auth_user_id: `eq.${user.id}`, select: 'id,auth_user_id,email,display_name', limit: '1' });
  const lookup = await fetch(`${url}/rest/v1/customers?${query}`, { headers });
  if (!lookup.ok) throw new Error(`Customer identity lookup failed (${lookup.status}).`);
  const rows = await lookup.json() as CustomerRow[];
  if (rows[0]) return rows[0];

  const metadata = user.user_metadata ?? {};
  const displayName = typeof metadata.full_name === 'string' ? metadata.full_name : typeof metadata.name === 'string' ? metadata.name : null;
  const create = await fetch(`${url}/rest/v1/customers`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation,resolution=ignore-duplicates' },
    body: JSON.stringify({ auth_user_id: user.id, email: user.email ?? null, display_name: displayName }),
  });
  if (!create.ok) throw new Error(`Customer identity creation failed (${create.status}).`);
  const created = await create.json() as CustomerRow[];
  if (created[0]) return created[0];

  const retry = await fetch(`${url}/rest/v1/customers?${query}`, { headers });
  if (!retry.ok) throw new Error(`Customer identity retry failed (${retry.status}).`);
  const retryRows = await retry.json() as CustomerRow[];
  if (!retryRows[0]) throw new Error('Authenticated user has no customer identity.');
  return retryRows[0];
}

export async function principal(req: any): Promise<AuthenticatedPrincipal | null> {
  const token = bearer(req);
  if (!token) return null;
  const user = await getAuthUser(token);
  if (!user?.id) return null;
  const customer = await resolveCustomer(user);
  return { customerId: customer.id };
}

export function isDevelopment(req: any): boolean {
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv !== 'production' && Boolean(req.headers?.['x-dev-customer-id']);
}

export function devPrincipal(req: any): AuthenticatedPrincipal | null {
  if (!isDevelopment(req)) return null;
  const value = req.headers?.['x-dev-customer-id'];
  const id = Array.isArray(value) ? value[0] : value;
  return typeof id === 'string' && id.trim() ? { customerId: id } : null;
}
