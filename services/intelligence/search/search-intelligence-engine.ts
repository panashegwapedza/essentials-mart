export type SearchIntent='product_search'|'unknown';
export type SearchInterpretation={
 originalQuery:string;
 normalizedQuery:string;
 correctedQuery:string|null;
 intent:SearchIntent;
 entities:{productTerms:string[];quantity?:number;unit?:string};
 corrections:string[];
 confidence:number;
 engineId:'search-intelligence-engine.v1';
 runtimeId:'ai-society-runtime.v1';
};

const UNIT_ALIASES:Record<string,string>={
 litre:'l',litre:'l',litres:'l',liter:'l',liters:'l',l:'l',
 millilitre:'ml',millilitres:'ml',milliliter:'ml',milliliters:'ml',ml:'ml',
 kilogram:'kg',kilograms:'kg',kg:'kg',gram:'g',grams:'g',g:'g',
 pack:'pack',packs:'pack'
};

const WORD_CORRECTIONS:Record<string,string>={
 milkk:'milk',milc:'milk',mikl:'milk',mlik:'milk',
 tomatos:'tomato',tomatoe:'tomato',tomatto:'tomato',
 bred:'bread',brad:'bread',eggs:'egg',eg:'egg',
 cheeze:'cheese',chesse:'cheese',suger:'sugar',suger:'sugar',
 ricee:'rice',detergentt:'detergent',soapp:'soap',shampo:'shampoo'
};

const SYNONYMS:Record<string,string>={
 tomato:'tomato',ketchup:'ketchup',soda:'soft drink',pop:'soft drink',
 bicarb:'bicarbonate',coke:'coca cola',cokes:'coca cola'
};

const STOP_WORDS=new Set(['a','an','and','can','find','for','get','give','i','in','me','my','of','please','show','some','the','to','want','with','you','buy','looking','need','some']);

function canonicalUnit(value:string){return UNIT_ALIASES[value]??value;}

function splitCompactUnits(value:string){
 return value.replace(/(\\d+(?:[.,]\\d+)?)(litres?|liters?|litre|liter|millilitres?|milliliters?|millilitre|milliliter|ml|kilograms?|kg|grams?|g|packs?|l)\\b/gi,
 (_,n,u)=>`${n.replace(',','.')}${canonicalUnit(String(u).toLowerCase())}`);
}

function clean(value:string){
 let text=value.normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
 text=text.replace(/&/g,' and ');
 text=splitCompactUnits(text);
 text=text.replace(/(\\d+(?:[.,]\\d+)?)\\s*(l|ml|kg|g|pack)\\b/gi,(_,n,u)=>`${n.replace(',','.')}${canonicalUnit(String(u).toLowerCase())}`);
 return text.replace(/[^a-z0-9.]+/g,' ').replace(/\\s+/g,' ').trim();
}

function correctToken(token:string){
 if(WORD_CORRECTIONS[token])return WORD_CORRECTIONS[token];
 if(SYNONYMS[token])return SYNONYMS[token];
 return token;
}

function levenshtein(a:string,b:string){
 const prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  const curr=[i];
  for(let j=1;j<=b.length;j++)curr[j]=Math.min(curr[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
  for(let j=0;j<prev.length;j++)prev[j]=curr[j];
 }
 return prev[b.length];
}

function fuzzyCorrect(token:string){
 if(token.length<3)return token;
 const candidates=Object.keys(WORD_CORRECTIONS);
 let best=token,bestDistance=3;
 for(const candidate of candidates){
  const d=levenshtein(token,candidate);
  const allowed=token.length<=4?1:2;
  if(d<=allowed&&d<bestDistance){bestDistance=d;best=WORD_CORRECTIONS[candidate];}
 }
 return best;
}

export function understandSearchQuery(originalQuery:string):SearchInterpretation{
 const original=originalQuery.trim();
 const cleaned=clean(original);
 const rawTokens=cleaned.split(' ').filter(Boolean);
 let quantity:number|undefined;
 let unit:string|undefined;
 const terms:string[]=[];
 const corrections:string[]=[];
 for(let i=0;i<rawTokens.length;i++){
  const token=rawTokens[i];
  const compact=token.match(/^(\\d+(?:\\.\\d+)?)(l|ml|kg|g|pack)$/);
  if(compact){quantity=Number(compact[1]);unit=compact[2];continue;}
  if(/^\\d+(?:\\.\\d+)?$/.test(token)&&rawTokens[i+1]&&/^(l|ml|kg|g|pack)$/.test(rawTokens[i+1])){
   quantity=Number(token);unit=rawTokens[i+1];i++;continue;
  }
  if(STOP_WORDS.has(token))continue;
  const corrected=correctToken(token);
  const fuzzy=fuzzyCorrect(corrected);
  const finalToken=fuzzyCorrected(corrected,fuzzy);
  if(finalToken!==token)corrections.push(`${token}→${finalToken}`);
  terms.push(finalToken);
 }
 const normalized=[...terms,quantity!==undefined&&unit?`${quantity}${unit}`:null].filter(Boolean).join(' ');
 const originalClean=clean(original);
 const correctedQuery=normalized&&normalized!==originalClean?normalized:null;
 const confidence=corrections.length===0&&normalized===originalClean?0.99:corrections.length<=1?0.95:corrections.length<=2?0.88:0.78;
 return {originalQuery:original,normalizedQuery:normalized,intent:normalized?'product_search':'unknown',correctedQuery,entities:{productTerms:terms,quantity,unit},corrections,confidence,engineId:'search-intelligence-engine.v1',runtimeId:'ai-society-runtime.v1'};
}

function fuzzyCorrected(a:string,b:string){return b||a;}
