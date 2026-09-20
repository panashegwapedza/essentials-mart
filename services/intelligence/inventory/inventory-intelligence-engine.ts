import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type InventorySignal={
  signalId:string;
  productId:string;
  productName:string;
  storeId:string;
  quantity:number;
  reservedQuantity:number;
  observedAt:string;
};

export type InventoryInsight={
  insightId:string;
  type:'low-stock'|'out-of-stock'|'healthy-stock';
  productId:string;
  productName:string;
  storeId:string;
  availableQuantity:number;
  reservedQuantity:number;
  confidence:number;
  reason:string;
  authority:'recommendation-only';
  sourceSignalId:string;
};

export type InventoryIntelligenceResult={insights:InventoryInsight[];trace:IntelligenceTrace};

export function generateInventoryIntelligence(signals:InventorySignal[]):InventoryIntelligenceResult{
  const insights=signals.filter(s=>s.productId&&s.storeId&&Number.isFinite(s.quantity)&&Number.isFinite(s.reservedQuantity))
    .map(s=>{
      const available=Math.max(0,s.quantity-s.reservedQuantity);
      const type=available<=0?'out-of-stock':available<=5?'low-stock':'healthy-stock';
      const confidence=clampConfidence(Math.min(1,0.7+(s.observedAt?0.3:0)));
      const reason=type==='out-of-stock'?'No unreserved units are currently available.':type==='low-stock'?'Available stock is low after reservations.':'Available stock is currently above the low-stock threshold.';
      return {insightId:'inventory:'+s.storeId+':'+s.productId,type,productId:s.productId,productName:s.productName,storeId:s.storeId,availableQuantity:available,reservedQuantity:Math.max(0,s.reservedQuantity),confidence,reason,authority:'recommendation-only' as const,sourceSignalId:s.signalId};
    }).sort((a,b)=>({ 'out-of-stock':0,'low-stock':1,'healthy-stock':2 }[a.type]-({ 'out-of-stock':0,'low-stock':1,'healthy-stock':2 }[b.type]||2))||a.productName.localeCompare(b.productName)).slice(0,100);
  return {insights,trace:createTrace('inventory-intelligence-agent.v1','inventory-intelligence-engine.v1','recommendation-only',signals.map(s=>s.signalId))};
}
