import { principal } from '../apps/customer_web/api/_auth.js';
import { runAISociety } from '../services/intelligence/ai-society-runtime';
import type { HouseholdNeed } from '../services/intelligence/household/household-needs-engine';
import type { HouseholdSignal } from '../services/intelligence/household/household-recommendation-engine';
import type { PredictionSignal } from '../services/intelligence/household/household-prediction-engine';
import type { PersonalisationSignal } from '../services/intelligence/household/household-personalisation-engine';
import type { InventorySignal } from '../services/intelligence/inventory/inventory-intelligence-engine';
import type { SubstitutionProduct, SubstitutionInventory, SubstitutionSignal } from '../services/intelligence/inventory/inventory-substitution-engine';

function json(res: any, status: number, body: unknown) { return res.status(status).setHeader('Content-Type', 'application/json').setHeader('Cache-Control', 'no-store').json(body); }
function config() { const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!url || !key) throw new Error('Supabase intelligence configuration is missing.'); return { url: url.replace(/\/$/, ''), key }; }
async function supabase<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = config();
  const response = await fetch(url + '/rest/v1/' + path, { ...init, headers: { apikey: key, Authorization: 'Bearer ' + key, Accept: 'application/json', 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error('Supabase intelligence request failed (' + response.status + '): ' + (await response.text()).slice(0, 300));
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}
async function customerIdForAuthUser(authUserId: string) {
  const rows = await supabase<Array<{ id: string }>>('customers?auth_user_id=eq.' + encodeURIComponent(authUserId) + '&select=id&limit=1');
  return rows[0]?.id ?? null;
}
async function householdSignals(customerId: string): Promise<HouseholdSignal[]> {
  const memberships = await supabase<Array<{ household_id: string }>>('household_memberships?customer_id=eq.' + encodeURIComponent(customerId) + '&status=eq.active&select=household_id&limit=1');
  const householdId = memberships[0]?.household_id; if (!householdId) return [];
  const members = await supabase<Array<{ customer_id: string }>>('household_memberships?household_id=eq.' + encodeURIComponent(householdId) + '&status=eq.active&select=customer_id');
  const ids = members.map(row => row.customer_id); if (!ids.length) return [];
  const orders = await supabase<Array<{ id: string; created_at: string }>>('orders?customer_id=in.(' + ids.join(',') + ')&select=id,created_at&order=created_at.desc&limit=100');
  const orderIds = orders.map(o => o.id); if (!orderIds.length) return [];
  const items = await supabase<Array<{ product_id: string; product_name: string; quantity: number; created_at: string }>>('order_items?order_id=in.(' + orderIds.join(',') + ')&select=product_id,product_name,quantity,created_at&order=created_at.asc');
  const grouped = new Map<string, Array<{ at: string; quantity: number; productName: string; productId: string }>>();
  for (const item of items) { const key = item.product_id || item.product_name; const values = grouped.get(key) ?? []; values.push({ at: item.created_at, quantity: Number(item.quantity), productName: item.product_name, productId: item.product_id }); grouped.set(key, values); }
  return [...grouped.values()].map(entries => {
    const sorted = entries.slice().sort((a,b) => a.at.localeCompare(b.at)); const intervals:number[]=[];
    for(let i=1;i<sorted.length;i++){const days=(Date.parse(sorted[i].at)-Date.parse(sorted[i-1].at))/86400000;if(days>0&&Number.isFinite(days))intervals.push(days);}
    if(!intervals.length)return null;
    const avg=intervals.reduce((s,v)=>s+v,0)/intervals.length; const recent=intervals.slice(-3); const spread=recent.length>1?Math.max(...recent)-Math.min(...recent):0;
    const consistency=Math.max(0,Math.min(1,1-spread/Math.max(avg,1))); const confidence=Math.max(0,Math.min(1,(Math.min(sorted.length,6)/6)*0.7+consistency*0.3)); const last=sorted[sorted.length-1];
    return {productId:last.productId,productName:last.productName,purchaseCount:sorted.length,averageQuantity:sorted.reduce((s,v)=>s+v.quantity,0)/sorted.length,averageIntervalDays:avg,lastPurchasedAt:last.at,nextExpectedAt:new Date(Date.parse(last.at)+avg*86400000).toISOString(),confidence,classification:confidence>=0.65&&avg<=90?'recurring':'emerging'};
  }).filter((item):item is HouseholdSignal=>item!==null);
}
export default async function intelligenceHandler(req:any,res:any) {
  if(req.method!=='GET')return res.status(405).setHeader('Allow','GET').json({error:{message:'Method not allowed.'}});
  try {
    const user=await principal(req); if(!user)return json(res,401,{error:{code:'UNAUTHENTICATED',message:'A valid Supabase Auth session is required.'}});
    const customerId=await customerIdForAuthUser(user.authUserId); if(!customerId)return json(res,404,{error:{code:'CUSTOMER_NOT_FOUND',message:'Authenticated user has no customer identity.'}});
    const signals=await householdSignals(customerId);
    const memberships=await supabase<Array<{household_id:string}>>('household_memberships?customer_id=eq.'+encodeURIComponent(customerId)+'&status=eq.active&select=household_id&limit=1');
    const householdId=memberships[0]?.household_id;
    let householdNeeds: HouseholdNeed[]=[];
    if(householdId){
      const pantry=await supabase<Array<{id:string;product_id:string|null;product_name:string;status:string}>>('household_pantry_items?household_id=eq.'+encodeURIComponent(householdId)+'&select=id,product_id,product_name,status&limit=500');
      householdNeeds.push(...pantry.filter(item=>item.status==='low'||item.status==='depleted').map(item=>({needId:'pantry:'+item.id,type:'pantry-replenishment' as const,productId:item.product_id,productName:item.product_name,priority:item.status==='depleted'?'high' as const:'medium' as const,reason:item.status==='depleted'?'Pantry item is depleted.':'Pantry item is low.',source:'pantry' as const})));
      const lists=await supabase<Array<{id:string;status:string}>>('household_shopping_lists?household_id=eq.'+encodeURIComponent(householdId)+'&status=eq.active&select=id,status&limit=100');
      const listIds=lists.map(list=>list.id);
      if(listIds.length){
        const items=await supabase<Array<{id:string;product_id:string|null;requested_name:string|null;quantity:number;status:string}>>('household_shopping_list_items?shopping_list_id=in.('+listIds.join(',')+')&status=eq.open&select=id,product_id,requested_name,quantity,status&limit=500');
        householdNeeds.push(...items.map(item=>({needId:'list:'+item.id,type:'shopping-list-item' as const,productId:item.product_id,productName:item.requested_name,priority:'medium' as const,reason:'Open item on an active household shopping list.',source:'shopping-list' as const,quantity:Number(item.quantity??1)})));
      }
    }
    householdNeeds.push(...signals.filter(signal=>signal.productId && Date.parse(signal.nextExpectedAt)<=Date.now()).map(signal=>({needId:'recurring:'+signal.productId,type:'recurring-purchase-due' as const,productId:signal.productId,productName:signal.productName,priority:signal.confidence>=0.8?'high' as const:'medium' as const,reason:'Observed purchase pattern is due based on household history.',source:'purchase-history' as const,confidence:signal.confidence,expectedAt:signal.nextExpectedAt})));
    const catalogue=await supabase<Array<{id:string;name:string;is_active:boolean}>>('products?select=id,name,is_active&is_active=eq.true&limit=1000');
    const predictionSignals:PredictionSignal[]=signals.map((signal,index)=>({signalId:'household-purchase-signal:'+index+':'+(signal.productId??signal.productName),type:signal.classification==='recurring'?'recurring-purchase':'consumption',productId:signal.productId!,productName:signal.productName,purchaseCount:signal.purchaseCount,averageQuantity:signal.averageQuantity,averageIntervalDays:signal.averageIntervalDays,lastObservedAt:signal.lastPurchasedAt,confidence:signal.confidence}));
    const personalisationSignals:PersonalisationSignal[]=signals.filter(s=>s.productId).map((signal,index)=>({signalId:'household-personalisation-signal:'+index+':'+signal.productId,productId:signal.productId!,productName:signal.productName,purchaseCount:signal.purchaseCount,averageQuantity:signal.averageQuantity,averageIntervalDays:signal.averageIntervalDays,confidence:signal.confidence,lastObservedAt:signal.lastPurchasedAt}));
    const inventoryRows=await supabase<Array<{product_id:string;quantity:number;reserved_quantity:number;updated_at:string;store_id:string}>>('inventory?select=product_id,quantity,reserved_quantity,updated_at,store_id&limit=5000');
    const inventorySignals:InventorySignal[]=inventoryRows.map((row,index)=>({signalId:'inventory-signal:'+index+':'+row.store_id+':'+row.product_id,productId:row.product_id,productName:catalogue.find(p=>p.id===row.product_id)?.name??row.product_id,storeId:row.store_id,quantity:Number(row.quantity),reservedQuantity:Number(row.reserved_quantity),observedAt:row.updated_at}));
    const substitutionSignals:SubstitutionSignal[]=inventorySignals.map((signal,index)=>({signalId:signal.signalId,productId:signal.productId,productName:signal.productName,storeId:signal.storeId,availableQuantity:Math.max(0,signal.quantity-signal.reservedQuantity),reason:(Math.max(0,signal.quantity-signal.reservedQuantity)<=0?'out-of-stock':'low-stock') as 'out-of-stock'|'low-stock'}));
    const substitutionProducts:SubstitutionProduct[]=await supabase<Array<{id:string;name:string;category:string|null;product_family:string|null;brand:string|null;variant_label:string|null;size_label:string|null;price:number;currency:string;is_active:boolean}>>('products?select=id,name,category,product_family,brand,variant_label,size_label,price,currency,is_active&is_active=eq.true&limit=1000');
    const substitutionInventory:SubstitutionInventory[]=inventoryRows.map(row=>({productId:row.product_id,storeId:row.store_id,quantity:Number(row.quantity),reservedQuantity:Number(row.reserved_quantity)}));
    const householdIntelligence=runAISociety({
      capability:'household-intelligence',
      input:{
        needs:householdNeeds,
        householdSignals:signals,
        catalogue,
        predictionSignals,
        personalisationSignals,
        inventorySignals,
        substitutionSignals:substitutionSignals.filter(signal=>signal.reason==='out-of-stock'||signal.reason==='low-stock'),
        substitutionProducts,
        substitutionInventory,
      },
    });
    const householdNeedsResult=householdIntelligence.householdNeeds;
    const result=householdIntelligence.recommendations;
    const predictions=householdIntelligence.predictions;
    const personalisation=householdIntelligence.personalisation;
    const inventory=householdIntelligence.inventory;
    const substitutions=householdIntelligence.substitutions;
    const unified=householdIntelligence.intelligenceLayer;
    return json(res,200,{householdNeeds:householdNeedsResult.needs,householdNeedsSummary:householdNeedsResult.summary,householdNeedsTrace:householdNeedsResult.trace,recommendations:result.recommendations,predictions:predictions.predictions,personalisation:personalisation.products,trace:result.trace,predictionTrace:predictions.trace,personalisationTrace:personalisation.trace,inventoryInsights:inventory.insights,inventoryTrace:inventory.trace,substitutions:substitutions.substitutions,substitutionTrace:substitutions.trace,intelligenceLayer:unified.items,intelligenceLayerSummary:unified.summary,intelligenceLayerTrace:unified.trace,generatedAt:new Date().toISOString()});
  } catch(error) { console.error('intelligence-api error',error); return json(res,500,{error:{code:'INTELLIGENCE_INTERNAL_ERROR',message:error instanceof Error?error.message:'Intelligence service unavailable.'}}); }
}
