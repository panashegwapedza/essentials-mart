export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null };
};

const SUPABASE_URL = 'https://gnmcfenenikvvvvmeuwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RyqK29U1JIHt4nmu-mGX4Q_jFRYWLEZ';
const SESSION_KEY = 'essentials-mart-auth-session';

export function getSession(): AuthSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as AuthSession | null; } catch { return null; }
}

function saveSession(session: AuthSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (payload as { error_description?: string; msg?: string; message?: string } | null)?.error_description
      ?? (payload as { msg?: string } | null)?.msg
      ?? (payload as { message?: string } | null)?.message
      ?? `Authentication failed (${response.status}).`;
    throw new Error(message);
  }
  return payload as T;
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const session = await authRequest<AuthSession>('token?grant_type=password', { email, password });
  saveSession(session);
  return session;
}

export async function signUp(email: string, password: string, name: string): Promise<AuthSession | null> {
  const result = await authRequest<AuthSession>('signup', { email, password, data: { full_name: name } });
  if (result.access_token) {
    saveSession(result);
    return result;
  }
  return null;
}

export async function refreshSession(): Promise<AuthSession | null> {
  const current = getSession();
  if (!current?.refresh_token) return null;
  try {
    const next = await authRequest<AuthSession>('token?grant_type=refresh_token', { refresh_token: current.refresh_token });
    saveSession(next);
    return next;
  } catch {
    saveSession(null);
    return null;
  }
}

export async function signOut(): Promise<void> {
  const session = getSession();
  if (session?.access_token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.access_token}` } }).catch(() => undefined);
  }
  saveSession(null);
}

export async function ensureFreshSession(): Promise<AuthSession | null> {
  const session = getSession();
  if (!session) return null;
  if (!session.expires_at || session.expires_at * 1000 > Date.now() + 60_000) return session;
  return refreshSession();
}
