import type { AuthenticatedPrincipal } from '../services/commerce-api/src/domain.js';

function json(res:any,status:number,body:unknown){
  return res.status(status).setHeader('Content-Type','application/json').setHeader('Cache-Control','no-store').send(JSON.stringify(body));
}
function error(res:any,status:number,code:string,message:string){
  return json(res,status,{error:{code,message}});
}
function productDto(product:any){
  return {id:product.id,name:product.name,category:product.category||product.productFamily||'Essentials',productFamily:product.productFamily,brand:product.brand||'Essentials',variantLabel:product.variantLabel,sizeLabel:product.sizeLabel,imageUrl:product.imageUrl,price:product.price,available:product.available};
}
function basketDto(basket:any){return {id:basket.id,lines:basket.lines};}
function orderDto(order:any){return {id:order.id,status:order.status,total:order.total,subtotal:order.subtotal,deliveryMethod:order.deliveryMethod,deliveryFee:order.deliveryFee,createdAt:order.createdAt,lines:order.lines};}
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

    const commerce=await getCommerce();

    if(path==='/products'&&req.method==='GET')
      return json(res,200,{products:(await commerce.listProducts()).map(productDto)});
    if(path.startsWith('/products/')&&req.method==='GET')
      return json(res,200,productDto(await commerce.getProduct(path.slice('/products/'.length))));

    const user=await resolvePrincipal(req);
    if(!user)return error(res,401,'UNAUTHENTICATED','A valid Supabase Auth session is required.');

    if(path==='/basket'&&req.method==='GET')
      return json(res,200,basketDto(await commerce.getOrCreateBasket(user)));

    if(path==='/basket/items'&&req.method==='POST'){
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      if(!body||typeof body.productId!=='string'||!Number.isInteger(body.quantity)||body.quantity<=0)
        return error(res,400,'VALIDATION_ERROR','productId must be a non-empty string and quantity must be a positive integer.');
      return json(res,201,basketDto(await commerce.addItem(user,body.productId,body.quantity)));
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
      return json(res,201,orderDto(placed));
    }

    if(path==='/orders'&&req.method==='GET')
      return json(res,200,{orders:(await commerce.listOwnedOrders(user)).map(orderDto)});
    if(path.startsWith('/orders/')&&req.method==='GET')
      return json(res,200,orderDto(await commerce.getOwnedOrder(user,path.slice('/orders/'.length))));

    return error(res,404,'NOT_FOUND','No such route.');
  }catch(err:any){
    console.error('commerce-api error',err);
    const code=err?.code;
    const status=code==='NOT_FOUND'?404:code==='BASKET_EMPTY'||code==='INVALID_AMOUNT'||code==='INVALID_CURRENCY'?400:code==='PRODUCT_UNAVAILABLE'||code==='IDEMPOTENCY_KEY_REUSED'||code==='PAYMENT_IDEMPOTENCY_REUSED'||code==='ORDER_ALREADY_PAID'||code==='DUPLICATE_REFERENCE'||code==='INSUFFICIENT_BALANCE'?409:500;
    return error(res,status,code??'INTERNAL_ERROR',err instanceof Error?err.message:'Unexpected server error.');
  }
}
