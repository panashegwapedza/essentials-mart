async function supabase<T>(table:string,params:string):Promise<T>{
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Supabase Walk Mode configuration is missing.');
  const r=await fetch(url.replace(/\/$/,'')+'/rest/v1/'+table+'?'+params,{headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json'}});
  if(!r.ok)throw new Error('Supabase Walk Mode request failed ('+r.status+').');
  return await r.json() as T;
}
export default async function handler(req:any,res:any){
  if(req.method!=='GET')return res.status(405).setHeader('Allow','GET').json({error:{code:'METHOD_NOT_ALLOWED',message:'Walk Mode layout requires GET.'}});
  const storeId=typeof req.query?.storeId==='string'?req.query.storeId:'';
  if(!storeId)return res.status(400).json({error:{code:'VALIDATION_ERROR',message:'storeId is required.'}});
  try{
    const layouts=await supabase<any[]>('walk_layouts','select=id,store_id,version,status&store_id=eq.'+encodeURIComponent(storeId)+'&status=eq.active&order=version.desc&limit=1');
    const layout=layouts?.[0];
    if(!layout)return res.status(404).json({error:{code:'NOT_FOUND',message:'No active Walk Mode layout exists for this store.'}});
    const [aisles,positions,nodes,edges]=await Promise.all([
      supabase<any[]>('walk_aisles','select=id,name,department,x,z,width,length&layout_id=eq.'+encodeURIComponent(layout.id)+'&order=sort_order.asc'),
      supabase<any[]>('walk_product_positions','select=id,product_id,aisle_id,position_x,position_y,position_z,facing&layout_id=eq.'+encodeURIComponent(layout.id)+'&status=eq.active'),
      supabase<any[]>('walk_navigation_nodes','select=id,label,node_type,x,y,z,status&layout_id=eq.'+encodeURIComponent(layout.id)+'&order=label.asc'),
      supabase<any[]>('walk_navigation_edges','select=id,from_node_id,to_node_id,distance,traversal_type,status&layout_id=eq.'+encodeURIComponent(layout.id)+'&status=eq.OPEN')
    ]);
    return res.status(200).setHeader('Cache-Control','no-store').json({
      layout:{id:layout.id,storeId:layout.store_id,version:Number(layout.version)},
      aisles:(aisles??[]).map(x=>({id:x.id,name:x.name,department:x.department,x:Number(x.x),z:Number(x.z),width:Number(x.width),length:Number(x.length)})),
      products:(positions??[]).map(x=>({id:x.id,productId:x.product_id,aisleId:x.aisle_id,positionX:Number(x.position_x),positionY:Number(x.position_y),positionZ:Number(x.position_z),facing:Number(x.facing)})),
      nodes:(nodes??[]).map(x=>({id:x.id,label:x.label,nodeType:x.node_type,x:Number(x.x),y:Number(x.y),z:Number(x.z)})),
      edges:(edges??[]).map(x=>({id:x.id,fromNodeId:x.from_node_id,toNodeId:x.to_node_id,distance:Number(x.distance),traversalType:x.traversal_type,status:x.status}))
    });
  }catch(error){
    console.error('walk-layout error',error);
    return res.status(500).json({error:{code:'WALK_LAYOUT_FAILED',message:error instanceof Error?error.message:'The store layout could not be loaded.'}});
  }
}
