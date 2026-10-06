async function supabase<T>(table:string,params:string):Promise<T>{
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Supabase Walk Mode configuration is missing.');
  const r=await fetch(url.replace(/\/$/,'')+'/rest/v1/'+table+'?'+params,{headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json'}});
  if(!r.ok)throw new Error('Supabase Walk Mode request failed ('+r.status+').');
  return await r.json() as T;
}
export default async function handler(req:any,res:any){
  if(req.method!=='GET')return res.status(405).setHeader('Allow','GET').json({error:{code:'METHOD_NOT_ALLOWED',message:'Walk Mode stores requires GET.'}});
  try{
    const stores=await supabase<any[]>('stores','select=id,code,name,status&status=eq.active&order=name.asc');
    return res.status(200).setHeader('Cache-Control','no-store').json({stores:stores??[]});
  }catch(error){
    console.error('walk-stores error',error);
    return res.status(500).json({error:{code:'WALK_STORES_FAILED',message:error instanceof Error?error.message:'Walk Mode stores could not be loaded.'}});
  }
}
