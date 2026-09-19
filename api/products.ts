type ProductRow={id:string;name:string;category:string|null;product_family:string|null;brand:string|null;variant_label:string|null;size_label:string|null;image_url:string|null;price:number;currency:string;is_active:boolean};
async function supabase<T>(table:string,params:string):Promise<T>{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw new Error('Supabase catalogue configuration is missing.');
 const r=await fetch(`${url.replace(/\\/$/,'')}/rest/v1/${table}?${params}`,{headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:'application/json'}});
 if(!r.ok)throw new Error(`Supabase catalogue request failed (${r.status}).`);
 return r.json() as Promise<T>;
}
export default async function productsHandler(req:any,res:any){
 if(req.method!=='GET')return res.status(405).setHeader('Allow','GET').json({error:{message:'Method not allowed.'}});
 try{
  const stores=await supabase<Array<{id:string}>>('stores','select=id&code=eq.MAIN&limit=1');
  const storeId=stores[0]?.id;
  if(!storeId)return res.status(500).setHeader('Cache-Control','no-store').json({error:{message:'MAIN store is not configured.'}});
  const id=typeof req.query?.id==='string'?req.query.id:null;
  const products=await supabase<ProductRow[]>('products',id
   ?`select=id,name,category,product_family,brand,variant_label,size_label,image_url,price,currency,is_active&id=eq.${encodeURIComponent(id)}&limit=1`
   :'select=id,name,category,product_family,brand,variant_label,size_label,image_url,price,currency,is_active&is_active=eq.true&order=name.asc');
  const ids=products.map(p=>p.id);
  const inventory=ids.length?await supabase<Array<{product_id:string;quantity:number;reserved_quantity:number}>>('inventory',`select=product_id,quantity,reserved_quantity&store_id=eq.${encodeURIComponent(storeId)}&product_id=in.(${ids.join(',')})`):[];
  const stock=new Map(inventory.map(x=>[x.product_id,Math.max(0,Number(x.quantity)-Number(x.reserved_quantity))]));
  const map=(p:ProductRow)=>({id:p.id,name:p.name,category:p.category??'Essentials',productFamily:p.product_family??undefined,brand:p.brand??undefined,variantLabel:p.variant_label??undefined,sizeLabel:p.size_label??undefined,imageUrl:p.image_url??undefined,price:{amountMinor:Math.round(Number(p.price)*100),currency:p.currency},available:Boolean(p.is_active)&&(stock.get(p.id)??0)>0});
  if(id){if(!products[0])return res.status(404).setHeader('Cache-Control','no-store').json({error:{message:'Product not found.'}});return res.status(200).json(map(products[0]));}
  return res.status(200).setHeader('Cache-Control','public, s-maxage=0, must-revalidate').json({products:products.map(map)});
 }catch(e){return res.status(500).setHeader('Cache-Control','no-store').json({error:{message:e instanceof Error?e.message:'Catalogue unavailable.'}});}
}