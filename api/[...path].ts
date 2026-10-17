import type { AuthenticatedPrincipal } from '../services/commerce-api/src/domain.js';

function json(res:any,status:number,body:unknown){
  return res.status(status).setHeader('Content-Type','application/json').setHeader('Cache-Control','no-store').send(JSON.stringify(body));
}
function error(res:any,status:number,code:string,message:string){
  return json(res,status,{error:{code,message}});
}
function productDto(product:any){
  return {id:product.id,name:product.name,category:product.category||product.productFamily||'Essentials',productFamily:product.productFamily,brand:product.brand||'Essentials',variantLabel:product.variantLabel,sizeLabel:product.sizeLabel,imageUrl:product.imageUrl,price:product.price,available:product.available,stockQuantity:product.stockQuantity};
}
function basketDto(basket:any){return {id:basket.id,lines:basket.lines};}
async function orderDto(order:any){const ids=[...new Set((order.lines??[]).map((line:any)=>line.productId).filter(Boolean))];let products:any[]=[];let snapshotItems:any[]=[];try{const supabaseRest=await getSupabaseRest();const items=await supabaseRest<any[]>(`order_items?select=product_id,product_name,sku,quantity,unit_price,line_total&order_id=eq.${encodeURIComponent(order.id)}&order=created_at.asc`);snapshotItems=items??[];if(ids.length){const q=ids.map((id:string)=>encodeURIComponent(id)).join(',');products=await supabaseRest<any[]>(`products?select=id,name,brand,variant_label,size_label&id=in.(${q})`);}}catch{products=[];snapshotItems=[];}const byId=new Map(products.map((p:any)=>[p.id,p]));const snapshotById=new Map(snapshotItems.map((x:any)=>[x.product_id,x]));const sourceLines=(snapshotItems.length?snapshotItems:(order.lines??[]));return {id:order.id,status:order.status,subtotal:order.subtotal,deliveryMethod:order.deliveryMethod,deliveryFee:order.deliveryFee,total:order.total,lines:sourceLines.map((line:any)=>{const p=byId.get(line.productId??line.product_id);const snap=snapshotById.get(line.productId??line.product_id);const productName=line.productName??line.product_name??p?.name??line.productId??line.product_id;return {productId:line.productId??line.product_id,quantity:Number(line.quantity),unitPrice:line.unitPrice??{amountMinor:Math.round(Number(line.unit_price??0)*100),currency:order.total?.currency??'USD'},product:{name:productName,brand:p?.brand,variantLabel:p?.variant_label,sizeLabel:p?.size_label,sku:line.sku??snap?.sku}};}),delivery:order.delivery,createdAt:order.createdAt};}
async function getCommerce(){
  const [{SupabaseProductRepository,SupabaseBasketRepository,SupabaseOrderRepository,SupabaseCheckoutTransaction},{CommerceApplicationService}]=await Promise.all([
    import('../services/commerce-api/src/adapters/supabase/SupabaseCommerceRepositories.js'),
    import('../services/commerce-api/src/application/CommerceApplicationService.js')
  ]);
  return new CommerceApplicationService(new SupabaseProductRepository(),new SupabaseBasketRepository(),new SupabaseOrderRepository(),new SupabaseCheckoutTransaction());
}
async function getSupabaseRest(){
  const {supabaseRest}=await import('../services/commerce-api/src/adapters/supabase/SupabaseCommerceRepositories.js');
  return supabaseRest;
}
async function getBuckPay(){
  const [{SupabaseBuckPayRepository},{BuckPayApplicationService}]=await Promise.all([
    import('../services/commerce-api/src/adapters/supabase/SupabaseBuckPayRepository.js'),
    import('../services/commerce-api/src/application/BuckPayApplicationService.js')
  ]);
  return new BuckPayApplicationService(new SupabaseBuckPayRepository());
}
async function getNotifications(){
  const [{SupabaseNotificationRepository},{NotificationApplicationService}]=await Promise.all([
    import('../services/commerce-api/src/adapters/supabase/SupabaseNotificationRepository.js'),
    import('../services/commerce-api/src/application/NotificationApplicationService.js')
  ]);
  return new NotificationApplicationService(new SupabaseNotificationRepository());
}
async function resolvePrincipal(req:any):Promise<AuthenticatedPrincipal|null>{
  const {devPrincipal,principal}=await import('../apps/customer_web/api/_auth.js');
  const dev=devPrincipal(req);
  return dev??principal(req);
}
function requestPath(req:any){
  const url=typeof req.url==='string'?req.url:'';
  const pathname=url.split('?')[0];
  if(pathname.startsWith('/api/'))return decodeURIComponent(pathname.slice(4));
  if(pathname==='/api')return '/';
  const raw=typeof req.query?.path==='string'?'/'+req.query.path:Array.isArray(req.query?.path)?'/'+req.query.path.join('/'):'/';
  return decodeURIComponent(raw);
}

export default async function handler(req:any,res:any){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization, x-dev-customer-id, Idempotency-Key');
  res.setHeader('Vary','Origin, Authorization');
  if(req.method==='OPTIONS')return res.status(204).end();

  const path=requestPath(req);
  try{
    if(path==='/health'){
      try{
        const supabaseRest=await getSupabaseRest();
        await supabaseRest<any[]>('products?select=id&limit=1');
        return json(res,200,{status:'ok',service:'essentials-mart-api',dependencies:{supabase:'ok'},timestamp:new Date().toISOString()});
      }catch(error){
        console.error('health check failed',error);
        return json(res,503,{status:'degraded',service:'essentials-mart-api',dependencies:{supabase:'unavailable'},timestamp:new Date().toISOString()});
      }
    }

    if(path==='/walk/stores'&&req.method==='GET'){
      const supabaseRest=await getSupabaseRest();
      const stores=await supabaseRest<any[]>('stores?select=id,code,name,status&status=eq.active&order=name.asc');
      return json(res,200,{stores:stores??[]});
    }
    if(path.startsWith('/walk/stores/')&&path.endsWith('/layout')&&req.method==='GET'){
      const storeId=decodeURIComponent(path.slice('/walk/stores/'.length,-'/layout'.length));
      if(!storeId)return error(res,400,'VALIDATION_ERROR','storeId is required.');
      const supabaseRest=await getSupabaseRest();
      const layouts=await supabaseRest<any[]>('walk_layouts?select=id,store_id,version,status&store_id=eq.'+encodeURIComponent(storeId)+'&status=eq.active&order=version.desc&limit=1');
      const layout=layouts?.[0];
      if(!layout)return error(res,404,'NOT_FOUND','No active Walk Mode layout exists for this store.');
      const [aisles,positions,nodes,edges]=await Promise.all([
        supabaseRest<any[]>('walk_aisles?select=id,name,department,x,z,width,length&layout_id=eq.'+encodeURIComponent(layout.id)+'&order=sort_order.asc'),
        supabaseRest<any[]>('walk_product_positions?select=id,product_id,aisle_id,position_x,position_y,position_z,facing&layout_id=eq.'+encodeURIComponent(layout.id)+'&status=eq.active'),
        supabaseRest<any[]>('walk_navigation_nodes?select=id,label,node_type,x,y,z,status&layout_id=eq.'+encodeURIComponent(layout.id)+'&order=label.asc'),
        supabaseRest<any[]>('walk_navigation_edges?select=id,from_node_id,to_node_id,distance,traversal_type,status&layout_id=eq.'+encodeURIComponent(layout.id)+'&status=eq.OPEN')
      ]);
      return json(res,200,{layout,aisles:aisles??[],products:positions??[],nodes:nodes??[],edges:edges??[]});
    }

    const commerce=await getCommerce();

    if(path==='/products'&&req.method==='GET')
      return json(res,200,{products:(await commerce.listProducts()).map(productDto)});
    if(path.startsWith('/products/')&&req.method==='GET')
      return json(res,200,productDto(await commerce.getProduct(path.slice('/products/'.length))));

    const user=await resolvePrincipal(req);
    if(!user)return error(res,401,'UNAUTHENTICATED','A valid Supabase Auth session is required.');
    if(path==='/walk/sessions'&&req.method==='POST'){
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      const storeId=typeof body.storeId==='string'?body.storeId:'';
      const mode=['MANUAL','AI_ASSISTED','AUTOPILOT'].includes(body.mode)?body.mode:'MANUAL';
      if(!storeId)return error(res,400,'VALIDATION_ERROR','storeId is required.');
      const supabaseRest=await getSupabaseRest();
      const customerId=user.customerId;
      if(!customerId)return error(res,404,'CUSTOMER_NOT_FOUND','Customer identity could not be resolved.');
      const layouts=await supabaseRest<any[]>('walk_layouts?select=id,version&store_id=eq.'+encodeURIComponent(storeId)+'&status=eq.active&order=version.desc&limit=1');
      const layout=layouts?.[0];
      if(!layout)return error(res,404,'NOT_FOUND','No active Walk Mode layout exists for this store.');
      const entrances=await supabaseRest<any[]>('walk_navigation_nodes?select=id&layout_id=eq.'+encodeURIComponent(layout.id)+'&node_type=eq.ENTRANCE&limit=1');
      const payload={customer_id:customerId,store_id:storeId,layout_id:layout.id,layout_version:layout.version,mode,status:'ACTIVE',current_node_id:entrances?.[0]?.id??null};
      const created=await supabaseRest<any[]>('walk_sessions',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
      return json(res,201,{session:created?.[0]??null});
    }



    if(path.startsWith('/walk/sessions/')&&path.endsWith('/actions')&&req.method==='POST'){
      const sessionId=decodeURIComponent(path.slice('/walk/sessions/'.length,-'/actions'.length));
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      const action=typeof body.action==='string'?body.action:'';
      const allowed=['MOVE','PAUSE','TAKE_OVER','RESUME','COMPLETE','CANCEL'];
      if(!sessionId||!allowed.includes(action))return error(res,400,'VALIDATION_ERROR','A valid Walk Mode action is required.');
      const supabaseRest=await getSupabaseRest();
      const owned=await supabaseRest<any[]>('walk_sessions?select=id,status,mode&'+'id=eq.'+encodeURIComponent(sessionId)+'&customer_id=eq.'+encodeURIComponent(user.customerId)+'&limit=1');
      const session=owned?.[0];
      if(!session)return error(res,404,'NOT_FOUND','Walk Mode session could not be found.');
      const patch:any={updated_at:new Date().toISOString()};
      if(action==='PAUSE')patch.status='PAUSED';
      if(action==='TAKE_OVER')patch.status='TAKEN_OVER';
      if(action==='RESUME')patch.status='ACTIVE';
      if(action==='COMPLETE')patch.status='COMPLETED';
      if(action==='CANCEL')patch.status='CANCELLED';
      if(action==='MOVE'&&typeof body.nodeId==='string')patch.current_node_id=body.nodeId;
      const updated=await supabaseRest<any[]>('walk_sessions?id=eq.'+encodeURIComponent(sessionId),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
      return json(res,200,{session:updated?.[0]??null});
    }
    if(path.startsWith('/walk/sessions/')&&path.endsWith('/mode')&&req.method==='POST'){
      const sessionId=decodeURIComponent(path.slice('/walk/sessions/'.length,-'/mode'.length));
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      const mode=['MANUAL','AI_ASSISTED','AUTOPILOT'].includes(body.mode)?body.mode:null;
      if(!sessionId||!mode)return error(res,400,'VALIDATION_ERROR','A valid Walk Mode mode is required.');
      const supabaseRest=await getSupabaseRest();
      const owned=await supabaseRest<any[]>('walk_sessions?select=id,status&'+'id=eq.'+encodeURIComponent(sessionId)+'&customer_id=eq.'+encodeURIComponent(user.customerId)+'&limit=1');
      if(!owned?.[0])return error(res,404,'NOT_FOUND','Walk Mode session could not be found.');
      const updated=await supabaseRest<any[]>('walk_sessions?id=eq.'+encodeURIComponent(sessionId),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({mode,status:'ACTIVE',updated_at:new Date().toISOString()})});
      return json(res,200,{session:updated?.[0]??null});
    }
    if(path==='/basket'&&req.method==='GET')
      return json(res,200,basketDto(await commerce.getOrCreateBasket(user)));

    if(path==='/basket/items'&&req.method==='POST'){
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      if(!body||typeof body.productId!=='string'||!Number.isInteger(body.quantity)||body.quantity<=0)
        return error(res,400,'VALIDATION_ERROR','productId must be a non-empty string and quantity must be a positive integer.');
      return json(res,201,basketDto(await commerce.addItem(user,body.productId,body.quantity)));
    }

    if(path.startsWith('/basket/items/')&&req.method==='PATCH'){
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      const productId=path.slice('/basket/items/'.length);
      if(!productId||!Number.isInteger(body.quantity)||body.quantity<=0)
        return error(res,400,'VALIDATION_ERROR','productId must be present and quantity must be a positive integer.');
      return json(res,200,basketDto(await commerce.setItemQuantity(user,productId,body.quantity)));
    }

    if(path.startsWith('/basket/items/')&&req.method==='DELETE')
      return json(res,200,basketDto(await commerce.removeItem(user,path.slice('/basket/items/'.length))));

    if(path==='/checkout'&&req.method==='POST'){
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      const method=body?.deliveryMethod;
      if(!['pickup','standard','express'].includes(method))
        return error(res,400,'INVALID_DELIVERY_METHOD','Select a valid delivery method before checkout.');
      const key=req.headers?.['idempotency-key'];
      const idempotencyKey=Array.isArray(key)?key[0]:key;
      if(idempotencyKey!==undefined&&typeof idempotencyKey!=='string')
        return error(res,400,'INVALID_IDEMPOTENCY_KEY','Idempotency-Key must be a single string.');
      const placed=await commerce.checkout(user,method,idempotencyKey);
      return json(res,201,await orderDto(placed));
    }

    if(path==='/orders'&&req.method==='GET')
      return json(res,200,{orders:await Promise.all((await commerce.listOwnedOrders(user)).map(orderDto))});
    if(path.startsWith('/orders/')&&req.method==='GET')
      return json(res,200,await orderDto(await commerce.getOwnedOrder(user,path.slice('/orders/'.length))));
if(path==='/notifications'&&req.method==='GET'){
      const notifications=await getNotifications();
      return json(res,200,{notifications:(await notifications.list(user)).map((n:any)=>({id:n.id,type:n.type,title:n.title,body:n.body,status:n.status,aggregateType:n.aggregateType,aggregateId:n.aggregateId,actionType:n.actionType,actionTarget:n.actionTarget,createdAt:n.createdAt}))});
    }
    if(path==='/notifications/mark-all-read'&&req.method==='POST'){ const notifications=await getNotifications(); await notifications.markAllRead(user); return json(res,200,{ok:true}); }
    if(path==='/notifications/history'&&req.method==='GET'){
      const notifications=await getNotifications();
      return json(res,200,{notifications:(await notifications.history(user)).map((n:any)=>({id:n.id,type:n.type,title:n.title,body:n.body,status:n.status,aggregateType:n.aggregateType,aggregateId:n.aggregateId,actionType:n.actionType,actionTarget:n.actionTarget,createdAt:n.createdAt}))});
    }
    if(path==='/notifications/clear'&&req.method==='POST'){
      const notifications=await getNotifications(); await notifications.archiveAll(user); return json(res,200,{ok:true});
    }
    if(path.startsWith('/notifications/')&&path.endsWith('/dismiss')&&req.method==='POST'){
      const notifications=await getNotifications(); const notificationId=path.slice('/notifications/'.length,-'/dismiss'.length); const n=await notifications.archive(user,notificationId); return json(res,200,{id:n.id,type:n.type,title:n.title,body:n.body,status:n.status,aggregateType:n.aggregateType,aggregateId:n.aggregateId,actionType:n.actionType,actionTarget:n.actionTarget,createdAt:n.createdAt});
    }
    if(path.startsWith('/notifications/')&&path.endsWith('/read')&&req.method==='POST'){
      const notifications=await getNotifications();
      const notificationId=path.slice('/notifications/'.length,-'/read'.length);
      const n=await notifications.markRead(user,notificationId);
      return json(res,200,{id:n.id,type:n.type,title:n.title,body:n.body,status:n.status,aggregateType:n.aggregateType,aggregateId:n.aggregateId,actionType:n.actionType,actionTarget:n.actionTarget,createdAt:n.createdAt});
    }
    if(path==='/buckpay'&&req.method==='GET'){
      const buckPay=await getBuckPay();
      const account=await buckPay.getAccount(user);
      return json(res,200,{balance:account.balance,status:account.status});
    }
    if(path==='/buckpay/transactions'&&req.method==='GET'){
      const buckPay=await getBuckPay();
      const transactions=await buckPay.getTransactions(user);
      return json(res,200,{transactions:transactions.map((n:any)=>({id:n.id,type:n.type,amount:n.amount,reference:n.reference,createdAt:n.createdAt}))});
    }

    return error(res,404,'NOT_FOUND','No such route.');
  }catch(err:any){
    console.error('commerce-api error',err);
    const code=err?.code;
    const status=code==='NOT_FOUND'?404:code==='BASKET_EMPTY'||code==='INVALID_AMOUNT'||code==='INVALID_CURRENCY'?400:code==='PRODUCT_UNAVAILABLE'||code==='IDEMPOTENCY_KEY_REUSED'||code==='PAYMENT_IDEMPOTENCY_REUSED'||code==='ORDER_ALREADY_PAID'||code==='DUPLICATE_REFERENCE'||code==='INSUFFICIENT_BALANCE'?409:500;
    return error(res,status,code??'INTERNAL_ERROR',err instanceof Error?err.message:'Unexpected server error.');
  }
}
