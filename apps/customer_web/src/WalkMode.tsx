import { useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
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
      const countertop=MeshBuilder.CreateBox('checkout-countertop-'+i,{width:2.78,height:.12,depth:1.45},scene);countertop.position.set(x,.87,-11.25);countertop.material=metalMat;countertop.isPickable=false;shadowGen.addShadowCaster(countertop);
      const conveyor=MeshBuilder.CreateBox('checkout-conveyor-'+i,{width:1.45,height:.12,depth:1.7},scene);conveyor.position.set(x-.15,.98,-11.22);conveyor.material=metalMat;conveyor.isPickable=false;shadowGen.addShadowCaster(conveyor);
      const registerBase=MeshBuilder.CreateBox('checkout-register-base-'+i,{width:.52,height:.08,depth:.44},scene);registerBase.position.set(x+.58,1.10,-11.0);registerBase.material=metalMat;registerBase.isPickable=false;shadowGen.addShadowCaster(registerBase);
      const register=MeshBuilder.CreateBox('checkout-register-'+i,{width:.38,height:.28,depth:.34},scene);register.position.set(x+.58,1.26,-11.0);register.material=accentMat;register.isPickable=false;shadowGen.addShadowCaster(register);
      const registerScreen=MeshBuilder.CreateBox('checkout-register-screen-'+i,{width:.32,height:.22,depth:.04},scene);registerScreen.position.set(x+.58,1.42,-10.83);registerScreen.material=wallMat;registerScreen.isPickable=false;
      const scanner=MeshBuilder.CreateBox('checkout-scanner-'+i,{width:.22,height:.10,depth:.32},scene);scanner.position.set(x+.08,1.08,-11.70);scanner.material=accentMat;scanner.isPickable=false;shadowGen.addShadowCaster(scanner);
      const bagShelf=MeshBuilder.CreateBox('checkout-bag-shelf-'+i,{width:.62,height:.06,depth:.55},scene);bagShelf.position.set(x+.78,.98,-11.72);bagShelf.material=counterMat;bagShelf.isPickable=false;shadowGen.addShadowCaster(bagShelf);
      const divider=MeshBuilder.CreateBox('checkout-divider-'+i,{width:.08,height:1.15,depth:2.15},scene);divider.position.set(x+1.47,.58,-11.0);divider.material=wallMat;divider.isPickable=false;
      const queue=MeshBuilder.CreateBox('checkout-queue-'+i,{width:2.4,height:.025,depth:2.35},scene);queue.position.set(x,.025,-8.9);queue.material=floorMat;queue.isPickable=false;
      const queueLine=MeshBuilder.CreateBox('checkout-queue-line-'+i,{width:2.05,height:.012,depth:.06},scene);queueLine.position.set(x,.045,-9.95);queueLine.material=accentMat;queueLine.isPickable=false;
      const postA=MeshBuilder.CreateBox('checkout-queue-post-a-'+i,{width:.10,height:.85,depth:.10},scene);postA.position.set(x-1.05,.43,-7.75);postA.material=wallMat;postA.isPickable=false;
      const postB=MeshBuilder.CreateBox('checkout-queue-post-b-'+i,{width:.10,height:.85,depth:.10},scene);postB.position.set(x+1.05,.43,-7.75);postB.material=wallMat;postB.isPickable=false;
      const rail=MeshBuilder.CreateBox('checkout-queue-rail-'+i,{width:2.10,height:.06,depth:.06},scene);rail.position.set(x,.78,-7.75);rail.material=metalMat;rail.isPickable=false;shadowGen.addShadowCaster(rail);
    }
    const checkoutSign=MeshBuilder.CreateBox('checkout-sign',{width:7.4,height:.5,depth:.18},scene);checkoutSign.position.set(10.1,2.35,-13.0);checkoutSign.material=accentMat;checkoutSign.isPickable=false;shadowGen.addShadowCaster(checkoutSign);
    const signTrim=MeshBuilder.CreateBox('checkout-sign-trim',{width:7.65,height:.08,depth:.22},scene);signTrim.position.set(10.1,2.10,-13.0);signTrim.material=warmMat;signTrim.isPickable=false;shadowGen.addShadowCaster(signTrim);
    const laneHeader=MeshBuilder.CreateBox('checkout-lane-header',{width:13.6,height:.08,depth:.16},scene);laneHeader.position.set(10.1,2.78,-12.82);laneHeader.material=metalMat;laneHeader.isPickable=false;shadowGen.addShadowCaster(laneHeader);
    const entranceOpening=MeshBuilder.CreateBox('checkout-entrance-opening',{width:5.0,height:.08,depth:1.4},scene);entranceOpening.position.set(10.1,.08,-5.0);entranceOpening.material=counterMat;entranceOpening.isPickable=false;

    // SECTION 02 — grocery aisle structure. Built as the next contiguous store zone.
    const section02Floor=MeshBuilder.CreateGround('section02-floor',{width:24,height:12},scene);section02Floor.position.set(0,0,2);section02Floor.material=floorMat;section02Floor.isPickable=false;
    const section02Back=MeshBuilder.CreateBox('section02-back-wall',{width:24,height:3,depth:.28},scene);section02Back.position.set(0,1.5,7.8);section02Back.material=wallMat;section02Back.isPickable=false;
    const section02Left=MeshBuilder.CreateBox('section02-left-wall',{width:.28,height:3,depth:12},scene);section02Left.position.set(-11.85,1.5,2);section02Left.material=wallMat;section02Left.isPickable=false;
    const section02Right=MeshBuilder.CreateBox('section02-right-wall',{width:.28,height:3,depth:12},scene);section02Right.position.set(11.85,1.5,2);section02Right.material=wallMat;section02Right.isPickable=false;
    const section02Header=MeshBuilder.CreateBox('section02-header',{width:8.4,height:.42,depth:.18},scene);section02Header.position.set(0,2.45,7.58);section02Header.material=accentMat;section02Header.isPickable=false;shadowGen.addShadowCaster(section02Header);
    const section02Trim=MeshBuilder.CreateBox('section02-header-trim',{width:8.65,height:.07,depth:.22},scene);section02Trim.position.set(0,2.21,7.58);section02Trim.material=warmMat;section02Trim.isPickable=false;

    for(let aisle=0;aisle<3;aisle++){
      const x=-7.2+aisle*7.2;
      const rack=MeshBuilder.CreateBox('section02-rack-'+aisle,{width:3.9,height:2.15,depth:.38},scene);rack.position.set(x,1.08,2.0);rack.material=counterMat;rack.isPickable=false;shadowGen.addShadowCaster(rack);
      const rackTop=MeshBuilder.CreateBox('section02-rack-top-'+aisle,{width:4.1,height:.10,depth:2.25},scene);rackTop.position.set(x,2.22,2.0);rackTop.material=metalMat;rackTop.isPickable=false;shadowGen.addShadowCaster(rackTop);
      for(let level=0;level<4;level++){
        const shelf=MeshBuilder.CreateBox('section02-shelf-'+aisle+'-'+level,{width:3.65,height:.08,depth:1.65},scene);shelf.position.set(x,.42+level*.48,2.0);shelf.material=metalMat;shelf.isPickable=false;shadowGen.addShadowCaster(shelf);
      }
      const endcap=MeshBuilder.CreateBox('section02-endcap-'+aisle,{width:.32,height:2.3,depth:1.85},scene);endcap.position.set(x-1.95,1.15,2.0);endcap.material=counterMat;endcap.isPickable=false;shadowGen.addShadowCaster(endcap);
      const aisleSign=MeshBuilder.CreateBox('section02-aisle-sign-'+aisle,{width:1.05,height:.28,depth:.12},scene);aisleSign.position.set(x,2.48,2.0);aisleSign.material=accentMat;aisleSign.isPickable=false;
      const aisleFloor=MeshBuilder.CreateBox('section02-aisle-floor-'+aisle,{width:4.6,height:.018,depth:7.8},scene);aisleFloor.position.set(x,0,3.0);aisleFloor.material=floorMat;aisleFloor.isPickable=false;
    }
    for(let row=0;row<3;row++){
      const z=-.8+row*4.0;
      const overhead=MeshBuilder.CreateBox('section02-overhead-'+row,{width:1.9,height:.08,depth:.34},scene);overhead.position.set(0,2.82,z);overhead.material=warmMat;overhead.isPickable=false;
    }

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
      <aside className="walk-mode-nav"><div className="walk-mode-nav-title"><strong>Store sections</strong><span>Walk Mode</span></div><button type="button" className="active" onClick={()=>{const camera=cameraRef.current;if(camera){camera.position=new Vector3(10.1,1.65,-7.1);camera.setTarget(new Vector3(10.1,1.65,-11.2));}}}>01 · Checkout</button><button type="button" onClick={()=>{const camera=cameraRef.current;if(camera){camera.position=new Vector3(0,1.65,9.2);camera.setTarget(new Vector3(0,1.35,2.0));}}}>02 · Grocery aisles</button></aside>
      <div className="walk-mode-help"><strong>Walk</strong><span>W A S D / arrow keys</span><span>Mouse to look</span><span>Click a product to open it</span></div>
      {selected&&<div className="walk-mode-product-card"><div><p className="eyebrow">PRODUCT</p><strong>{selected.name}</strong><span>{[selected.brand,selected.category,selected.sizeLabel].filter(Boolean).join(' · ')}</span></div><button type="button" onClick={()=>onProductSelect(selected)}>View product</button></div>}
      <div className="walk-mode-badge"><span>MANUAL</span><small>AI authority is not active</small></div>
    </div>}
  </div>;
}
