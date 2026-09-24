async function principal(req:any){ const auth=await import('../apps/customer_web/api/_auth.js'); return auth.principal(req); }

type Row=Record<string,any>;
function json(res:any,status:number,body:unknown){return res.status(status).setHeader('Content-Type','application/json').setHeader('Cache-Control','no-store').json(body);}
function config(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Supabase household configuration is missing.');return{url:url.replace(/\/$/,''),key};}
async function supabase<T>(path:string,init?:RequestInit):Promise<T>{const{url,key}=config();const r=await fetch(url+'/rest/v1/'+path,{...init,headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json','Content-Type':'application/json',...(init?.headers??{})}});if(!r.ok){const d=await r.text();throw new Error('Supabase household list request failed ('+r.status+'): '+d.slice(0,300));}if(r.status===204)return undefined as T;return await r.json() as T;}
async function customerId(authUserId:string){const rows=await supabase<Array<{id:string}>>('customers?auth_user_id=eq.'+encodeURIComponent(authUserId)+'&select=id&limit=1');return rows[0]?.id??null;}
async function household(customer:string){const rows=await supabase<Array<{household_id:string;role:string}>>('household_memberships?customer_id=eq.'+encodeURIComponent(customer)+'&status=eq.active&select=household_id,role&limit=1');return rows[0]??null;}
async function ownedList(customer:string,listId:string){const h=await household(customer);if(!h)return null;const rows=await supabase<Row[]>('household_shopping_lists?id=eq.'+encodeURIComponent(listId)+'&household_id=eq.'+encodeURIComponent(h.household_id)+'&select=id,name,status,created_by_customer_id,created_at,updated_at,version&limit=1');return rows[0]??null;}
export default async function handler(req:any,res:any){
 if(!['GET','POST','PATCH','DELETE'].includes(req.method))return res.status(405).setHeader('Allow','GET, POST, PATCH, DELETE').json({error:{message:'Method not allowed.'}});
 try{
  const user=await principal(req);if(!user)return json(res,401,{error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
  const customer=await customerId(user.authUserId);if(!customer)return json(res,404,{error:{code:'CUSTOMER_NOT_FOUND',message:'Authenticated user has no customer identity.'}});
  const h=await household(customer);if(!h)return json(res,404,{error:{code:'HOUSEHOLD_NOT_FOUND',message:'No active household exists.'}});
  const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
  const listId=String(req.query?.listId??body.listId??'').trim();
  if(req.method==='GET'){
   const lists=await supabase<Row[]>('household_shopping_lists?household_id=eq.'+encodeURIComponent(h.household_id)+'&status=eq.active&select=id,name,status,created_by_customer_id,created_at,updated_at,version&order=created_at.asc');
   const ids=lists.map(x=>x.id);const items=ids.length?await supabase<Row[]>('household_shopping_list_items?shopping_list_id=in.('+ids.join(',')+')&select=id,shopping_list_id,product_id,requested_name,quantity,status,source,added_by_customer_id,created_at,updated_at&order=created_at.asc'):[];return json(res,200,{lists:lists.map(l=>({...l,items:items.filter(i=>i.shopping_list_id===l.id)}))});
  }
  if(req.method==='POST'){
   const action=String(body.action??'list').toLowerCase();
   if(action==='list'){
    const name=typeof body.name==='string'?body.name.trim():'';if(!name)return json(res,400,{error:{code:'INVALID_NAME',message:'List name is required.'}});
    const created=await supabase<Row[]>('household_shopping_lists',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({household_id:h.household_id,name,status:'active',created_by_customer_id:customer})});return json(res,201,{list:created[0]});
   }
   if(action==='item'){
    if(!listId)return json(res,400,{error:{code:'LIST_REQUIRED',message:'listId is required.'}});const list=await ownedList(customer,listId);if(!list)return json(res,404,{error:{code:'LIST_NOT_FOUND',message:'Shopping list not found.'}});
    const name=typeof body.requestedName==='string'?body.requestedName.trim():'';const quantity=Math.max(1,Number(body.quantity??1));if(!name&&!body.productId)return json(res,400,{error:{code:'ITEM_REQUIRED',message:'A product or item name is required.'}});
    const created=await supabase<Row[]>('household_shopping_list_items',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({shopping_list_id:list.id,product_id:body.productId||null,requested_name:name||null,quantity,status:'open',source:body.source==='recurring'||body.source==='ai'||body.source==='recommendation'?''+body.source:'manual',added_by_customer_id:customer})});return json(res,201,{item:created[0]});
   }
   return json(res,400,{error:{code:'INVALID_ACTION',message:'Unsupported shopping list action.'}});
  }
  if(!listId)return json(res,400,{error:{code:'LIST_REQUIRED',message:'listId is required.'}});
  if(req.method==='PATCH'){
   if(body.itemId){const list=await ownedList(customer,listId);if(!list)return json(res,404,{error:{code:'LIST_NOT_FOUND',message:'Shopping list not found.'}});const updates:any={};if(body.status)updates.status=body.status;if(body.quantity!==undefined)updates.quantity=Math.max(1,Number(body.quantity));if(body.requestedName!==undefined)updates.requested_name=String(body.requestedName).trim()||null;updates.updated_at=new Date().toISOString();const rows=await supabase<Row[]>('household_shopping_list_items?id=eq.'+encodeURIComponent(body.itemId)+'&shopping_list_id=eq.'+encodeURIComponent(listId),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(updates)});return json(res,200,{item:rows[0]??null});}
   const list=await ownedList(customer,listId);if(!list)return json(res,404,{error:{code:'LIST_NOT_FOUND',message:'Shopping list not found.'}});const name=typeof body.name==='string'?body.name.trim():list.name;const status=['active','completed','archived'].includes(body.status)?body.status:list.status;const rows=await supabase<Row[]>('household_shopping_lists?id=eq.'+encodeURIComponent(listId),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({name,status,updated_at:new Date().toISOString(),version:Number(list.version??1)+1})});return json(res,200,{list:rows[0]??null});
  }
  if(req.method==='DELETE'){
   const list=await ownedList(customer,listId);if(!list)return json(res,404,{error:{code:'LIST_NOT_FOUND',message:'Shopping list not found.'}});
   if(body.itemId){await supabase('household_shopping_list_items?id=eq.'+encodeURIComponent(body.itemId)+'&shopping_list_id=eq.'+encodeURIComponent(listId),{method:'DELETE'});return json(res,200,{deleted:true});}
   await supabase('household_shopping_lists?id=eq.'+encodeURIComponent(listId),{method:'PATCH',body:JSON.stringify({status:'archived',updated_at:new Date().toISOString()})});return json(res,200,{archived:true});
  }
 }catch(e){console.error('household-lists-api error',e);return json(res,500,{error:{code:'HOUSEHOLD_LISTS_INTERNAL_ERROR',message:e instanceof Error?e.message:'Shopping list service unavailable.'}});}
}