type ProductRow={id:string;sku:string;name:string;description:string|null;category:string|null;product_family:string|null;brand:string|null;variant_label:string|null;size_label:string|null;image_url:string|null;price:number;currency:string;is_active:boolean};

async function supabase<T>(table:string,params:string):Promise<T>{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw new Error('Supabase catalogue configuration is missing.');
 const r=await fetch(`${url.replace(/\\/$/,'')}/rest/v1/${table}?${params}`,{headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:'application/json'}});
 if(!r.ok)throw new Error(`Supabase catalogue request failed (${r.status}).`);
 return r.json() as Promise<T>;
}

const STOP_WORDS=new Set(['a','an','and','can','find','for','get','give','i','in','me','my','of','please','show','some','the','to','want','with','you','buy','looking','need']);
const UNIT_ALIASES:Record<string,string>={litre:'l',litres:'l',liter:'l',liters:'l',l:'l',millilitre:'ml',millilitres:'ml',milliliter:'ml',milliliters:'ml',ml:'ml',kilogram:'kg',kilograms:'kg',kg:'kg',gram:'g',grams:'g',g:'g',pack:'pack',packs:'pack'};

function canonicalUnit(value:string){return UNIT_ALIASES[value]??value;}

function normalizeSearchText(value:string){
 let text=value.normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
 text=text.replace(/&/g,' and ');
 text=text.replace(/(\\d+(?:[.,]\\d+)?)\\s*(litres?|liters?|litre|liter|millilitres?|milliliters?|millilitre|milliliter|ml|kilograms?|kg|grams?|g|packs?|l)\\b/gi,(_,n,u)=>`${n.replace(',','.') } ${canonicalUnit(String(u).toLowerCase())}`);
 text=text.replace(/[^a-z0-9.]+/g,' ').replace(/\\s+/g,' ').trim();
 return text;
}

function tokens(value:string){
 return normalizeSearchText(value).split(' ').filter(token=>token&&!STOP_WORDS.has(token));
}

function levenshtein(a:string,b:string){
 if(a===b)return 0;
 if(!a)return b.length;
 if(!b)return a.length;
 const prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  const curr=[i];
  for(let j=1;j<=b.length;j++)curr[j]=Math.min(curr[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
  for(let j=0;j<prev.length;j++)prev[j]=curr[j];
 }
 return prev[b.length];
}

function fuzzyTokenMatch(queryToken:string,candidateTokens:string[]){
 if(candidateTokens.includes(queryToken))return 1;
 if(queryToken.length<2)return 0;
 let best=0;
 for(const candidate of candidateTokens){
  if(candidate.startsWith(queryToken)||queryToken.startsWith(candidate))best=Math.max(best,.85);
  const distance=levenshtein(queryToken,candidate);
  const allowed=queryToken.length<=4?1:2;
  if(distance<=allowed)best=Math.max(best,Math.max(.55,1-distance/Math.max(queryToken.length,candidate.length)));
 }
 return best;
}

function scoreProduct(queryTokens:string[],queryText:string,row:ProductRow){
 const fields=[
  [row.name,6],[row.product_family,5.5],[row.size_label,5],[row.brand,4.5],[row.variant_label,4],[row.sku,3],[row.category,2],[row.description,1]
 ] as Array<[string|null,number]>;
 const normalizedFields=fields.map(([value,weight])=>({text:normalizeSearchText(value??''),tokens:tokens(value??''),weight}));
 let score=0;
 for(const token of queryTokens){
  let best=0;
  for(const field of normalizedFields)best=Math.max(best,fuzzyTokenMatch(token,field.tokens)*field.weight);
  score+=best;
 }
 const haystack=normalizedFields.map(x=>x.text).join(' ');
 if(queryText&&haystack.includes(queryText))score+=8;
 return score;
}

function mapProduct(p:ProductRow,stock:number){
 return {id:p.id,name:p.name,category:p.category??'Essentials',productFamily:p.product_family??undefined,brand:p.brand??undefined,variantLabel:p.variant_label??undefined,sizeLabel:p.size_label??undefined,imageUrl:p.image_url??undefined,price:{amountMinor:Math.round(Number(p.price)*100),currency:p.currency},available:Boolean(p.is_active)&&stock>0,stockQuantity:stock};
}

export default async function searchHandler(req:any,res:any){
 if(req.method!=='GET')return res.status(405).setHeader('Allow','GET').json({error:{message:'Method not allowed.'}});
 try{
  const raw=typeof req.query?.q==='string'?req.query.q.trim():'';
  if(!raw)return res.status(200).json({query:'',normalizedQuery:'',correctedQuery:null,products:[]});
  const normalized=normalizeSearchText(raw);
  const queryTokens=tokens(raw);
  if(!queryTokens.length)return res.status(200).json({query:raw,normalizedQuery:normalized,correctedQuery:null,products:[]});
  const stores=await supabase<Array<{id:string}>>('stores','select=id&code=eq.MAIN&limit=1');
  const storeId=stores[0]?.id;
  if(!storeId)return res.status(500).setHeader('Cache-Control','no-store').json({error:{message:'MAIN store is not configured.'}});
  const products=await supabase<ProductRow[]>('products','select=id,sku,name,description,category,product_family,brand,variant_label,size_label,image_url,price,currency,is_active&is_active=eq.true&order=name.asc');
  const ids=products.map(p=>p.id);
  const inventory=ids.length?await supabase<Array<{product_id:string;quantity:number;reserved_quantity:number}>>('inventory',`select=product_id,quantity,reserved_quantity&store_id=eq.${encodeURIComponent(storeId)}&product_id=in.(${ids.join(',')})`):[];
  const stock=new Map(inventory.map(x=>[x.product_id,Math.max(0,Number(x.quantity)-Number(x.reserved_quantity))]));
  const ranked=products.map(p=>({p,score:scoreProduct(queryTokens,normalized,p)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.p.name.localeCompare(b.p.name));
  const threshold=Math.max(3,queryTokens.length*1.5);
  const matches=ranked.filter(x=>x.score>=threshold).slice(0,40);
  const top=matches[0];
  const normalizedDiffers=raw.toLowerCase().trim()!==normalized;const correctedQuery=normalizedDiffers?normalized:(top&&normalizeSearchText(top.p.name)!==normalized&&top.score>=6?top.p.name:null);
  return res.status(200).setHeader('Cache-Control','public, s-maxage=0, must-revalidate').json({
   query:raw,
   normalizedQuery:normalized,
   correctedQuery,
   products:matches.map(x=>mapProduct(x.p,stock.get(x.p.id)??0))
  });
 }catch(e){
  return res.status(500).setHeader('Cache-Control','no-store').json({error:{message:e instanceof Error?e.message:'Intelligent search unavailable.'}});
 }
}
