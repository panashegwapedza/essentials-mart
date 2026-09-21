import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type DeliveryIntelligenceRequest={basketSubtotal:number;currency:string;selectedMethod:'pickup'|'standard'|'express';availableMethods:Array<'pickup'|'standard'|'express'>};
export type DeliveryIntelligenceResult={selectedMethod:DeliveryIntelligenceRequest['selectedMethod'];recommendation:'pickup'|'standard'|'express';reason:string;estimatedFee:number;confidence:number;trace:IntelligenceTrace};

export function generateDeliveryIntelligence(input:DeliveryIntelligenceRequest):DeliveryIntelligenceResult{
  const fees={pickup:0,standard:3,express:6};
  const available=input.availableMethods;
  const recommendation=input.basketSubtotal>=100&&available.includes('standard')?'standard':input.basketSubtotal<25&&available.includes('pickup')?'pickup':available.includes(input.selectedMethod)?input.selectedMethod:(available[0]??'standard');
  const reason=recommendation==='pickup'?'Pickup avoids a delivery fee.':recommendation==='standard'&&input.basketSubtotal>=100?'Standard delivery balances a larger basket with the scheduled household delivery option.':'The selected delivery method is currently available.';
  return {selectedMethod:input.selectedMethod,recommendation,reason,estimatedFee:fees[recommendation],confidence:clampConfidence(available.includes(recommendation)?1:0),trace:createTrace('delivery-intelligence-agent.v1','delivery-intelligence-engine.v1','recommendation-only',['delivery:basket','delivery:availability'])};
}