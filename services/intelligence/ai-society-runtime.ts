import { understandSearchQuery, type SearchInterpretation } from './search/search-intelligence-engine';

export type IntelligenceRequest={capability:'search-understanding';query:string;vocabulary?:string[]};

export type IntelligenceResponse=SearchInterpretation&{
 trace:{agentId:'catalogue-search-agent.v1';authority:'interpretation-only'};
};

export function runAISociety(request:IntelligenceRequest):IntelligenceResponse{
 if(request.capability!=='search-understanding')throw new Error('Unsupported AI Society capability.');
 const interpretation=understandSearchQuery(request.query,request.vocabulary);
 return {
  ...interpretation,
  trace:{
   agentId:'catalogue-search-agent.v1',
   authority:'interpretation-only'
  }
 };
}
