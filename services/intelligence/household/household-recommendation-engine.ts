import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';
import type { HouseholdNeed } from './household-needs-engine';

export type HouseholdSignal={productId:string|null;productName:string;purchaseCount:number;averageQuantity:number;averageIntervalDays:number;lastPurchasedAt:string;nextExpectedAt:string;confidence:number;classification:'recurring'|'emerging'};
export type RecommendationCandidate={recommendationId:string;type:'replenishment';productId:string;productName:string;suggestedQuantity:number;reason:string;signal:{source:'household-purchase-history'|'household-needs';purchaseCount:number;averageIntervalDays:number;nextExpectedAt?:string};confidence:number;priority:'high'|'medium'|'low';authority:'recommendation-only'};
export type CatalogueProduct={id:string;name:string;is_active:boolean};
export type RecommendationResult={recommendations:RecommendationCandidate[];trace:IntelligenceTrace};

const priorityRank={high:0,medium:1,low:2};

export function generateHouseholdRecommendations(signals:HouseholdSignal[],catalogue:CatalogueProduct[],needs:HouseholdNeed[]=[],now=new Date()):RecommendationResult{
  const byId=new Map(catalogue.filter(p=>p.is_active).map(p=>[p.id,p]));
  const signalByProduct=new Map(signals.filter(s=>s.productId).map(s=>[s.productId!,s]));
  const timestamp=now.getTime();
  const recommendations:RecommendationCandidate[]=[];
  const representedProducts=new Set<string>();

  for(const need of needs){
    if(!need.productId||representedProducts.has(need.productId))continue;
    const product=byId.get(need.productId);
    if(!product)continue;
    const signal=signalByProduct.get(need.productId);
    const suggestedQuantity=Math.max(1,Math.round(need.quantity??signal?.averageQuantity??1));
    const confidence=clampConfidence(need.confidence??signal?.confidence??(need.source==='shopping-list'?1:0.9));
    recommendations.push({
      recommendationId:'household-need:'+need.needId,
      type:'replenishment',
      productId:product.id,
      productName:product.name,
      suggestedQuantity,
      reason:need.reason,
      signal:{
        source:'household-needs',
        purchaseCount:signal?.purchaseCount??0,
        averageIntervalDays:signal?.averageIntervalDays??0,
        nextExpectedAt:need.expectedAt??signal?.nextExpectedAt,
      },
      confidence,
      priority:need.priority,
      authority:'recommendation-only',
    });
    representedProducts.add(need.productId);
  }

  for(const signal of signals){
    if(!signal.productId||representedProducts.has(signal.productId)||signal.confidence<.65||signal.averageIntervalDays<=0)continue;
    const product=byId.get(signal.productId);
    if(!product)continue;
    const daysUntilExpected=(Date.parse(signal.nextExpectedAt)-timestamp)/86400000;
    const priority:RecommendationCandidate['priority']=daysUntilExpected<=0?'high':daysUntilExpected<=7?'medium':'low';
    recommendations.push({
      recommendationId:'household-replenishment:'+signal.productId+':'+signal.lastPurchasedAt,
      type:'replenishment',
      productId:product.id,
      productName:product.name,
      suggestedQuantity:Math.max(1,Math.round(signal.averageQuantity)),
      reason:'Purchased '+signal.purchaseCount+' times with an average interval of '+signal.averageIntervalDays+' days.',
      signal:{source:'household-purchase-history',purchaseCount:signal.purchaseCount,averageIntervalDays:signal.averageIntervalDays,nextExpectedAt:signal.nextExpectedAt},
      confidence:clampConfidence(signal.confidence),
      priority,
      authority:'recommendation-only',
    });
  }

  recommendations.sort((a,b)=>priorityRank[a.priority]-priorityRank[b.priority]||b.confidence-a.confidence);
  return{
    recommendations:recommendations.slice(0,20),
    trace:createTrace(
      'household-recommendation-agent.v1',
      'household-recommendation-engine.v1',
      'recommendation-only',
      [...new Set([...needs.map(n=>n.needId),...signals.filter(s=>s.productId).map(s=>s.productId!)])],
      now,
    ),
  };
}
