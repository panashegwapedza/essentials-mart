import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type SubstitutionProduct={id:string;name:string;category:string|null;product_family:string|null;brand:string|null;variant_label:string|null;size_label:string|null;price:number;currency:string;is_active:boolean};
export type SubstitutionInventory={productId:string;storeId:string;quantity:number;reservedQuantity:number};
export type SubstitutionSignal={signalId:string;productId:string;productName:string;storeId:string;availableQuantity:number;reason:'out-of-stock'|'low-stock'};
export type SubstitutionCandidate={substitutionId:string;forProductId:string;forProductName:string;productId:string;productName:string;storeId:string;availableQuantity:number;price:number;currency:string;matchScore:number;reason:string;authority:'recommendation-only';sourceSignalId:string};
export type SubstitutionResult={substitutions:SubstitutionCandidate[];trace:IntelligenceTrace};

function tokens(value:string|null){return new Set((value??'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));}
function overlap(a:string|null,b:string|null){const aa=tokens(a),bb=tokens(b);if(!aa.size||!bb.size)return 0;let hits=0;for(const x of aa)if(bb.has(x))hits++;return hits/Math.max(aa.size,bb.size);}
function sizeTokens(value:string|null){return tokens(value).size?tokens(value):new Set<string>();}

export function generateInventorySubstitutions(signals:SubstitutionSignal[],products:SubstitutionProduct[],inventory:SubstitutionInventory[],now=new Date()):SubstitutionResult{
  const active=products.filter(p=>p.is_active);
  const stock=new Map(inventory.map(i=>[i.productId+':'+i.storeId,Math.max(0,i.quantity-i.reservedQuantity)]));
  const substitutions:SubstitutionCandidate[]=[];
  for(const signal of signals){
    const original=active.find(p=>p.id===signal.productId); if(!original)continue;
    const originalSize=sizeTokens(original.size_label);
    for(const candidate of active){
      if(candidate.id===original.id)continue;
      const available=stock.get(candidate.id+':'+signal.storeId)??0; if(available<=0)continue;
      const family=overlap(original.product_family,candidate.product_family);
      const category=overlap(original.category,candidate.category);
      const variant=overlap(original.variant_label,candidate.variant_label);
      const brand=overlap(original.brand,candidate.brand);
      const size=originalSize.size&&candidate.size_label?overlap(original.size_label,candidate.size_label):0;
      const score=family*.45+category*.25+size*.15+variant*.1+brand*.05;
      if(family===0&&category===0)continue;
      if(score<.45)continue;
      const reason=family>=.5?'Same product family with live availability.':category>=.5?'Same category with a compatible product profile.':'Related product profile with live availability.';
      substitutions.push({substitutionId:'inventory-substitution:'+signal.storeId+':'+signal.productId+':'+candidate.id,forProductId:original.id,forProductName:original.name,productId:candidate.id,productName:candidate.name,storeId:signal.storeId,availableQuantity:available,price:Number(candidate.price),currency:candidate.currency,matchScore:clampConfidence(score),reason,authority:'recommendation-only',sourceSignalId:signal.signalId});
    }
  }
  substitutions.sort((a,b)=>b.matchScore-a.matchScore||a.price-b.price||a.productName.localeCompare(b.productName));
  return {substitutions:substitutions.slice(0,50),trace:createTrace('inventory-substitution-agent.v1','inventory-substitution-engine.v1','recommendation-only',signals.map(s=>s.signalId),now)};
}
