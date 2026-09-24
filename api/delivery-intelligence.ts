function json(res:any,status:number,body:unknown){
  return res.status(status).setHeader('Content-Type','application/json').setHeader('Cache-Control','no-store').json(body);
}

export default async function handler(req:any,res:any){
  if(req.method!=='POST'){
    return json(res,405,{error:{code:'METHOD_NOT_ALLOWED',message:'Delivery intelligence requires POST.'}});
  }
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body):(req.body??{});
    const subtotal=Math.max(0,Number(b.basketSubtotal)||0);
    const available=Array.isArray(b.availableMethods)
      ? b.availableMethods.filter((x:any)=>x==='pickup'||x==='standard'||x==='express')
      : ['pickup','standard','express'];
    const selected=b.selectedMethod==='pickup'||b.selectedMethod==='express'||b.selectedMethod==='standard'
      ? b.selectedMethod : 'standard';
    const recommendation=subtotal>=100&&available.includes('standard')
      ? 'standard'
      : subtotal<25&&available.includes('pickup')
        ? 'pickup'
        : available.includes(selected) ? selected : (available[0]??'standard');
    const fees:any={pickup:0,standard:3,express:6};
    const reason=recommendation==='pickup'
      ? 'Pickup avoids a delivery fee.'
      : recommendation==='standard'&&subtotal>=100
        ? 'Standard delivery balances a larger basket with the scheduled household delivery option.'
        : 'The selected delivery method is currently available.';
    return json(res,200,{
      selectedMethod:selected,
      recommendation,
      reason,
      estimatedFee:fees[recommendation]??0,
      confidence:available.includes(recommendation)?1:0
    });
  }catch(e:any){
    return json(res,500,{error:{code:'DELIVERY_INTELLIGENCE_FAILED',message:e instanceof Error?e.message:'Delivery intelligence failed.'}});
  }
}
