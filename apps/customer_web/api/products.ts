import handler from './[...path].js';
export default function productsHandler(req:any,res:any){const id=typeof req.query?.id==='string'?req.query.id:'';if(id&&!String(req.url??'').includes('/products/'))req.url=`/api/products/${encodeURIComponent(id)}`;return handler(req,res);}
