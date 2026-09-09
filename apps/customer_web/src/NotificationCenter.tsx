import { useEffect, useMemo, useState } from 'react';
import { commerceClient, type Notification } from './api/commerce';

export default function NotificationCenter(){
  const [items,setItems]=useState<Notification[]>([]);
  const [open,setOpen]=useState(false);
  const unread=useMemo(()=>items.filter(x=>x.status==='unread').length,[items]);

  async function refresh(){
    try{ setItems(await commerceClient.listNotifications()); }
    catch{ /* AuthOverlay handles authentication; notification centre stays non-blocking. */ }
  }

  useEffect(()=>{ void refresh(); const timer=window.setInterval(()=>void refresh(),20000); return()=>window.clearInterval(timer); },[]);

  async function openNotification(notification:Notification){
    if(notification.status==='unread'){
      try{
        const read=await commerceClient.markNotificationRead(notification.id);
        setItems(prev=>prev.map(x=>x.id===read.id?read:x));
      }catch{}
    }

    if(notification.actionType==='open_order'&&notification.aggregateId){
      setOpen(false);
      const url=new URL(window.location.href);
      url.searchParams.set('order',notification.aggregateId);
      window.history.pushState({},'',`${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  return <>
    <button type="button" aria-label={`Notifications${unread?` (${unread} unread)`:''}`} onClick={()=>setOpen(true)} style={{position:'fixed',right:18,top:82,zIndex:40,border:'1px solid rgba(20,40,30,.12)',borderRadius:999,padding:'10px 14px',background:'#fff',boxShadow:'0 10px 30px rgba(20,40,30,.12)',cursor:'pointer',fontWeight:700}}>
      Notifications{unread>0&&<span style={{marginLeft:8,minWidth:20,height:20,display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:999,background:'#173b2a',color:'#fff',fontSize:12}}>{unread}</span>}
    </button>
    {open&&<>
      <button type="button" aria-label="Close notifications" onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:44,border:0,background:'rgba(0,0,0,.18)'}}/>
      <aside style={{position:'fixed',right:0,top:0,bottom:0,width:'min(420px,92vw)',zIndex:45,background:'#fff',boxShadow:'-20px 0 60px rgba(0,0,0,.18)',padding:24,overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><div><div style={{fontSize:11,letterSpacing:'.14em',fontWeight:800,opacity:.55}}>NOTIFICATIONS</div><h2 style={{margin:'6px 0 0'}}>Updates</h2></div><button type="button" onClick={()=>setOpen(false)} style={{border:0,background:'transparent',fontSize:28,cursor:'pointer'}}>×</button></div>
        {items.length===0?<p style={{opacity:.65}}>No notifications yet.</p>:<div style={{display:'grid',gap:10}}>{items.map(item=><button key={item.id} type="button" onClick={()=>void openNotification(item)} style={{textAlign:'left',border:'1px solid rgba(20,40,30,.1)',borderRadius:16,padding:14,background:item.status==='unread'?'#f1f7f3':'#fff',cursor:item.actionType?'pointer':'default'}}><strong style={{display:'block'}}>{item.title}</strong><span style={{display:'block',marginTop:5,opacity:.75,lineHeight:1.4}}>{item.body}</span><small style={{display:'block',marginTop:8,opacity:.5}}>{new Date(item.createdAt).toLocaleString()}</small></button>)}</div>}
      </aside>
    </>}
  </>;
}
