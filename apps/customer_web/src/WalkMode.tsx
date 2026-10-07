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
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import type { Product, Basket } from './api/commerce';
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

type Props = { onClose:()=>void; products:Product[]; onProductSelect:(product:Product)=>void; basket?:Basket|null; };
type RegisterScreenItem = { name:string; price:number };
const REGISTER_SCREEN_FALLBACK:RegisterScreenItem[] = [{ name:'Welcome', price:0 }];

export default function WalkMode({ onClose, products, onProductSelect, basket }: Props) {
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
      .catch(()=>{if(!cancelled){setError('Using the reference store layout while the live layout service is unavailable.');setStores([{id:'reference-store',name:'Essentials Mart · Reference Store',code:'REFERENCE'}]);setStoreId('reference-store');setLayout(REFERENCE_LAYOUT as unknown as Layout);setLoading(false);}});
    return()=>{cancelled=true;};
  },[]);

  useEffect(()=>{if(!storeId)return;setLoading(true);setError(null);let cancelled=false;
    fetch('/api/walk?resource=layout&storeId='+encodeURIComponent(storeId),{credentials:'include',headers:{Accept:'application/json'}})
      .then(async r=>{if(!r.ok)throw new Error('The store layout could not be loaded.');return r.json();})
      .then(data=>{if(!cancelled)setLayout(data);})
      .catch(()=>{if(!cancelled){setError('Live store layout unavailable — showing the configured reference layout.');setLayout(REFERENCE_LAYOUT as unknown as Layout);}})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[storeId]);

  useEffect(()=>{if(!storeId||storeId==='reference-store')return;
    fetch('/api/walk',{method:'POST',credentials:'include',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({storeId,mode:'MANUAL'})}).catch(()=>{});
  },[storeId]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas||!layout)return;
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true});const scene=new Scene(engine);scene.clearColor=new Color3(0.965,0.975,0.955).toColor4(1);
    const camera=new UniversalCamera('walk-camera',new Vector3(10.1,1.65,-7.1),scene);cameraRef.current=camera;
    camera.setTarget(new Vector3(10.1,1.65,-11.2));camera.speed=.32;camera.angularSensibility=3500;camera.minZ=.05;camera.attachControl(canvas,true);
    new HemisphericLight('walk-light',new Vector3(0,1,0),scene).intensity=.95;

    const EM_GREEN=new Color3(.137,.541,.294);
    const EM_DARK=new Color3(.090,.125,.098);
    const EM_GOLD=new Color3(.827,.608,.165);
    const EM_WALL_BRIGHT=new Color3(1,.99,.965);
    const EM_WOOD=new Color3(.69,.53,.37);
    const EM_WARM_WHITE=new Color3(1,.95,.86);
    const EM_TILE=new Color3(.90,.86,.76);

    const tileTex=new DynamicTexture('checkout-tile-tex',{width:512,height:512},scene,false);
    const tileCtx=tileTex.getContext() as any;
    tileCtx.fillStyle='#e6ded0';tileCtx.fillRect(0,0,512,512);tileCtx.strokeStyle='rgba(120,105,80,.35)';tileCtx.lineWidth=3;
    for(let gx=0;gx<=512;gx+=128){tileCtx.beginPath();tileCtx.moveTo(gx,0);tileCtx.lineTo(gx,512);tileCtx.stroke();}
    for(let gy=0;gy<=512;gy+=128){tileCtx.beginPath();tileCtx.moveTo(0,gy);tileCtx.lineTo(512,gy);tileCtx.stroke();}
    tileTex.update();tileTex.uScale=6;tileTex.vScale=4;

    const ground=MeshBuilder.CreateGround('checkout-ground',{width:24,height:16},scene);
    const floorMat=new PBRMaterial('checkout-floor-mat',scene);floorMat.albedoTexture=tileTex;floorMat.albedoColor=EM_TILE;floorMat.metallic=0;floorMat.roughness=.5;floorMat.environmentIntensity=.5;ground.material=floorMat;
    const wallMat=new PBRMaterial('checkout-wall-mat',scene);wallMat.albedoColor=EM_WALL_BRIGHT;wallMat.metallic=0;wallMat.roughness=.75;
    const kioskMat=new PBRMaterial('checkout-kiosk-mat',scene);kioskMat.albedoColor=EM_WOOD;kioskMat.metallic=0;kioskMat.roughness=.55;
    const bezelMat=new PBRMaterial('checkout-bezel-mat',scene);bezelMat.albedoColor=EM_DARK;bezelMat.metallic=.2;bezelMat.roughness=.4;
    const accentMat=new PBRMaterial('checkout-accent-mat',scene);accentMat.albedoColor=EM_GREEN;accentMat.metallic=0;accentMat.roughness=.55;
    const goldMat=new PBRMaterial('checkout-gold-mat',scene);goldMat.albedoColor=EM_WOOD;goldMat.metallic=.35;goldMat.roughness=.45;
    const goldGlowMat=new PBRMaterial('checkout-gold-glow-mat',scene);goldGlowMat.unlit=true;goldGlowMat.emissiveColor=EM_WARM_WHITE;
    const glassMat=new PBRMaterial('checkout-glass-mat',scene);glassMat.albedoColor=new Color3(.85,.92,.90);glassMat.alpha=.22;glassMat.metallic=0;glassMat.roughness=.05;
    const counterMat=new PBRMaterial('checkout-counter-mat',scene);counterMat.albedoColor=new Color3(.34,.38,.34);counterMat.metallic=.05;counterMat.roughness=.45;
    const metalMat=new PBRMaterial('checkout-metal-mat',scene);metalMat.albedoColor=new Color3(.75,.77,.74);metalMat.metallic=.9;metalMat.roughness=.28;metalMat.environmentIntensity=1.1;
    const warmMat=new PBRMaterial('checkout-warm-mat',scene);warmMat.albedoColor=EM_GOLD;warmMat.metallic=.15;warmMat.roughness=.4;

    const screenItems:RegisterScreenItem[]=(basket?.items?.length?basket.items.map(line=>({name:(line.product?.name??products.find(p=>p.id===line.productId)?.name??'Item').slice(0,22),price:line.unitPrice*line.quantity})):REGISTER_SCREEN_FALLBACK);
    const screenDisposers:Array<()=>void>=[];
    function createRegisterScreenMaterial(label:string,phase:number){
      const tex=new DynamicTexture('checkout-screen-tex-'+label,{width:640,height:460},scene,false);
      const mat=new PBRMaterial('checkout-register-screen-mat-'+label,scene);mat.unlit=true;mat.emissiveTexture=tex;mat.albedoColor=Color3.Black();
      let frame=0;
      const draw=()=>{
        const ctx=tex.getContext() as any;ctx.fillStyle='#0e1a13';ctx.fillRect(0,0,640,460);ctx.fillStyle='#1c3524';ctx.fillRect(0,0,640,56);
        ctx.fillStyle='#4ee08a';ctx.font='bold 24px -apple-system,sans-serif';ctx.fillText('ESSENTIALS MART',24,37);
        ctx.fillStyle='#d39b2a';ctx.font='bold 18px -apple-system,sans-serif';ctx.textAlign='right';ctx.fillText('SELF-CHECKOUT',616,36);ctx.textAlign='left';
        const hasBasket=!!basket?.items?.length;
        if(!hasBasket){ctx.fillStyle='#4ee08a';ctx.font='bold 48px -apple-system,sans-serif';ctx.fillText('Ready',230,250);ctx.fillStyle='#8fae9b';ctx.font='20px -apple-system,sans-serif';ctx.fillText('Scan an item to begin',200,300);}
        else{const idx=(Math.floor(frame/2)+phase)%screenItems.length;const item=screenItems[idx];ctx.fillStyle='#9fe6bd';ctx.font='22px -apple-system,sans-serif';ctx.fillText('Scanning…',28,104);ctx.fillStyle='#f3fff7';ctx.font='bold 36px -apple-system,sans-serif';ctx.fillText(item.name,28,210);ctx.fillStyle='#4ee08a';ctx.font='bold 56px -apple-system,sans-serif';ctx.fillText('$'+item.price.toFixed(2),28,300);for(let d=0;d<screenItems.length;d++){ctx.fillStyle=d===idx?'#4ee08a':'#2a4a36';ctx.beginPath();ctx.arc(32+d*30,360,9,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#d39b2a';ctx.font='bold 18px -apple-system,sans-serif';ctx.fillText('Place item in bagging area',28,414);}
        tex.update();frame++;
      };draw();const intervalId=window.setInterval(draw,1400);screenDisposers.push(()=>{window.clearInterval(intervalId);tex.dispose();});return mat;
    }
    function createSignBadgeMaterial(text:string){
      const tex=new DynamicTexture('checkout-sign-tex',{width:1024,height:200},scene,false);const ctx=tex.getContext() as any;ctx.clearRect(0,0,1024,200);ctx.fillStyle='#1f6b3f';const r=96;
      ctx.beginPath();ctx.moveTo(r,8);ctx.lineTo(1024-r,8);ctx.quadraticCurveTo(1016,8,1016,8+r);ctx.lineTo(1016,200-8-r);ctx.quadraticCurveTo(1016,192,1024-r,192);ctx.lineTo(r,192);ctx.quadraticCurveTo(8,192,8,192-r);ctx.lineTo(8,8+r);ctx.quadraticCurveTo(8,8,r,8);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffffff';ctx.font='bold 92px -apple-system,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,106);tex.update();tex.hasAlpha=true;
      const mat=new PBRMaterial('checkout-sign-mat',scene);mat.unlit=true;mat.emissiveTexture=tex;mat.albedoColor=Color3.Black();mat.useAlphaFromAlbedoTexture=false;return mat;
    }
    const glow=new GlowLayer('checkout-glow',scene);glow.intensity=.35;
    const hemi=new HemisphericLight('checkout-fill-light',new Vector3(0,1,0),scene);hemi.intensity=.92;hemi.diffuse=new Color3(1,.98,.93);hemi.groundColor=new Color3(.6,.57,.5);
    const key=new DirectionalLight('checkout-key-light',new Vector3(-.35,-1,.55),scene);key.position=new Vector3(-8,12,4);key.intensity=1.05;key.diffuse=new Color3(1,.95,.85);
    const shadowGen=new ShadowGenerator(1024,key);shadowGen.useBlurExponentialShadowMap=true;shadowGen.blurKernel=16;shadowGen.bias=.0015;shadowGen.normalBias=.015;shadowGen.darkness=.3;

    const ceiling=MeshBuilder.CreateBox('checkout-ceiling',{width:15,height:.18,depth:7},scene);ceiling.position.set(10.1,3.0,-10.0);ceiling.material=wallMat;ceiling.isPickable=false;
    const checkoutBack=MeshBuilder.CreateBox('checkout-back-wall',{width:14.5,height:2.8,depth:.35},scene);checkoutBack.position.set(10.1,1.4,-13.25);checkoutBack.material=wallMat;checkoutBack.isPickable=false;
    const checkoutBackTrim=MeshBuilder.CreateBox('checkout-back-trim',{width:14.5,height:.05,depth:.4},scene);checkoutBackTrim.position.set(10.1,2.78,-13.23);checkoutBackTrim.material=accentMat;checkoutBackTrim.isPickable=false;
    const checkoutLeft=MeshBuilder.CreateBox('checkout-left-wall',{width:.35,height:2.8,depth:6.5},scene);checkoutLeft.position.set(3.0,1.4,-10.0);checkoutLeft.material=wallMat;checkoutLeft.isPickable=false;
    const checkoutRight=MeshBuilder.CreateBox('checkout-right-wall',{width:.35,height:2.8,depth:6.5},scene);checkoutRight.position.set(17.2,1.4,-10.0);checkoutRight.material=wallMat;checkoutRight.isPickable=false;
    const checkoutApproach=MeshBuilder.CreateBox('checkout-approach',{width:13.8,height:.025,depth:3.2},scene);checkoutApproach.position.set(10.1,.025,-6.7);checkoutApproach.material=floorMat;checkoutApproach.isPickable=false;

    const sign=MeshBuilder.CreateBox('checkout-sign',{width:4.4,height:.86,depth:.03},scene);sign.position.set(10.1,2.35,-13.05);sign.material=createSignBadgeMaterial('CHECKOUT');sign.isPickable=false;

    function plant(x:number,z:number,idSuffix:string){
      const pot=MeshBuilder.CreateCylinder('checkout-plant-pot-'+idSuffix,{diameterTop:.3,diameterBottom:.22,height:.3,tessellation:16},scene);pot.position.set(x,.15,z);pot.material=kioskMat;pot.isPickable=false;shadowGen.addShadowCaster(pot);
      for(let leaf=0;leaf<6;leaf++){const angle=(leaf/6)*Math.PI*2;const sphere=MeshBuilder.CreateSphere('checkout-plant-leaf-'+idSuffix+'-'+leaf,{diameter:.22+Math.random()*.08,segments:8},scene);sphere.position.set(x+Math.cos(angle)*.14,.55+Math.random()*.2,z+Math.sin(angle)*.14);sphere.material=accentMat;sphere.isPickable=false;}
    }
    plant(3.4,-12.9,'a');plant(16.8,-12.9,'b');

    for(let i=0;i<4;i++){
      const x=5.15+i*3.3;
      const pedestal=MeshBuilder.CreateCylinder('checkout-pedestal-'+i,{diameter:.55,height:1.0,tessellation:24},scene);pedestal.position.set(x,.5,-11.2);pedestal.material=kioskMat;pedestal.isPickable=false;shadowGen.addShadowCaster(pedestal);
      const footRing=MeshBuilder.CreateCylinder('checkout-foot-'+i,{diameter:.68,height:.05,tessellation:24},scene);footRing.position.set(x,.025,-11.2);footRing.material=goldMat;footRing.isPickable=false;
      const bezel=MeshBuilder.CreateBox('checkout-bezel-'+i,{width:.66,height:.50,depth:.05},scene);bezel.position.set(x,1.42,-11.02);bezel.rotation.x=-.32;bezel.material=bezelMat;bezel.isPickable=false;shadowGen.addShadowCaster(bezel);
      const registerScreen=MeshBuilder.CreateBox('checkout-register-screen-'+i,{width:.58,height:.42,depth:.02},scene);registerScreen.position.set(x,1.43,-10.995);registerScreen.rotation.x=-.32;registerScreen.material=createRegisterScreenMaterial(String(i),i);registerScreen.isPickable=false;
      const cardReader=MeshBuilder.CreateBox('checkout-reader-'+i,{width:.16,height:.10,depth:.12},scene);cardReader.position.set(x+.35,.92,-11.1);cardReader.material=goldMat;cardReader.isPickable=false;shadowGen.addShadowCaster(cardReader);
      const bagShelf=MeshBuilder.CreateBox('checkout-bag-shelf-'+i,{width:.62,height:.06,depth:.5},scene);bagShelf.position.set(x,.72,-11.55);bagShelf.material=kioskMat;bagShelf.isPickable=false;shadowGen.addShadowCaster(bagShelf);
      const divider=MeshBuilder.CreateBox('checkout-divider-'+i,{width:.06,height:1.1,depth:2.0},scene);divider.position.set(x+1.47,.55,-11.0);divider.material=glassMat;divider.isPickable=false;
      const queueLine=MeshBuilder.CreateBox('checkout-queue-line-'+i,{width:2.05,height:.012,depth:.06},scene);queueLine.position.set(x,.045,-9.95);queueLine.material=accentMat;queueLine.isPickable=false;
      const postA=MeshBuilder.CreateCylinder('checkout-post-a-'+i,{diameter:.09,height:.85,tessellation:12},scene);postA.position.set(x-1.05,.43,-7.75);postA.material=goldMat;postA.isPickable=false;
      const postB=MeshBuilder.CreateCylinder('checkout-post-b-'+i,{diameter:.09,height:.85,tessellation:12},scene);postB.position.set(x+1.05,.43,-7.75);postB.material=goldMat;postB.isPickable=false;
      const rail=MeshBuilder.CreateBox('checkout-rail-'+i,{width:2.10,height:.05,depth:.05},scene);rail.position.set(x,.78,-7.75);rail.material=goldMat;rail.isPickable=false;shadowGen.addShadowCaster(rail);
      const stem=MeshBuilder.CreateCylinder('checkout-pendant-stem-'+i,{diameter:.03,height:.85,tessellation:8},scene);stem.position.set(x,2.58,-10.6);stem.material=goldMat;stem.isPickable=false;
      const shade=MeshBuilder.CreateCylinder('checkout-pendant-shade-'+i,{diameterTop:.05,diameterBottom:.26,height:.14,tessellation:20},scene);shade.position.set(x,2.14,-10.6);shade.material=goldGlowMat;shade.isPickable=false;
      const pendantLight=new PointLight('checkout-pendant-light-'+i,new Vector3(x,2.08,-10.6),scene);pendantLight.diffuse=EM_WARM_WHITE;pendantLight.intensity=.5;pendantLight.range=5;
    }

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
      for(let level=0;level<4;level++){const shelf=MeshBuilder.CreateBox('section02-shelf-'+aisle+'-'+level,{width:3.65,height:.08,depth:1.65},scene);shelf.position.set(x,.42+level*.48,2.0);shelf.material=metalMat;shelf.isPickable=false;shadowGen.addShadowCaster(shelf);}
      const endcap=MeshBuilder.CreateBox('section02-endcap-'+aisle,{width:.32,height:2.3,depth:1.85},scene);endcap.position.set(x-1.95,1.15,2.0);endcap.material=counterMat;endcap.isPickable=false;shadowGen.addShadowCaster(endcap);
      const aisleSign=MeshBuilder.CreateBox('section02-aisle-sign-'+aisle,{width:1.05,height:.28,depth:.12},scene);aisleSign.position.set(x,2.48,2.0);aisleSign.material=accentMat;aisleSign.isPickable=false;
      const aisleFloor=MeshBuilder.CreateBox('section02-aisle-floor-'+aisle,{width:4.6,height:.018,depth:7.8},scene);aisleFloor.position.set(x,0,3.0);aisleFloor.material=floorMat;aisleFloor.isPickable=false;
    }
    for(let row=0;row<3;row++){const z=-.8+row*4.0;const overhead=MeshBuilder.CreateBox('section02-overhead-'+row,{width:1.9,height:.08,depth:.34},scene);overhead.position.set(0,2.82,z);overhead.material=warmMat;overhead.isPickable=false;}

    const highlight=new HighlightLayer('walk-highlights',scene);highlightRef.current=highlight;
    const pointer=scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const id=info.pickInfo?.pickedMesh?.metadata?.productId as string|undefined;if(!id)return;const product=products.find(p=>p.id===id);if(product){setSelected(product);const mesh=info.pickInfo?.pickedMesh;if(mesh instanceof Mesh)highlight.addMesh(mesh,Color3.FromHexString('#238a4b'));onProductSelect(product);}});
    engine.runRenderLoop(()=>scene.render());const resize=()=>engine.resize();window.addEventListener('resize',resize);
    return()=>{scene.onPointerObservable.remove(pointer);window.removeEventListener('resize',resize);camera.detachControl();highlight.dispose();glow.dispose();screenDisposers.forEach(d=>d());scene.dispose();cameraRef.current=null;highlightRef.current=null;engine.dispose();tileTex.dispose();};
  },[layout,products,onProductSelect,basket]);

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