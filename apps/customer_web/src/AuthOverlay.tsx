import { useEffect, useState } from 'react';
import { beginSocialSignIn, consumeOAuthSession, ensureFreshSession, getSession, signIn, signOut, signUp, type AuthSession } from './auth';

const SUPABASE_URL = 'https://gnmcfenenikvvvvmeuwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RyqK29U1JIHt4nmu-mGX4Q_jFRYWLEZ';

export default function AuthOverlay() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const syncAccountButton = () => {
    const button = document.querySelector<HTMLButtonElement>('.topbar .quiet-button');
    if (!button) return;
    const label = getSession()?.user ? 'Account' : 'Log in';
    button.dataset.authAccountButton = 'true';
    if (button.textContent !== label) button.textContent = label;
  };

  const enhanceAccountSettings = () => {
    const drawer = document.querySelector('.account-drawer') as HTMLElement | null;
    if (!drawer || drawer.dataset.settingsEnhanced === 'true') return;
    drawer.dataset.settingsEnhanced = 'true';
    const buttons = Array.from(drawer.querySelectorAll<HTMLButtonElement>('.account-section'));
    const preferences = buttons.find((button) => button.textContent?.trim() === 'Preferences');
    if (preferences) preferences.textContent = 'Settings';

    const signOutButton = document.createElement('button');
    signOutButton.type = 'button';
    signOutButton.textContent = 'Log out';
    signOutButton.style.cssText = 'width:100%;border:1px solid #ead4d1;border-radius:12px;padding:13px 14px;background:#fff7f6;color:#9b3d35;font:inherit;font-weight:700;cursor:pointer;margin-top:8px;';
    signOutButton.addEventListener('click', async () => {
      signOutButton.disabled = true;
      signOutButton.textContent = 'Logging out…';
      await signOut();
      window.location.reload();
    });
    drawer.appendChild(signOutButton);

    const settingsButton = Array.from(drawer.querySelectorAll<HTMLButtonElement>('.account-section')).find((button) => button.textContent?.trim() === 'Settings');
    const placeholder = drawer.querySelector('.account-placeholder') as HTMLElement | null;
    if (settingsButton && placeholder) {
      settingsButton.addEventListener('click', () => {
        placeholder.innerHTML = `
          <p class="eyebrow">ACCOUNT SETTINGS</p>
          <h3>Settings</h3>
          <div style="display:grid;gap:10px;margin-top:14px">
            <div style="padding:12px;border:1px solid #dfe7df;border-radius:11px;background:#fff"><strong>Notifications</strong><p style="margin:4px 0 0;color:#617064">Manage order and household notifications from the notification centre.</p></div>
            <div style="padding:12px;border:1px solid #dfe7df;border-radius:11px;background:#fff"><strong>Privacy & security</strong><p style="margin:4px 0 0;color:#617064">Authentication and commerce access are governed by your Supabase session and account policies.</p></div>
            <div style="padding:12px;border:1px solid #dfe7df;border-radius:11px;background:#fff"><strong>Sign-in methods</strong><p style="margin:4px 0 0;color:#617064">Email/phone password and configured social sign-in methods are managed through account authentication.</p></div>
          </div>`;
        placeholder.style.display = 'block';
      });
    }
  };

  useEffect(() => {
    let cancelled = false;
    void ensureFreshSession().then((session) => {
      if (!cancelled) setUser(session?.user ?? null);
      syncAccountButton();
    });

    const observer = new MutationObserver(() => {
      syncAccountButton();
      if (getSession()?.user) enhanceAccountSettings();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>('.topbar .quiet-button');
      if (!button) return;
      if (!getSession()?.user) {
        event.preventDefault();
        event.stopPropagation();
        setMode('signin');
        setError('');
        setOpen(true);
      } else {
        window.setTimeout(enhanceAccountSettings, 0);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  useEffect(() => { syncAccountButton(); }, [user]);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (!identifier.trim() || !password) throw new Error('Enter your email or phone number and password.');
      if (mode === 'signup') {
        if (!identifier.includes('@')) throw new Error('Account creation currently uses email. You can sign in with email or phone.');
        if (!name.trim()) throw new Error('Please enter your name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        const session = await signUp(identifier.trim().toLowerCase(), password, name.trim());
        if (!session) { setError('Account created. Check your email to confirm the account, then sign in.'); setMode('signin'); return; }
        setUser(session.user);
      } else {
        const session = await signIn(identifier.trim(), password);
        setUser(session.user);
      }
      setOpen(false); window.location.reload();
    } catch (err) { setError(err instanceof Error ? err.message : 'Authentication failed.'); }
    finally { setBusy(false); }
  }

  function social(provider: 'google' | 'apple') {
    setError(''); setBusy(true);
    try { beginSocialSignIn(provider); } catch (err) { setBusy(false); setError(err instanceof Error ? err.message : 'Social sign-in could not start.'); }
  }

  return <>
    {open && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(23,32,25,.52)', display:'grid', placeItems:'center', padding:20 }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" style={{ width:'min(470px,100%)', background:'#fff', borderRadius:26, padding:30, boxShadow:'0 24px 70px rgba(23,32,25,.28)' }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}><div><p className="eyebrow">ESSENTIALS MART</p><h2 id="auth-title">{mode === 'signin' ? 'Log in to Essentials Mart' : 'Create your account'}</h2><p style={{margin:'8px 0 0',color:'#617064'}}>Access your household profile, orders, payments and settings.</p></div><button type="button" onClick={() => setOpen(false)} style={{border:0,background:'transparent',fontSize:28,cursor:'pointer'}}>×</button></div>
        <div style={{display:'grid',gap:10,marginTop:22}}>
          <button type="button" disabled={busy} onClick={() => social('google')} style={{border:'1px solid #dfe5dc',borderRadius:12,padding:13,background:'#fff',color:'#172019',fontWeight:800,cursor:'pointer'}}>Continue with Google</button>
          <button type="button" disabled={busy} onClick={() => social('apple')} style={{border:'1px solid #172019',borderRadius:12,padding:13,background:'#172019',color:'#fff',fontWeight:800,cursor:'pointer'}}>Continue with Apple</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'18px 0',color:'#879289',fontSize:12}}><span style={{height:1,background:'#e5e9e4',flex:1}}/><span>OR</span><span style={{height:1,background:'#e5e9e4',flex:1}}/></div>
        <form onSubmit={submit} style={{display:'grid',gap:13}}>
          {mode === 'signup' && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoComplete="name" style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />}
          <input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="Email or phone number" type="text" autoComplete="username" style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" autoComplete={mode==='signin'?'current-password':'new-password'} style={{padding:13,border:'1px solid #dfe5dc',borderRadius:12}} />
          {error && <p role="alert" style={{margin:0,color:'#9b3d35',fontSize:'.9rem'}}>{error}</p>}
          <button type="submit" disabled={busy} style={{border:0,borderRadius:999,padding:14,background:'#238a4b',color:'#fff',fontWeight:800,cursor:'pointer'}}>{busy ? 'Please wait…' : mode === 'signin' ? 'Log in' : 'Create account'}</button>
          <button type="button" disabled={busy} onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');}} style={{border:0,background:'transparent',color:'#238a4b',fontWeight:700,cursor:'pointer'}}>{mode==='signin'?'Create a new account':'I already have an account'}</button>
        </form>
      </section>
    </div>}
  </>;
}
