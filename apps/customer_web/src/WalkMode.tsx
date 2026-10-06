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
import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Product } from './api/commerce';
import './WalkMode.css';
import { REFERENCE_LAYOUT } from './store-layout-reference';

type Layout = {
  layout:{id:string;storeId:string;version:number};
  aisles:Array<{id:string;name:string;department:string;x:number;z:number;width:number;length:number}>;
  zones?:Array<{id:string;name:string;type:string;x:number;z:number;width:number;depth:number}>;
  products:Array<{id:string;productId:string;aisleId:string;positionX:number;positionY:number;positionZ:number;facing:number}>;
  nodes:Array<{id:string;label:string;nodeType:string;x:number;y:number;z:number}>;
  edges?:Array<{id:string;fromNodeId:string;toNodeId:string;distance:number;traversalType:string;status:string}>;
};

type Props = { onClose:()=>void; products:Product[]; onProductSelect:(product:Product)=>void; };

export default function WalkMode({ onClose, products, onProductSelect }: Props) {
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const cameraRef=useRef<UniversalCamera|null>(null);
  const highlightRef=useRef<HighlightLayer|null>(null);
  const [stores,setStores]=useState<Array<{id:string;name:string;code:string}>>([]);
  const [storeId,setStoreId]=useState('');
  const [layout,setLayout]=useState<Layout|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [selected,setSelected]=useState<Product|null>(null);
  const [activeAisle,setActiveAisle]=useState<string|null>(null);
  const [findQuery,setFindQuery]=useState('');
  const [findOpen,setFindOpen]=useState(false);

  useEffect(()=>{let cancelled=false;
    fetch('/api/walk?resource=stores',{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('Walk Mode stores could not be loaded.');return r.json();})
      .then(data=>{if(cancelled)return;const next=data.stores??[];if(next.length){setStores(next);setStoreId(next[0].id);}else{setStores([{id:'reference-store',name:'Essentials Mart · Reference Store',code:'REFERENCE'}]);setStoreId('reference-store');setLayout(REFERENCE_LAYOUT as unknown as Layout);setLoading(false);}})
      .catch(e=>{if(!cancelled){setError('Using the reference store layout while the live layout service is unavailable.');setStores([{id:'reference-store',name:'Essentials Mart · Reference Store',code:'REFERENCE'}]);setStoreId('reference-store');setLayout(REFERENCE_LAYOUT as unknown as Layout);setLoading(false);}});
    return()=>{cancelled=true;};
  },[]);

  useEffect(()=>{if(!storeId)return;setLoading(true);setError(null);let cancelled=false;
    fetch('/api/walk?resource=layout&storeId='+encodeURIComponent(storeId),{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('The store layout could not be loaded.');return r.json();})
      .then(data=>{if(!cancelled)setLayout(data);})
      .catch(e=>{if(!cancelled){setError('Live store layout unavailable — showing the configured reference layout.');setLayout(REFERENCE_LAYOUT as unknown as Layout);}})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[storeId]);

  useEffect(()=>{if(!storeId||storeId==='reference-store')return;
    fetch('/api/walk',{method:'POST',credentials:'include',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({storeId,mode:'MANUAL'})}).catch(()=>{});
  },[storeId]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas||!layout)return;
    const currentLayout=layout;
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true});const scene=new Scene(engine);scene.clearColor=new Color3(0.965,0.975,0.955).toColor4(1);
    const entrance=currentLayout.nodes.find(n=>n.nodeType==='ENTRANCE');const camera=new UniversalCamera('walk-camera',new Vector3(entrance?.x??0,1.65,(entrance?.z??-12)-2),scene);cameraRef.current=camera;
    camera.setTarget(new Vector3(entrance?.x??0,1.65,entrance?.z??0));camera.speed=.32;camera.angularSensibility=3500;camera.minZ=.05;camera.attachControl(canvas,true);
    new HemisphericLight('walk-light',new Vector3(0,1,0),scene).intensity=.95;
    const ground=MeshBuilder.CreateGround('walk-ground',{width:44,height:38},scene);
    const structureMat=new StandardMaterial('structure-mat',scene);structureMat.diffuseColor=new Color3(.55,.56,.53);ground.material=structureMat;
    const floorMat=new StandardMaterial('structure-floor-mat',scene);floorMat.diffuseColor=new Color3(.72,.73,.69);
    const wallMat=new StandardMaterial('structure-wall-mat',scene);wallMat.diffuseColor=new Color3(.28,.29,.27);
    const zoneMat=new StandardMaterial('structure-zone-mat',scene);zoneMat.diffuseColor=new Color3(.48,.49,.46);
    const aisleMat=new StandardMaterial('structure-aisle-mat',scene);aisleMat.diffuseColor=new Color3(.63,.64,.60);

    // PART 1 — STRUCTURE ONLY: footprint, perimeter, circulation, aisle blocks and service zones.
    const wallBack=MeshBuilder.CreateBox('structure-back-wall',{width:39,height:2.8,depth:.35},scene);wallBack.position.set(0,1.4,15.7);wallBack.material=wallMat;wallBack.isPickable=false;
    const wallLeft=MeshBuilder.CreateBox('structure-left-wall',{width:.35,height:2.8,depth:32},scene);wallLeft.position.set(-19.7,1.4,0);wallLeft.material=wallMat;wallLeft.isPickable=false;
    const wallRight=MeshBuilder.CreateBox('structure-right-wall',{width:.35,height:2.8,depth:32},scene);wallRight.position.set(19.7,1.4,0);wallRight.material=wallMat;wallRight.isPickable=false;

    const circulation=MeshBuilder.CreateBox('structure-circulation',{width:30,height:.04,depth:28},scene);circulation.position.set(0,.02,0);circulation.material=floorMat;circulation.isPickable=false;
    currentLayout.aisles.filter(a=>a.id!=='specials').forEach(a=>{
      const block=MeshBuilder.CreateBox('structure-aisle-'+a.id,{width:a.width,height:.42,depth:a.length},scene);
      block.position.set(a.x,.21,a.z);block.material=aisleMat;block.isPickable=false;
      const lane=MeshBuilder.CreateBox('structure-lane-'+a.id,{width:a.width+1.45,height:.025,depth:a.length+.5},scene);
      lane.position.set(a.x,.025,a.z);lane.material=floorMat;lane.isPickable=false;
    });

    (currentLayout.zones??[]).forEach(z=>{
      const zone=MeshBuilder.CreateBox('structure-zone-'+z.id,{width:z.width,height:.5,depth:z.depth},scene);
      zone.position.set(z.x,.25,z.z);zone.material=zoneMat;zone.isPickable=false;
    });

    const entrance=MeshBuilder.CreateBox('structure-entrance',{width:4.2,height:.06,depth:1.8},scene);entrance.position.set(0,.06,-15.2);entrance.material=zoneMat;entrance.isPickable=false;
    const exit=MeshBuilder.CreateBox('structure-exit',{width:3.0,height:.06,depth:1.8},scene);exit.position.set(14.2,.06,-15.2);exit.material=zoneMat;exit.isPickable=false;
    const cartZone=MeshBuilder.CreateBox('structure-cart-zone',{width:5.8,height:.5,depth:2.2},scene);cartZone.position.set(-14.2,.25,-11.8);cartZone.material=zoneMat;cartZone.isPickable=false;
    const checkoutZone=MeshBuilder.CreateBox('structure-checkout-zone',{width:11.5,height:.5,depth:3.0},scene);checkoutZone.position.set(10.4,.25,-11.5);checkoutZone.material=zoneMat;checkoutZone.isPickable=false;

    const highlight=new HighlightLayer('walk-highlights',scene);highlightRef.current=highlight;
    const pointer=scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const id=info.pickInfo?.pickedMesh?.metadata?.productId as string|undefined;if(!id)return;const product=products.find(p=>p.id===id);if(product){setSelected(product);const mesh=info.pickInfo?.pickedMesh;if(mesh instanceof Mesh)highlight.addMesh(mesh,Color3.FromHexString('#238a4b'));onProductSelect(product);}});
    engine.runRenderLoop(()=>scene.render());const resize=()=>engine.resize();window.addEventListener('resize',resize);
    return()=>{scene.onPointerObservable.remove(pointer);window.removeEventListener('resize',resize);camera.detachControl();highlight.dispose();scene.dispose();cameraRef.current=null;highlightRef.current=null;engine.dispose();};
  },[layout,products,onProductSelect]);

  function goToAisle(id:string){if(!layout)return;const a=layout.aisles.find(x=>x.id===id);const camera=cameraRef.current;if(!a||!camera)return;camera.position=new Vector3(a.x,1.65,a.z-(a.length/2+3));camera.setTarget(new Vector3(a.x,1.65,a.z));setActiveAisle(id);const placement=layout.products.find(p=>p.aisleId===id);const product=placement&&products.find(p=>p.id===placement.productId);if(product)setSelected(product);}
  function goToNode(type:string){if(!layout)return;const n=layout.nodes.find(x=>x.nodeType===type);const camera=cameraRef.current;if(!n||!camera)return;camera.position=new Vector3(n.x,1.65,n.z-2);camera.setTarget(new Vector3(n.x,1.65,n.z));setActiveAisle(null);}
  function findProduct(productId:string){if(!layout)return;const placement=layout.products.find(p=>p.productId===productId);const product=products.find(p=>p.id===productId);if(!placement||!product)return;const aisle=layout.aisles.find(a=>a.id===placement.aisleId);const camera=cameraRef.current;if(!aisle||!camera)return;camera.position=new Vector3(aisle.x,1.65,placement.positionZ-3);camera.setTarget(new Vector3(placement.positionX,1.65,placement.positionZ));setActiveAisle(aisle.id);setSelected(product);setFindOpen(false);}

  const activeLayout=layout;
  if(!activeLayout)return null;

  return <div className="walk-mode-shell" role="dialog" aria-modal="true" aria-label="Walk Mode">
    <div className="walk-mode-header"><div><p className="eyebrow">WALK MODE</p><h2>Living Digital Supermarket</h2><span>Manual Mode · spatial store experience</span></div><div className="walk-mode-controls">{stores.length>0&&<label><span className="sr-only">Store</span><select value={storeId} onChange={e=>setStoreId(e.target.value)}>{stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}<button type="button" className="quiet-button" onClick={onClose}>Exit Walk Mode</button></div></div>
    {error&&<div className="walk-mode-error">{error}</div>}
    {loading?<div className="walk-mode-loading">Preparing the store layout…</div>:<div className="walk-mode-stage"><canvas ref={canvasRef} className="walk-mode-canvas"/>
      <div className="walk-mode-finder"><button type="button" className="walk-mode-finder-toggle" onClick={()=>setFindOpen(v=>!v)}>Find a product</button>{findOpen&&<div className="walk-mode-finder-panel"><input value={findQuery} onChange={e=>setFindQuery(e.target.value)} placeholder="Search products…" aria-label="Find a product"/><div className="walk-mode-find-results">{products.filter(p=>!findQuery.trim()||p.name.toLowerCase().includes(findQuery.toLowerCase())||p.category.toLowerCase().includes(findQuery.toLowerCase())||p.brand?.toLowerCase().includes(findQuery.toLowerCase())).slice(0,6).map(p=><button key={p.id} type="button" onClick={()=>findProduct(p.id)}><span>{p.name}</span><small>{[p.category,p.sizeLabel].filter(Boolean).join(' · ')}</small></button>)}</div></div>}</div>
      <aside className="walk-mode-nav"><div className="walk-mode-nav-title"><strong>Explore store</strong><span>{activeLayout?.aisles.length??0} aisles</span></div><button type="button" onClick={()=>goToNode('ENTRANCE')}>Entrance</button>{activeLayout?.aisles.map(a=><button key={a.id} type="button" className={activeAisle===a.id?'active':''} onClick={()=>goToAisle(a.id)}><span>{a.name}</span><small>{a.department}</small></button>)}<button type="button" onClick={()=>goToNode('CHECKOUT')}>Checkout</button><button type="button" onClick={()=>goToNode('EXIT')}>Exit</button></aside>
      <div className="walk-mode-help"><strong>Walk</strong><span>W A S D / arrow keys</span><span>Mouse to look</span><span>Click a product to open it</span></div>
      {selected&&<div className="walk-mode-product-card"><div><p className="eyebrow">PRODUCT</p><strong>{selected.name}</strong><span>{[selected.brand,selected.category,selected.sizeLabel].filter(Boolean).join(' · ')}</span></div><button type="button" onClick={()=>onProductSelect(selected)}>View product</button></div>}
      <div className="walk-mode-badge"><span>MANUAL</span><small>AI authority is not active</small></div>
    </div>}
  </div>;
}
