export type IntelligenceAuthority='interpretation-only'|'recommendation-only'|'prediction-only'|'action-authorized';
export type IntelligenceSignal={signalId:string;type:string;source:string;observedAt:string;confidence:number;value:Record<string,unknown>};
export type IntelligenceTrace={traceId:string;agentId:string;engineId:string;authority:IntelligenceAuthority;generatedAt:string;signals:string[]};
export function clampConfidence(value:number){return Number(Math.max(0,Math.min(1,value)).toFixed(2));}
export function createTrace(agentId:string,engineId:string,authority:IntelligenceAuthority,signals:string[],now=new Date()):IntelligenceTrace{return{traceId:'intel:'+agentId+':'+now.getTime(),agentId,engineId,authority,generatedAt:now.toISOString(),signals};}
