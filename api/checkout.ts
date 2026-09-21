function json(res:any,status:number,body:unknown){return res.status(status).setHeader('Content-Type','application/json').setHeader('Cache-Control','no-store').json(body);}
function money(amount:number,currency:string){return{amountMinor:Math.round(Number(amount)*100),currency};}
export default async function handler(req:any,res:any){
 if(req.method!=='POST')return json(res,405,{error:{code:'METHOD_NOT_ALLOWED',message:'Checkout requires POST.'}});
 try{
  const {principal}=await import('../apps/customer_web/api/_auth.js'); const user=await principal(req);
  if(!user)return json(res,401,{error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
  const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{}); const method=body?.deliveryMethod;
  if(!['pickup','standard','express'].includes(method))return json(res,400,{error:{code:'INVALID_DELIVERY_METHOD',message:'Select pickup, standard, or express.'}});
  const {url,key}=(()=>{const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Checkout database configuration is missing.');return{url:url.replace(/\\/$/,''),key};})();
  const db=async(path:string,init:RequestInit={})=>{const r=await fetch(url+'/rest/v1/'+path,{...init,headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json','Content-Type':'application/json',...(init.headers??{})}});const text=await r.text();if(!r.ok)throw new Error('Checkout database request failed ('+r.status+'): '+text.slice(0,300));return text?JSON.parse(text):null;};
  const customers=await db('customers?select=id&external_customer_id=eq.'+encodeURIComponent(user.customerId)+'&limit=1'); if(!customers[0])return json(res,409,{error:{code:'CUSTOMER_NOT_FOUND',message:'Authenticated customer identity was not found.'}});
  const baskets=await db('baskets?select=id,currency,status&customer_id=eq.'+encodeURIComponent(customers[0].id)+'&status=eq.active&order=updated_at.desc&limit=1'); const basket=baskets[0]; if(!basket)return json(res,400,{error:{code:'BASKET_EMPTY',message:'Your basket is empty.'}});
  const lines=await db('basket_items?select=product_id,quantity,unit_price,products(id,name,price,currency,is_active)&basket_id=eq.'+encodeURIComponent(basket.id)+'&order=created_at.asc'); if(!lines.length)return json(res,400,{error:{code:'BASKET_EMPTY',message:'Your basket is empty.'}});
  const products=lines.map((x:any)=>x.products).filter(Boolean); if(products.length!==lines.length)return json(res,409,{error:{code:'PRODUCT_UNAVAILABLE',message:'One or more basket products are no longer available.'}});
  const bad=products.find((p:any)=>!p.is_active); if(bad)return json(res,409,{error:{code:'PRODUCT_UNAVAILABLE',message:'One or more basket products are no longer available.'}});
  const subtotal=lines.reduce((s:number,x:any)=>s+Number(x.unit_price)*Number(x.quantity),0); const fees:any={pickup:0,standard:3,express:6}; const fee=fees[method]; const currency=basket.currency||products[0].currency||'USD'; if(products.some((p:any)=>p.currency!==currency))return json(res,409,{error:{code:'CURRENCY_MISMATCH',message:'Basket contains products in different currencies.'}});
  const total=subtotal+fee;
  const orderNo='EM-'+Date.now().toString(36).toUpperCase();
  const orders=await db('orders',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({order_number:orderNo,customer_id:customers[0].id,basket_id:basket.id,status:'pending',payment_status:'pending',currency,subtotal,total,delivery_method:method,delivery_fee:fee})});
  const order=orders[0]; if(!order)throw new Error('Order could not be created.');
  const orderItems=lines.map((x:any)=>({order_id:order.id,product_id:x.product_id,product_name:x.products.name,sku:null,quantity:x.quantity,unit_price:x.unit_price,line_total:Number(x.unit_price)*Number(x.quantity)}));
  await db('order_items',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(orderItems)});
  await db('baskets?id=eq.'+encodeURIComponent(basket.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'converted',updated_at:new Date().toISOString()})});
  return json(res,201,{id:order.id,status:order.status,subtotal:money(subtotal,currency),deliveryMethod:method,deliveryFee:money(fee,currency),total:money(total,currency),currency,lines:lines.map((x:any)=>({productId:x.product_id,quantity:Number(x.quantity),unitPrice:money(x.unit_price,currency)})),createdAt:order.created_at});
 }catch(error:any){console.error('checkout-api error',error);return json(res,500,{error:{code:error?.code??'CHECKOUT_FAILED',message:error instanceof Error?error.message:'Checkout failed.'}});}
}