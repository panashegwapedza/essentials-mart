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
    const camera=new UniversalCamera('walk-camera',new Vector3(10.1,1.65,-7.1),scene);cameraRef.current=camera;
    camera.setTarget(new Vector3(10.1,1.65,-11.2));camera.speed=.32;camera.angularSensibility=3500;camera.minZ=.05;camera.attachControl(canvas,true);
    new HemisphericLight('walk-light',new Vector3(0,1,0),scene).intensity=.95;
    // CHECKOUT SECTION ONLY — the first isolated build section from the supplied reference.
    const ground=MeshBuilder.CreateGround('checkout-ground',{width:24,height:16},scene);
    const floorMat=new StandardMaterial('checkout-floor-mat',scene);floorMat.diffuseColor=new Color3(.86,.87,.83);floorMat.specularColor=new Color3(.18,.18,.16);floorMat.roughness=.38;ground.material=floorMat;
    const wallMat=new StandardMaterial('checkout-wall-mat',scene);wallMat.diffuseColor=new Color3(.18,.20,.18);wallMat.specularColor=new Color3(.08,.08,.07);
    const counterMat=new StandardMaterial('checkout-counter-mat',scene);counterMat.diffuseColor=new Color3(.34,.38,.34);counterMat.specularColor=new Color3(.16,.17,.15);counterMat.roughness=.3;
    const metalMat=new StandardMaterial('checkout-metal-mat',scene);metalMat.diffuseColor=new Color3(.72,.74,.70);metalMat.specularColor=new Color3(.65,.67,.63);metalMat.roughness=.18;
    const accentMat=new StandardMaterial('checkout-accent-mat',scene);accentMat.diffuseColor=new Color3(.17,.45,.25);accentMat.specularColor=new Color3(.12,.16,.12);
    const warmMat=new StandardMaterial('checkout-warm-mat',scene);warmMat.diffuseColor=new Color3(.76,.63,.40);warmMat.specularColor=new Color3(.22,.18,.12);warmMat.roughness=.28;

    const hemi=new HemisphericLight('checkout-fill-light',new Vector3(0,1,0),scene);hemi.intensity=.72;hemi.diffuse=new Color3(.96,.98,.94);hemi.groundColor=new Color3(.28,.30,.27);
    const key=new DirectionalLight('checkout-key-light',new Vector3(-.35,-1,.55),scene);key.position=new Vector3(-8,12,4);key.intensity=1.15;key.diffuse=new Color3(1,.93,.80);
    const shadowGen=new ShadowGenerator(1024,key);shadowGen.useBlurExponentialShadowMap=true;shadowGen.blurKernel=24;shadowGen.bias=.001;shadowGen.normalBias=.02;
    const ceiling=MeshBuilder.CreateBox('checkout-ceiling',{width:15,height:.18,depth:7},scene);ceiling.position.set(10.1,3.0,-10.0);ceiling.material=wallMat;ceiling.isPickable=false;
    for(let i=0;i<5;i++){const light=MeshBuilder.CreateBox('checkout-light-'+i,{width:1.8,height:.08,depth:.32},scene);light.position.set(5.3+i*2.4,2.82,-9.1);light.material=warmMat;light.isPickable=false;}


    const checkoutBack=MeshBuilder.CreateBox('checkout-back-wall',{width:14.5,height:2.8,depth:.35},scene);checkoutBack.position.set(10.1,1.4,-13.25);checkoutBack.material=wallMat;checkoutBack.isPickable=false;
    const checkoutLeft=MeshBuilder.CreateBox('checkout-left-wall',{width:.35,height:2.8,depth:6.5},scene);checkoutLeft.position.set(3.0,1.4,-10.0);checkoutLeft.material=wallMat;checkoutLeft.isPickable=false;
    const checkoutRight=MeshBuilder.CreateBox('checkout-right-wall',{width:.35,height:2.8,depth:6.5},scene);checkoutRight.position.set(17.2,1.4,-10.0);checkoutRight.material=wallMat;checkoutRight.isPickable=false;
    const checkoutApproach=MeshBuilder.CreateBox('checkout-approach',{width:13.8,height:.025,depth:3.2},scene);checkoutApproach.position.set(10.1,.025,-6.7);checkoutApproach.material=floorMat;checkoutApproach.isPickable=false;

    for(let i=0;i<4;i++){
      const x=5.15+i*3.3;
      const counter=MeshBuilder.CreateBox('checkout-counter-'+i,{width:2.65,height:.82,depth:1.35},scene);counter.position.set(x,.41,-11.25);counter.material=counterMat;counter.isPickable=false;shadowGen.addShadowCaster(counter);
      const conveyor=MeshBuilder.CreateBox('checkout-conveyor-'+i,{width:1.45,height:.12,depth:1.7},scene);conveyor.position.set(x-.15,.9,-11.22);conveyor.material=metalMat;conveyor.isPickable=false;shadowGen.addShadowCaster(conveyor);
      const register=MeshBuilder.CreateBox('checkout-register-'+i,{width:.45,height:.3,depth:.4},scene);register.position.set(x+.55,1.08,-11.0);register.material=accentMat;register.isPickable=false;shadowGen.addShadowCaster(register);
      const divider=MeshBuilder.CreateBox('checkout-divider-'+i,{width:.08,height:1.15,depth:2.15},scene);divider.position.set(x+1.47,.58,-11.0);divider.material=wallMat;divider.isPickable=false;
      const queue=MeshBuilder.CreateBox('checkout-queue-'+i,{width:2.4,height:.025,depth:2.35},scene);queue.position.set(x,.025,-8.9);queue.material=floorMat;queue.isPickable=false;
      const postA=MeshBuilder.CreateBox('checkout-queue-post-a-'+i,{width:.10,height:.85,depth:.10},scene);postA.position.set(x-1.05,.43,-7.75);postA.material=wallMat;postA.isPickable=false;
      const postB=MeshBuilder.CreateBox('checkout-queue-post-b-'+i,{width:.10,height:.85,depth:.10},scene);postB.position.set(x+1.05,.43,-7.75);postB.material=wallMat;postB.isPickable=false;
    }
    const checkoutSign=MeshBuilder.CreateBox('checkout-sign',{width:7.4,height:.5,depth:.18},scene);checkoutSign.position.set(10.1,2.35,-13.0);checkoutSign.material=accentMat;checkoutSign.isPickable=false;shadowGen.addShadowCaster(checkoutSign);
    const entranceOpening=MeshBuilder.CreateBox('checkout-entrance-opening',{width:5.0,height:.08,depth:1.4},scene);entranceOpening.position.set(10.1,.08,-5.0);entranceOpening.material=counterMat;entranceOpening.isPickable=false;
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
      <aside className="walk-mode-nav"><div className="walk-mode-nav-title"><strong>Checkout section</strong><span>Section 01</span></div><button type="button" className="active" onClick={()=>{const camera=cameraRef.current;if(camera){camera.position=new Vector3(10.1,1.65,-7.1);camera.setTarget(new Vector3(10.1,1.65,-11.2));}}}>Checkout bank</button><button type="button" onClick={()=>{const camera=cameraRef.current;if(camera){camera.position=new Vector3(10.1,1.65,-5.0);camera.setTarget(new Vector3(10.1,1.65,-9.0));}}}>Approach</button></aside>
      <div className="walk-mode-help"><strong>Walk</strong><span>W A S D / arrow keys</span><span>Mouse to look</span><span>Click a product to open it</span></div>
      {selected&&<div className="walk-mode-product-card"><div><p className="eyebrow">PRODUCT</p><strong>{selected.name}</strong><span>{[selected.brand,selected.category,selected.sizeLabel].filter(Boolean).join(' · ')}</span></div><button type="button" onClick={()=>onProductSelect(selected)}>View product</button></div>}
      <div className="walk-mode-badge"><span>MANUAL</span><small>AI authority is not active</small></div>
    </div>}
  </div>;
}
