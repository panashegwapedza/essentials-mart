import { useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import type { Product } from './api/commerce';

type Layout = {
  layout:{id:string;storeId:string;version:number};
  aisles:Array<{id:string;name:string;department:string;x:number;z:number;width:number;length:number}>;
  products:Array<{id:string;productId:string;aisleId:string;positionX:number;positionY:number;positionZ:number;facing:number}>;
  nodes:Array<{id:string;label:string;nodeType:string;x:number;y:number;z:number}>;
};

type Props = { onClose:()=>void; products:Product[]; onProductSelect:(product:Product)=>void; };

export default function WalkMode({ onClose, products, onProductSelect }: Props) {
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const [stores,setStores]=useState<Array<{id:string;name:string;code:string}>>([]);
  const [storeId,setStoreId]=useState('');
  const [layout,setLayout]=useState<Layout|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [selected,setSelected]=useState<Product|null>(null);

  useEffect(()=>{let cancelled=false;
    fetch('/api/walk?resource=stores',{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('Walk Mode stores could not be loaded.');return r.json();})
      .then(data=>{if(cancelled)return;const next=data.stores??[];setStores(next);setStoreId(next[0]?.id??'');})
      .catch(e=>{if(!cancelled){setError(e instanceof Error?e.message:'Walk Mode could not be loaded.');setLoading(false);}});
    return()=>{cancelled=true;};
  },[]);

  useEffect(()=>{if(!storeId)return;fetch('/api/walk/sessions',{method:'POST',credentials:'include',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({storeId,mode:'MANUAL'})}).catch(()=>{});},[storeId]);

  useEffect(()=>{if(!storeId)return;let cancelled=false;setLoading(true);setError(null);
    fetch('/api/walk?resource=layout&storeId='+encodeURIComponent(storeId),{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('The store layout could not be loaded.');return r.json();})
      .then(data=>{if(!cancelled)setLayout(data);})
      .catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:'The store layout could not be loaded.');})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[storeId]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas||!layout)return;
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true});
    const scene=new Scene(engine);
    scene.clearColor=new Color3(0.965,0.975,0.955).toColor4(1);

    const camera=new UniversalCamera('walk-camera',new Vector3(0,1.65,-12),scene);
    camera.setTarget(new Vector3(0,1.65,0));
    camera.speed=0.28;
    camera.angularSensibility=3500;
    camera.minZ=0.05;
    camera.attachControl(canvas,true);

    new HemisphericLight('walk-light',new Vector3(0,1,0),scene).intensity=0.95;

    const ground=MeshBuilder.CreateGround('walk-ground',{width:44,height:38},scene);
    const groundMat=new StandardMaterial('walk-ground-mat',scene);
    groundMat.diffuseColor=new Color3(0.91,0.94,0.89);
    ground.material=groundMat;

    const makeMat=(name:string,color:Color3)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=color;return m;};
    const shelfMat=makeMat('shelf-mat',new Color3(0.33,0.46,0.35));
    const aisleMat=makeMat('aisle-mat',new Color3(0.72,0.82,0.70));
    const productMat=makeMat('product-mat',new Color3(0.86,0.68,0.28));
    const signMat=makeMat('sign-mat',new Color3(0.16,0.33,0.21));

    layout.aisles.forEach((aisle)=>{
      const shelf=MeshBuilder.CreateBox('aisle-'+aisle.id,{width:aisle.width,height:1.8,depth:aisle.length},scene);
      shelf.position.set(aisle.x,0.9,aisle.z);
      shelf.material=shelfMat;
      const aisleFloor=MeshBuilder.CreateBox('aisle-floor-'+aisle.id,{width:aisle.width+1.4,height:0.025,depth:aisle.length+0.6},scene);
      aisleFloor.position.set(aisle.x,0.015,aisle.z);
      aisleFloor.material=aisleMat;
      aisleFloor.isPickable=false;
    });

    layout.products.forEach((placement)=>{
      const p=products.find(x=>x.id===placement.productId);
      if(!p)return;
      const mesh=MeshBuilder.CreateBox('product-'+placement.productId,{width:0.52,height:0.72,depth:0.32},scene);
      mesh.position.set(placement.positionX+(placement.facing>0?1.7:-1.7),placement.positionY,placement.positionZ);
      mesh.material=productMat;
      mesh.metadata={productId:p.id};
    });

    layout.nodes.filter(n=>n.nodeType==='ENTRANCE'||n.nodeType==='CHECKOUT'||n.nodeType==='EXIT').forEach(node=>{
      const marker=MeshBuilder.CreateBox('marker-'+node.id,{width:1.8,height:0.08,depth:0.55},scene);
      marker.position.set(node.x,0.08,node.z);
      marker.material=signMat;
      marker.isPickable=false;
    });

    const pointer=scene.onPointerObservable.add(info=>{
      if(info.type!==PointerEventTypes.POINTERPICK)return;
      const productId=info.pickInfo?.pickedMesh?.metadata?.productId as string|undefined;
      if(!productId)return;
      const product=products.find(p=>p.id===productId);
      if(product){setSelected(product);onProductSelect(product);}
    });

    engine.runRenderLoop(()=>scene.render());
    const resize=()=>engine.resize();
    window.addEventListener('resize',resize);
    return()=>{scene.onPointerObservable.remove(pointer);window.removeEventListener('resize',resize);camera.detachControl();scene.dispose();engine.dispose();};
  },[layout,products,onProductSelect]);

  return <div className="walk-mode-shell" role="dialog" aria-modal="true" aria-label="Walk Mode">
    <div className="walk-mode-header">
      <div><p className="eyebrow">WALK MODE</p><h2>Living Digital Supermarket</h2><span>Manual Mode · Babylon.js spatial experience</span></div>
      <div className="walk-mode-controls">
        {stores.length>0&&<label><span className="sr-only">Store</span><select value={storeId} onChange={e=>setStoreId(e.target.value)}>{stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
        <button type="button" className="quiet-button" onClick={onClose}>Exit Walk Mode</button>
      </div>
    </div>
    {error&&<div className="walk-mode-error">{error}</div>}
    {loading?<div className="walk-mode-loading">Preparing the store layout…</div>:<div className="walk-mode-stage">
      <canvas ref={canvasRef} className="walk-mode-canvas"/>
      <div className="walk-mode-help"><strong>Walk</strong><span>W A S D / arrow keys</span><span>Mouse to look</span><span>Click a product to open it</span></div>
      {selected&&<div className="walk-mode-product-card"><div><p className="eyebrow">PRODUCT</p><strong>{selected.name}</strong><span>{[selected.brand,selected.category,selected.sizeLabel].filter(Boolean).join(' · ')}</span></div><button type="button" onClick={()=>onProductSelect(selected)}>View product</button></div>}
      <div className="walk-mode-badge"><span>MANUAL</span><small>AI authority is not active</small></div>
    </div>}
  </div>;
}
