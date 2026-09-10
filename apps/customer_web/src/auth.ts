export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
  user: { id: string; email?: string | null; phone?: string | null; user_metadata?: Record<string, unknown> | null };
};

const SUPABASE_URL = 'https://gnmcfenenikvvvvmeuwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RyqK29U1JIHt4nmu-mGX4Q_jFRYWLEZ';
const SESSION_KEY = 'essentials-mart-auth-session';
const SUPABASE_SESSION_KEY = 'sb-gnmcfenenikvvvvmeuwp-auth-token';

export function getSession(): AuthSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as AuthSession | null; } catch { return null; }
}

function saveSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SUPABASE_SESSION_KEY);
  }
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

export async function signIn(identifier: string, password: string): Promise<AuthSession> {
  const credentials = identifier.includes('@')
    ? { email: identifier.trim().toLowerCase(), password }
    : { phone: identifier.trim(), password };
  const session = await authRequest<AuthSession>('token?grant_type=password', credentials);
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

export function beginSocialSignIn(provider: 'google' | 'apple') {
  const redirectTo = window.location.origin + window.location.pathname;
  const url = new URL(`${SUPABASE_URL}/auth/v1/authorize`);
  url.searchParams.set('provider', provider);
  url.searchParams.set('redirect_to', redirectTo);
  window.location.assign(url.toString());
}

export async function consumeOAuthSession(): Promise<AuthSession | null> {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return null;
  let user: AuthSession['user'] | null = null;
  const userJson = params.get('user');
  try { user = userJson ? JSON.parse(userJson) : null; } catch { user = null; }
  if (!user) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    user = await response.json() as AuthSession['user'];
  }
  const session: AuthSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Number(params.get('expires_at') || 0) || undefined,
    user,
  };
  saveSession(session);
  window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
  return session;
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
  const oauthSession = await consumeOAuthSession();
  if (oauthSession) return oauthSession;
  const session = getSession();
  if (!session) return null;
  if (!session.expires_at || session.expires_at * 1000 > Date.now() + 60_000) return session;
  return refreshSession();
}
