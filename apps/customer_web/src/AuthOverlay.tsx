import { useEffect, useState } from 'react';
import { getSession, signIn, signOut, signUp } from './auth';

export default function AuthOverlay() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState(() => getSession()?.user ?? null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (button?.textContent?.trim() === 'Account') { event.preventDefault(); event.stopPropagation(); setOpen(true); }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (!email.trim() || !password) throw new Error('Email and password are required.');
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        const session = await signUp(email.trim().toLowerCase(), password, name.trim());
        if (!session) {
          setError('Account created. Check your email to confirm the account, then sign in.');
          setMode('signin');
          return;
        }
        setUser(session.user);
      } else {
        const session = await signIn(email.trim().toLowerCase(), password);
        setUser(session.user);
      }
      setOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally { setBusy(false); }
  }

  async function handleSignOut() {
    setBusy(true);
    await signOut();
    setUser(null); setBusy(false); setOpen(false); window.location.reload();
  }

  return <>
    {open && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(23,32,25,.42)', display:'grid', placeItems:'center', padding:20 }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" style={{ width:'min(430px,100%)', background:'#fff', borderRadius:26, padding:30, boxShadow:'0 24px 70px rgba(23,32,25,.22)' }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}><div><p className="eyebrow">ESSENTIALS MART</p><h2 id="auth-title">{user ? `Hi, ${user.user_metadata?.full_name ?? user.email ?? 'there'}` : mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2></div><button type="button" onClick={() => setOpen(false)} style={{border:0,background:'transparent',fontSize:28}}>×</button></div>
        {user ? <div style={{display:'grid',gap:14,marginTop:24}}><p style={{color:'#617066'}}>Signed in as <strong>{user.email}</strong>.</p><button type="button" disabled={busy} onClick={handleSignOut} style={{border:0,borderRadius:999,padding:14,background:'#172019',color:'#fff',fontWeight:800}}>{busy ? 'Signing out…' : 'Sign out'}</button></div> : <form onSubmit={submit} style={{display:'grid',gap:13,marginTop:22}}>
          {mode === 'signup' && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoComplete="name" style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" autoComplete="email" style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" autoComplete={mode==='signin'?'current-password':'new-password'} style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />
          {error && <p role="alert" style={{margin:0,color:'#9b3d35',fontSize:'.9rem'}}>{error}</p>}
          <button type="submit" disabled={busy} style={{border:0,borderRadius:999,padding:14,background:'#238a4b',color:'#fff',fontWeight:800}}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
          <button type="button" disabled={busy} onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');}} style={{border:0,background:'transparent',color:'#238a4b',fontWeight:700}}>{mode==='signin'?'Create a new account':'I already have an account'}</button>
        </form>}
      </section>
    </div>}
    {!user && <button type="button" onClick={()=>setOpen(true)} aria-label="Sign in" style={{position:'fixed',right:18,bottom:18,zIndex:40,border:0,borderRadius:999,padding:'11px 16px',background:'#172019',color:'#fff',fontWeight:800,boxShadow:'0 10px 30px rgba(23,32,25,.18)'}}>Sign in</button>}
  </>;
}
