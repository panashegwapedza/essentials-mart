import { useEffect, useState } from 'react';

type LocalUser = { email: string; password: string; name: string; customerId: string };
const USERS_KEY = 'essentials-mart-dev-users';
const SESSION_KEY = 'essentials-mart-dev-session';

function readUsers(): LocalUser[] { try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as LocalUser[]; } catch { return []; } }
function currentUser(): LocalUser | null { try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as LocalUser | null; } catch { return null; } }

export default function AuthOverlay() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<LocalUser | null>(() => currentUser());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      const session = currentUser();
      if (session) headers.set('x-dev-customer-id', session.customerId);
      return originalFetch(input, { ...init, headers });
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (button?.textContent?.trim() === 'Account') { event.preventDefault(); event.stopPropagation(); setOpen(true); }
    };
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('click', onClick, true); window.fetch = originalFetch; };
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) return setError('Email and password are required.');
    const users = readUsers();
    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your name.');
      if (password.length < 6) return setError('Password must be at least 6 characters.');
      if (users.some((candidate) => candidate.email === normalized)) return setError('An account with that email already exists.');
      const next: LocalUser = { email: normalized, password, name: name.trim(), customerId: `web-${crypto.randomUUID()}` };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, next]));
      localStorage.setItem(SESSION_KEY, JSON.stringify(next)); setUser(next); setOpen(false); window.location.reload(); return;
    }
    const found = users.find((candidate) => candidate.email === normalized && candidate.password === password);
    if (!found) return setError('Incorrect email or password.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(found)); setUser(found); setOpen(false); window.location.reload();
  }

  function signOut() { localStorage.removeItem(SESSION_KEY); setUser(null); setOpen(false); window.location.reload(); }

  return <>
    {open && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(23,32,25,.42)', display:'grid', placeItems:'center', padding:20 }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" style={{ width:'min(430px,100%)', background:'#fff', borderRadius:26, padding:30, boxShadow:'0 24px 70px rgba(23,32,25,.22)' }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}><div><p className="eyebrow">ESSENTIALS MART</p><h2 id="auth-title">{user ? `Hi, ${user.name}` : mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2></div><button type="button" onClick={() => setOpen(false)} style={{border:0,background:'transparent',fontSize:28}}>×</button></div>
        {user ? <div style={{display:'grid',gap:14,marginTop:24}}><p style={{color:'#617066'}}>Signed in as <strong>{user.email}</strong>.</p><button type="button" onClick={signOut} style={{border:0,borderRadius:999,padding:14,background:'#172019',color:'#fff',fontWeight:800}}>Sign out</button></div> : <form onSubmit={submit} style={{display:'grid',gap:13,marginTop:22}}>
          {mode === 'signup' && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoComplete="name" style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" autoComplete="email" style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" autoComplete={mode==='signin'?'current-password':'new-password'} style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />
          {error && <p role="alert" style={{margin:0,color:'#9b3d35',fontSize:'.9rem'}}>{error}</p>}
          <button type="submit" style={{border:0,borderRadius:999,padding:14,background:'#238a4b',color:'#fff',fontWeight:800}}>{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
          <button type="button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');}} style={{border:0,background:'transparent',color:'#238a4b',fontWeight:700}}>{mode==='signin'?'Create a new account':'I already have an account'}</button>
        </form>}
        <p style={{margin:'18px 0 0',fontSize:'.75rem',lineHeight:1.5,color:'#748077'}}>Local development authentication only. Passwords are stored in this browser for testing and must not be used as the production authentication mechanism.</p>
      </section>
    </div>}
    {!user && <button type="button" onClick={()=>setOpen(true)} aria-label="Sign in" style={{position:'fixed',right:18,bottom:18,zIndex:40,border:0,borderRadius:999,padding:'11px 16px',background:'#172019',color:'#fff',fontWeight:800,boxShadow:'0 10px 30px rgba(23,32,25,.18)'}}>Sign in</button>}
  </>;
}
