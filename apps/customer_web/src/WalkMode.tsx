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

type Layout = {
  layout:{id:string;storeId:string;version:number};
  aisles:Array<{id:string;name:string;department:string;x:number;z:number;width:number;length:number}>;
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
    fetch('/api/walk/stores',{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('Walk Mode stores could not be loaded.');return r.json();})
      .then(data=>{if(cancelled)return;const next=data.stores??[];setStores(next);setStoreId(next[0]?.id??'');})
      .catch(e=>{if(!cancelled){setError(e instanceof Error?e.message:'Walk Mode could not be loaded.');setLoading(false);}});
    return()=>{cancelled=true;};
  },[]);

  useEffect(()=>{if(!storeId)return;setLoading(true);setError(null);let cancelled=false;
    fetch('/api/walk/stores/'+encodeURIComponent(storeId)+'/layout',{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('The store layout could not be loaded.');return r.json();})
      .then(data=>{if(!cancelled)setLayout(data);})
      .catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:'The store layout could not be loaded.');})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[storeId]);

  useEffect(()=>{if(!storeId)return;
    fetch('/api/walk/sessions',{method:'POST',credentials:'include',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({storeId,mode:'MANUAL'})}).catch(()=>{});
  },[storeId]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas||!layout)return;\n    const currentLayout=layout;
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true});const scene=new Scene(engine);scene.clearColor=new Color3(0.965,0.975,0.955).toColor4(1);
    const entrance=currentLayout.nodes.find(n=>n.nodeType==='ENTRANCE');const camera=new UniversalCamera('walk-camera',new Vector3(entrance?.x??0,1.65,(entrance?.z??-12)-2),scene);cameraRef.current=camera;
    camera.setTarget(new Vector3(entrance?.x??0,1.65,entrance?.z??0));camera.speed=.32;camera.angularSensibility=3500;camera.minZ=.05;camera.attachControl(canvas,true);
    new HemisphericLight('walk-light',new Vector3(0,1,0),scene).intensity=.95;
    const ground=MeshBuilder.CreateGround('walk-ground',{width:44,height:38},scene);const groundMat=new StandardMaterial('walk-ground-mat',scene);groundMat.diffuseColor=new Color3(.91,.94,.89);ground.material=groundMat;
    const makeMat=(name:string,color:Color3)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=color;return m;};const shelfMat=makeMat('shelf-mat',new Color3(.33,.46,.35));const aisleMat=makeMat('aisle-mat',new Color3(.72,.82,.70));const productMat=makeMat('product-mat',new Color3(.86,.68,.28));const signMat=makeMat('sign-mat',new Color3(.16,.33,.21));
    currentLayout.aisles.forEach(a=>{const shelf=MeshBuilder.CreateBox('aisle-'+a.id,{width:a.width,height:1.8,depth:a.length},scene);shelf.position.set(a.x,.9,a.z);shelf.material=shelfMat;const floor=MeshBuilder.CreateBox('aisle-floor-'+a.id,{width:a.width+1.4,height:.025,depth:a.length+.6},scene);floor.position.set(a.x,.015,a.z);floor.material=aisleMat;floor.isPickable=false;});
    const highlight=new HighlightLayer('walk-highlights',scene);highlightRef.current=highlight;
    currentLayout.products.forEach(p=>{const product=products.find(x=>x.id===p.productId);if(!product)return;const mesh=MeshBuilder.CreateBox('product-'+p.productId,{width:.52,height:.72,depth:.32},scene);mesh.position.set(p.positionX+(p.facing>0?1.7:-1.7),p.positionY,p.positionZ);mesh.material=productMat;mesh.metadata={productId:product.id};});
    currentLayout.nodes.filter(n=>['ENTRANCE','CHECKOUT','EXIT'].includes(n.nodeType)).forEach(n=>{const marker=MeshBuilder.CreateBox('marker-'+n.id,{width:1.8,height:.08,depth:.55},scene);marker.position.set(n.x,.08,n.z);marker.material=signMat;marker.isPickable=false;});
    const pointer=scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const id=info.pickInfo?.pickedMesh?.metadata?.productId as string|undefined;if(!id)return;const product=products.find(p=>p.id===id);if(product){setSelected(product);const mesh=info.pickInfo?.pickedMesh;if(mesh instanceof Mesh)highlight.addMesh(mesh,Color3.FromHexString('#238a4b'));onProductSelect(product);}});
    engine.runRenderLoop(()=>scene.render());const resize=()=>engine.resize();window.addEventListener('resize',resize);
    return()=>{scene.onPointerObservable.remove(pointer);window.removeEventListener('resize',resize);camera.detachControl();highlight.dispose();scene.dispose();cameraRef.current=null;highlightRef.current=null;engine.dispose();};
  },[layout,products,onProductSelect]);

  function goToAisle(id:string){const a=activeLayout?.aisles.find(x=>x.id===id);const camera=cameraRef.current;if(!a||!camera)return;camera.position=new Vector3(a.x,1.65,a.z-(a.length/2+3));camera.setTarget(new Vector3(a.x,1.65,a.z));setActiveAisle(id);const placement=activeLayout.products.find(p=>p.aisleId===id);const product=placement&&products.find(p=>p.id===placement.productId);if(product)setSelected(product);}
  function goToNode(type:string){const n=activeLayout?.nodes.find(x=>x.nodeType===type);const camera=cameraRef.current;if(!n||!camera)return;camera.position=new Vector3(n.x,1.65,n.z-2);camera.setTarget(new Vector3(n.x,1.65,n.z));setActiveAisle(null);}
  function findProduct(productId:string){const placement=activeLayout?.products.find(p=>p.productId===productId);const product=products.find(p=>p.id===productId);if(!placement||!product)return;const aisle=activeLayout?.aisles.find(a=>a.id===placement.aisleId);const camera=cameraRef.current;if(!aisle||!camera)return;camera.position=new Vector3(aisle.x,1.65,placement.positionZ-3);camera.setTarget(new Vector3(placement.positionX,1.65,placement.positionZ));setActiveAisle(aisle.id);setSelected(product);setFindOpen(false);}

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
