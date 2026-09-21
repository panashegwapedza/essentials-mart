import { principal } from '../apps/customer_web/api/_auth.js';
import { runAISociety } from '../services/intelligence/ai-society-runtime';
import type { DeliveryIntelligenceRequest } from '../services/intelligence/commerce/delivery-intelligence-engine';
export default async function handler(req:any,res:any){
 if(req.method!=='POST')return res.status(405).setHeader('Allow','POST').json({error:{message:'Method not allowed.'}});
 try{if(!await principal(req))return res.status(401).json({error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
 const b=(req.body??{}) as Partial<DeliveryIntelligenceRequest>;
 const input:DeliveryIntelligenceRequest={basketSubtotal:Math.max(0,Number(b.basketSubtotal)||0),currency:String(b.currency??'ZiG'),selectedMethod:(b.selectedMethod==='pickup'||b.selectedMethod==='express')?b.selectedMethod:'standard',availableMethods:Array.isArray(b.availableMethods)?b.availableMethods.filter((x):x is 'pickup'|'standard'|'express'=>x==='pickup'||x==='standard'||x==='express'):['pickup','standard','express']};
 return res.status(200).setHeader('Cache-Control','no-store').json(runAISociety({capability:'delivery-intelligence',input}));
 }catch(e){return res.status(500).json({error:{code:'DELIVERY_INTELLIGENCE_FAILED',message:e instanceof Error?e.message:'Delivery intelligence failed.'}});}
}