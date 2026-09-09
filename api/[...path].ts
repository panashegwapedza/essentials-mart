import { SupabaseBuckPayRepository } from '../services/commerce-api/src/adapters/supabase/SupabaseBuckPayRepository.js';
import { SupabaseNotificationRepository } from '../services/commerce-api/src/adapters/supabase/SupabaseNotificationRepository.js';
import { SupabaseCommerceRepositories, SupabaseProductRepository, SupabaseBasketRepository, SupabaseOrderRepository, SupabaseCheckoutTransaction } from '../services/commerce-api/src/adapters/supabase/SupabaseCommerceRepositories.js';
import { BuckPayApplicationService } from '../services/commerce-api/src/application/BuckPayApplicationService.js';
import { CommerceApplicationService } from '../services/commerce-api/src/application/CommerceApplicationService.js';
import { NotificationApplicationService } from '../services/commerce-api/src/application/NotificationApplicationService.js';
import type { AuthenticatedPrincipal } from '../services/commerce-api/src/domain.js';
import { devPrincipal, principal as authPrincipal } from '../apps/customer_web/api/_auth.js';
const commerce=new CommerceApplicationService(new SupabaseProductRepository(),new SupabaseBasketRepository(),new SupabaseOrderRepository(),new SupabaseCheckoutTransaction());
const buckPay=new BuckPayApplicationService(new SupabaseBuckPayRepository());
const notifications=new NotificationApplicationService(new SupabaseNotificationRepository());
const supabaseRest=SupabaseCommerceRepositories.supabaseRest;
function json(res:any,status:number,body:unknown){res.status(status).setHeader('Content-Type','application/json').send(JSON.stringify(body));}
function error(res:any,status:number,code:string,message:string){return json(res,status,{error:{code,message}});}
function productDto(product:any){return{id:product.id,name:product.name,price:product.price,available:product.available};}
function basketDto(basket:any){return{id:basket.id,lines:basket.lines};}
function orderDto(order:any,delivery?:any){return{id:order.id,status:order.status,total:order.total,subtotal:order.subtotal,deliveryMethod:order.deliveryMethod,deliveryFee:order.deliveryFee,createdAt:order.createdAt,lines:order.lines,...(delivery?{delivery}: {})};}
async function deliveryDto(orderId:string,customerId:string){const deliveries=await supabaseRest<any[]>(`deliveries?select=id,status,tracking_reference,scheduled_for,delivered_at&order_id=eq.${encodeURIComponent(orderId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`);const delivery=deliveries[0];if(!delivery)return null;const history=await supabaseRest<any[]>(`delivery_status_history?select=from_status,to_status,tracking_reference,changed_at&order_id=eq.${encodeURIComponent(orderId)}&customer_id=eq.${encodeURIComponent(customerId)}&order=changed_at.asc`);return{status:delivery.status,trackingReference:delivery.tracking_reference??undefined,scheduledFor:delivery.scheduled_for??undefined,deliveredAt:delivery.delivered_at??undefined,history:history.map(h=>({fromStatus:h.from_status??null,toStatus:h.to_status,trackingReference:h.tracking_reference??undefined,changedAt:h.changed_at}))};}
function notificationDto(notification:any){return{id:notification.id,type:notification.type,title:notification.title,body:notification.body,status:notification.status,aggregateType:notification.aggregateType,aggregateId:notification.aggregateId,actionType:notification.actionType,actionTarget:notification.actionTarget,createdAt:notification.createdAt};}
function requestPath(req:any){const url=typeof req.url==='string'?req.url:'';const pathname=url.split('?')[0];if(pathname.startsWith('/api/'))return decodeURIComponent(pathname.slice('/api'.length));if(pathname==='/api')return'/';const raw=typeof req.query?.path==='string'?`/${req.query.path}`:Array.isArray(req.query?.path)?`/${req.query.path.join('/')}`:'/';return decodeURIComponent(raw);}
async function resolvePrincipal(req:any):Promise<AuthenticatedPrincipal|null>{const dev=devPrincipal(req);if(dev)return dev;return authPrincipal(req);}
export default async function handler(req:any,res:any){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization, x-dev-customer-id');res.setHeader('Vary','Origin, Authorization');if(req.method==='OPTIONS')return res.status(204).end();const path=requestPath(req);try{
if(path==='/products'&&req.method==='GET')return json(res,200,{products:(await commerce.listProducts()).map(productDto)});
if(path.startsWith('/products/')&&req.method==='GET')return json(res,200,productDto(await commerce.getProduct(path.slice('/products/'.length))));
const user=await resolvePrincipal(req);if(!user)return error(res,401,'UNAUTHENTICATED','A valid Supabase Auth session is required.');
if(path==='/basket'&&req.method==='GET')return json(res,200,basketDto(await commerce.getOrCreateBasket(user)));
if(path==='/basket/items'&&req.method==='POST'){const body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||typeof body.productId!=='string'||!Number.isInteger(body.quantity)||body.quantity<=0)return error(res,400,'VALIDATION_ERROR','productId must be a non-empty string and quantity must be a positive integer.');return json(res,201,basketDto(await commerce.addItem(user,body.productId,body.quantity)));}
if(path.startsWith('/basket/items/')&&req.method==='DELETE')return json(res,200,basketDto(await commerce.removeItem(user,path.slice('/basket/items/'.length))));
if(path==='/checkout'&&req.method==='POST'){const body=typeof req.body==='string'?JSON.parse(req.body):req.body;const method=body?.deliveryMethod;if(!['pickup','standard','express'].includes(method))return error(res,400,'INVALID_DELIVERY_METHOD','Select a valid delivery method before checkout.');const placed=await commerce.checkout(user,method);return json(res,201,orderDto(placed,await deliveryDto(placed.id,user.customerId)));}
if(path==='/orders'&&req.method==='GET')return json(res,200,{orders:(await commerce.listOwnedOrders(user)).map(orderDto)});
if(path.startsWith('/orders/')&&req.method==='GET'){const found=await commerce.getOwnedOrder(user,path.slice('/orders/'.length));return json(res,200,orderDto(found,await deliveryDto(found.id,user.customerId)));}
if(path==='/notifications'&&req.method==='GET')return json(res,200,{notifications:(await notifications.list(user)).map(notificationDto)});
if(path.startsWith('/notifications/')&&path.endsWith('/read')&&req.method==='POST'){const notificationId=path.slice('/notifications/'.length,-'/read'.length);return json(res,200,notificationDto(await notifications.markRead(user,notificationId)));}
if(path==='/buckpay'&&req.method==='GET'){const account=await buckPay.getAccount(user);return json(res,200,{balance:account.balance,status:account.status});}
if(path==='/buckpay/transactions'&&req.method==='GET'){const transactions=await buckPay.getTransactions(user);return json(res,200,{transactions:transactions.map(item=>({id:item.id,type:item.type,amount:item.amount,reference:item.reference,createdAt:item.createdAt}))});}
return error(res,404,'NOT_FOUND','No such route.');
}catch(err:any){const status=err?.code==='NOT_FOUND'?404:err?.code==='PRODUCT_UNAVAILABLE'?409:500;console.error('commerce-api error',err);return error(res,status,err?.code??'INTERNAL_ERROR',err instanceof Error?err.message:'Unexpected server error.');}}
