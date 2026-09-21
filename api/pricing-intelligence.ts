import { principal } from '../apps/customer_web/api/_auth.js';
import { runAISociety } from '../services/intelligence/ai-society-runtime';
import type { PricingProduct } from '../services/intelligence/pricing/pricing-intelligence-engine';

export default async function handler(req:any,res:any){
  if(req.method!=='GET')return res.status(405).setHeader('Allow','GET').json({error:{message:'Method not allowed.'}});
  try{
    if(!await principal(req))return res.status(401).json({error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
    const base=process.env.SUPABASE_URL;
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!base||!key)throw new Error('Supabase server configuration is incomplete.');
    const response=await fetch(`${base}/rest/v1/products?select=id,name,category,product_family,brand,size_label,price,currency,is_active&is_active=eq.true&limit=5000`,{
      headers:{apikey:key,Authorization:`Bearer ${key}`}
    });
    if(!response.ok)throw new Error('Authoritative catalogue could not be loaded.');
    const rows=await response.json() as Array<{id:string;name:string;category:string|null;product_family:string|null;brand:string|null;size_label:string|null;price:number;currency:string;is_active:boolean}>;
    const products:PricingProduct[]=rows.map(p=>({id:p.id,name:p.name,category:p.category,productFamily:p.product_family,brand:p.brand,sizeLabel:p.size_label,price:Number(p.price)||0,currency:p.currency,available:p.is_active}));
    return res.status(200).setHeader('Cache-Control','no-store').json(runAISociety({capability:'pricing-intelligence',products}));
  }catch(e){
    return res.status(500).json({error:{code:'PRICING_INTELLIGENCE_FAILED',message:e instanceof Error?e.message:'Pricing intelligence failed.'}});
  }
}
