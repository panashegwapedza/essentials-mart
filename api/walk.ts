async function supabase<T>(table:string,params:string,init:RequestInit={}):Promise<T>{
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Supabase Walk Mode configuration is missing.');
  const r=await fetch(url.replace(/\/$/,'')+'/rest/v1/'+table+'?'+params,{...init,headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json','Content-Type':'application/json',...(init.headers??{})}});
  const text=await r.text();
  if(!r.ok)throw new Error('Supabase Walk Mode request failed ('+r.status+'): '+text.slice(0,300));
  return (text?JSON.parse(text):null) as T;
}
function fail(res:any,status:number,code:string,message:string){return res.status(status).json({error:{code,message}});}
export default async function handler(req:any,res:any){
  try{
    if(req.method==='GET'){
      const resource=typeof req.query?.resource==='string'?req.query.resource:'stores';
      if(resource==='stores'){
        const stores=await supabase<any[]>('stores','select=id,code,name,status&status=eq.active&order=name.asc');
        return res.status(200).setHeader('Cache-Control','no-store').json({stores:stores??[]});
      }
      if(resource==='layout'){
        const storeId=typeof req.query?.storeId==='string'?req.query.storeId:'';
        if(!storeId)return fail(res,400,'VALIDATION_ERROR','storeId is required.');
        const layouts=await supabase<any[]>('walk_layouts','select=id,store_id,version,status&store_id=eq.'+encodeURIComponent(storeId)+'&status=eq.active&order=version.desc&limit=1');
        const layout=layouts?.[0];
        if(!layout)return fail(res,404,'NOT_FOUND','No active Walk Mode layout exists for this store.');
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
      }
      if(resource==='actions'){
        const sessionId=typeof req.query?.sessionId==='string'?req.query.sessionId:'';
        const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
        if(!sessionId)return fail(res,400,'VALIDATION_ERROR','sessionId is required.');
        const action=typeof body.action==='string'?body.action:'';
        if(!['MOVE','PAUSE','TAKE_OVER','RESUME','COMPLETE','CANCEL'].includes(action))return fail(res,400,'VALIDATION_ERROR','A valid Walk Mode action is required.');
        const owned=await supabase<any[]>('walk_sessions','select=id,status,mode&id=eq.'+encodeURIComponent(sessionId)+'&limit=1');
        if(!owned?.[0])return fail(res,404,'NOT_FOUND','Walk Mode session could not be found.');
        const patch:any={updated_at:new Date().toISOString()};
        if(action==='PAUSE')patch.status='PAUSED'; if(action==='TAKE_OVER')patch.status='TAKEN_OVER'; if(action==='RESUME')patch.status='ACTIVE'; if(action==='COMPLETE')patch.status='COMPLETED'; if(action==='CANCEL')patch.status='CANCELLED'; if(action==='MOVE'&&typeof body.nodeId==='string')patch.current_node_id=body.nodeId;
        const updated=await supabase<any[]>('walk_sessions','id=eq.'+encodeURIComponent(sessionId),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
        return res.status(200).json({session:updated?.[0]??null});
      }
      if(resource==='mode'){
        const sessionId=typeof req.query?.sessionId==='string'?req.query.sessionId:'';
        const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
        const mode=['MANUAL','AI_ASSISTED','AUTOPILOT'].includes(body.mode)?body.mode:null;
        if(!sessionId||!mode)return fail(res,400,'VALIDATION_ERROR','A valid Walk Mode mode is required.');
        const updated=await supabase<any[]>('walk_sessions','id=eq.'+encodeURIComponent(sessionId),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({mode,status:'ACTIVE',updated_at:new Date().toISOString()})});
        return res.status(200).json({session:updated?.[0]??null});
      }
      return fail(res,404,'NOT_FOUND','Unknown Walk Mode resource.');
    }

    if(req.method==='POST'){
      const {principal}=await import('../apps/customer_web/api/_auth.js');
      const user=await principal(req);
      if(!user)return fail(res,401,'UNAUTHENTICATED','A valid Supabase Auth session is required.');
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
      const storeId=typeof body.storeId==='string'?body.storeId:'';
      const mode=['MANUAL','AI_ASSISTED','AUTOPILOT'].includes(body.mode)?body.mode:'MANUAL';
      if(!storeId)return fail(res,400,'VALIDATION_ERROR','storeId is required.');
      const customers=await supabase<any[]>('customers','select=id&auth_user_id=eq.'+encodeURIComponent(user.authUserId)+'&limit=1');
      const customerId=customers?.[0]?.id;
      if(!customerId)return fail(res,404,'CUSTOMER_NOT_FOUND','Customer identity could not be resolved.');
      const layouts=await supabase<any[]>('walk_layouts','select=id,version&store_id=eq.'+encodeURIComponent(storeId)+'&status=eq.active&order=version.desc&limit=1');
      const layout=layouts?.[0];
      if(!layout)return fail(res,404,'NOT_FOUND','No active Walk Mode layout exists for this store.');
      const entrances=await supabase<any[]>('walk_navigation_nodes','select=id&layout_id=eq.'+encodeURIComponent(layout.id)+'&node_type=eq.ENTRANCE&limit=1');
      const payload={customer_id:customerId,store_id:storeId,layout_id:layout.id,layout_version:Number(layout.version),mode,status:'ACTIVE',current_node_id:entrances?.[0]?.id??null};
      const created=await supabase<any[]>('walk_sessions','', {method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
      return res.status(201).json({session:created?.[0]??null});
    }
    return res.status(405).setHeader('Allow','GET,POST').json({error:{code:'METHOD_NOT_ALLOWED',message:'Walk Mode requires GET or POST.'}});
  }catch(error){
    console.error('walk-mode api error',error);
    return fail(res,500,'WALK_MODE_FAILED',error instanceof Error?error.message:'Walk Mode request failed.');
  }
}
