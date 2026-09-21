import type { DeliveryMethod } from '../services/commerce-api/src/domain.js';
function json(res:any,status:number,body:unknown){return res.status(status).setHeader('Content-Type','application/json').setHeader('Cache-Control','no-store').json(body);}
function orderDto(o:any){return{id:o.id,status:o.status,subtotal:o.subtotal,deliveryMethod:o.deliveryMethod,deliveryFee:o.deliveryFee,total:o.total,currency:o.total?.currency,lines:o.lines,createdAt:o.createdAt};}
export default async function handler(req:any,res:any){
 if(req.method!=='POST')return json(res,405,{error:{code:'METHOD_NOT_ALLOWED',message:'Checkout requires POST.'}});
 try{
  const {principal}=await import('../apps/customer_web/api/_auth.js');const user=await principal(req);
  if(!user)return json(res,401,{error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
  const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});const deliveryMethod=body?.deliveryMethod as DeliveryMethod;
  if(!['pickup','standard','express'].includes(deliveryMethod))return json(res,400,{error:{code:'INVALID_DELIVERY_METHOD',message:'Select a valid delivery method before checkout.'}});
  const {CommerceApplicationService}=await import('../services/commerce-api/src/application/CommerceApplicationService.js');
  const repos=await import('../services/commerce-api/src/adapters/supabase/SupabaseCommerceRepositories.js');
  const commerce=new CommerceApplicationService(new repos.SupabaseProductRepository(),new repos.SupabaseBasketRepository(),new repos.SupabaseOrderRepository(),new repos.SupabaseCheckoutTransaction());
  const key=typeof req.headers?.['idempotency-key']==='string'?req.headers['idempotency-key']:undefined;
  return json(res,201,orderDto(await commerce.checkout(user,deliveryMethod,key)));
 }catch(error:any){
  const status=error?.code==='NOT_FOUND'?404:error?.code==='PRODUCT_UNAVAILABLE'||error?.code==='INSUFFICIENT_STOCK'?409:error?.code==='BASKET_EMPTY'?400:500;
  console.error('checkout-api error',error);return json(res,status,{error:{code:error?.code??'CHECKOUT_FAILED',message:error instanceof Error?error.message:'Checkout failed.'}});
 }
}