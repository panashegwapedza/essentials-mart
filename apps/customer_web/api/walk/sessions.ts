async function db(path:string,init:RequestInit={}){
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Supabase Walk Mode configuration is missing.');
  const response=await fetch(url.replace(/\/$/,'')+'/rest/v1/'+path,{...init,headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json','Content-Type':'application/json',...(init.headers??{})}});
  const text=await response.text();
  if(!response.ok)throw new Error('Supabase Walk Mode request failed ('+response.status+'): '+text.slice(0,300));
  return text?JSON.parse(text):null;
}
export default async function handler(req:any,res:any){
  if(req.method!=='POST')return res.status(405).setHeader('Allow','POST').json({error:{code:'METHOD_NOT_ALLOWED',message:'Walk Mode sessions requires POST.'}});
  try{
    const {principal}=await import('../_auth.js');
    const user=await principal(req);
    if(!user)return res.status(401).json({error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
    const storeId=typeof body.storeId==='string'?body.storeId:'';
    const mode=['MANUAL','AI_ASSISTED','AUTOPILOT'].includes(body.mode)?body.mode:'MANUAL';
    if(!storeId)return res.status(400).json({error:{code:'VALIDATION_ERROR',message:'storeId is required.'}});
    const customers=await db('customers?select=id&auth_user_id=eq.'+encodeURIComponent(user.authUserId)+'&limit=1');
    const customerId=customers?.[0]?.id;
    if(!customerId)return res.status(404).json({error:{code:'CUSTOMER_NOT_FOUND',message:'Customer identity could not be resolved.'}});
    const layouts=await db('walk_layouts?select=id,version&store_id=eq.'+encodeURIComponent(storeId)+'&status=eq.active&order=version.desc&limit=1');
    const layout=layouts?.[0];
    if(!layout)return res.status(404).json({error:{code:'NOT_FOUND',message:'No active Walk Mode layout exists for this store.'}});
    const entrances=await db('walk_navigation_nodes?select=id&layout_id=eq.'+encodeURIComponent(layout.id)+'&node_type=eq.ENTRANCE&limit=1');
    const payload={customer_id:customerId,store_id:storeId,layout_id:layout.id,layout_version:Number(layout.version),mode,status:'ACTIVE',current_node_id:entrances?.[0]?.id??null};
    const created=await db('walk_sessions',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
    return res.status(201).json({session:created?.[0]??null});
  }catch(error){
    console.error('walk-session error',error);
    return res.status(500).json({error:{code:'WALK_SESSION_FAILED',message:error instanceof Error?error.message:'Walk Mode session could not be created.'}});
  }
}
