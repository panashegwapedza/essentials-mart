import { useCallback, useEffect, useRef, useState } from 'react';
import './AisleWalk.css';

/**
 * AISLE-WALK-001 — photographic aisle walk-through.
 * Visual layer only (ADR-014): price, stock and basket truth stay server-side; product anchors
 * will come from walk_product_positions. The aisle is modelled as a box (floor, ceiling, two shelf
 * walls, end wall) textured by projecting each stop photo from its own camera position.
 */

type Props = { onClose: () => void };
type StopSource = { z: number; src: string; vp?: [number, number]; f?: number };
type Stop = { z: number; tex: WebGLTexture; cam: [number, number, number]; size: [number, number] };
type Caption = [number, string];
type Pose = { z: number; x: number; yaw: number; pitch: number; phase: number; auto: boolean; held: number; end: number; zb: number; caps: Caption[] };

// z = camera distance (metres) from the aisle entrance. vp = vanishing point as a fraction of the image;
// defaults (0.52, 0.39) and a 70° horizontal FOV match docs/engineering/AISLE-WALK-001.md.
const STOP_SOURCES: StopSource[] = [
  { z: 0, src: '/walk/aisle/stop-0.jpg' },
  // Keep the original camera framing as the calibration anchor. Per-stop VPs below
  // are intentionally conservative; large vertical VP changes cause visible scene drift.
  { z: 5.0, src: '/walk/aisle/stop-7.jpg', vp: [0.52, 0.39] },
  { z: 6.5, src: '/walk/aisle/stop-8.jpg', vp: [0.52, 0.39] },
  { z: 7.4, src: '/walk/aisle/stop-9.jpg', vp: [0.52, 0.39] },
  // stop-10 introduces a different open-side layout; exclude it until a matching corridor view exists.
  // Missing coverage at z~2.5-3.5 and z~10+ should be filled with matching source photos.
];
const FULL_FROM_Z = 15, FULL_END = 17, FULL_ZB = 20, SPEED = 1.35;
const CAPS_PARTIAL: Caption[] = [
  [0.12, 'Aisle 3 · Cereal & Breakfast on your left, Aisle 4 · Beverages on your right'],
  [0.55, 'Walking down the aisle'],
  [0.88, 'Snacks (5) and Personal Care (6) are ahead'],
  [2, 'End of aisle · Fresh Produce ahead'],
];
const CAPS_FULL: Caption[] = [
  [0.18, 'Aisle 3 · Cereal & Breakfast on your left, Aisle 4 · Beverages on your right'],
  [0.53, 'Walking down the aisle'],
  [0.76, 'Snacks (5) and Personal Care (6) are overhead ahead'],
  [2, 'Fresh Produce · fruit and vegetable racks'],
];

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
// Surfaces the photo shows too coarsely (you walked closer) fall back to a repeated/mirrored near-field slice of it.
const FS = `precision highp float;
uniform sampler2D uA,uB;uniform vec2 uRes,uZ;uniform vec3 uCa,uCb;uniform vec2 uSa,uSb;uniform vec4 uPose;uniform float uPitch,uZB;
const float VPU=800.,VPV=400.,F=1097.,EYE=1.6,AL=1.10,AR=1.22,CEIL=3.0,ZNEAR=-4.0;
const vec2 IMG=vec2(1536.,1024.);
vec2 pj(vec3 q,vec3 c,vec2 im){float z=max(q.z,.05);return vec2(c.x+c.z*q.x/z,c.y-c.z*q.y/z)/im;}
vec3 tx(sampler2D s,vec3 q,vec3 c,vec2 im){return texture2D(s,clamp(pj(q,c,im),vec2(.0005),vec2(.9995))).rgb;}
float ok(vec3 q,vec3 c,vec2 im){vec2 u=pj(q,c,im);float e=min(min(u.x,1.-u.x),min(u.y,1.-u.y));return smoothstep(0.,.04,e)*step(.3,q.z);}
float tp(float lo,float hi,float o,float d){if(d>1e-5)return(hi-o)/d;if(d<-1e-5)return(lo-o)/d;return 1e9;}
float fm(float z,float z0,float p){float s=mod(z-z0,2.*p);return z0+(s<p?s:2.*p-s);}
vec3 wallTile(sampler2D s,vec3 q,vec3 c,vec2 im){float t=mod(q.z-2.1,2.0);vec3 a=tx(s,vec3(q.xy,2.1+t),c,im);vec3 b=tx(s,vec3(q.xy,4.1+t),c,im);return mix(b,a,smoothstep(0.,.5,t));}
// What the stop whose camera sits at depth zs shows at surface point q (kind 0 wall,1 floor,2 ceiling,3 end wall).
vec3 viewFrom(sampler2D s,float zs,vec3 q,vec3 o,float kind,vec3 c,vec2 im){
 q.z-=zs;o.z-=zs;
 vec3 base=tx(s,q,c,im);
 float M=pow(max(q.z,.1)/max(q.z-o.z,.25),2.);
 float k=max(smoothstep(1.6,4.,M),1.-ok(q,c,im));
 if(kind>2.5)k=1.-ok(q,c,im);
 vec3 det=kind<.5?wallTile(s,q,c,im):(kind<1.5?tx(s,vec3(q.x,q.y,fm(q.z,3.,2.4)),c,im):(kind<2.5?tx(s,vec3(q.x,q.y,fm(q.z,9.,3.5)),c,im):wallTile(s,q,c,im)));
 return mix(base,det,k);}
void main(){
 vec2 sp=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);float s=uRes.y/IMG.y;
 vec2 ph=vec2(768.,512.)+(sp-.5*uRes)/s;
 vec3 r=vec3(ph.x-VPU,VPV-ph.y+F*uPitch,F);
 float cy=cos(uPose.w),sy=sin(uPose.w);r=normalize(vec3(r.x*cy+r.z*sy,r.y,-r.x*sy+r.z*cy));
 vec3 o=uPose.xyz;
 float ax=tp(-AL,AR,o.x,r.x),ay=tp(-EYE,CEIL,o.y,r.y),az=tp(ZNEAR,uZB,o.z,r.z);
 float t=min(min(ax,ay),az);vec3 q=o+r*t;
 float kind=t==ay?(r.y<0.?1.:2.):(t==ax?0.:(r.z>0.?3.:0.));
 float d=uZ.y-uZ.x;float w=d>.01?smoothstep(uZ.x+.25*d,uZ.x+.75*d,o.z):0.;
 vec3 c=mix(viewFrom(uA,uZ.x,q,o,kind,uCa,uSa),viewFrom(uB,uZ.y,q,o,kind,uCb,uSb),w);
 vec2 n=(gl_FragCoord.xy/uRes-.5);c*=1.-.55*dot(n,n);
 gl_FragColor=vec4(c,1.);}`;

const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

export default function AisleWalk({ onClose }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const capRef = useRef<HTMLElement | null>(null);
  const distRef = useRef<HTMLSpanElement | null>(null);
  const progRef = useRef<HTMLElement | null>(null);
  const keys = useRef<Record<string, boolean>>({});
  const pose = useRef<Pose>({ z: 0, x: 0, yaw: 0, pitch: 0, phase: 0, auto: true, held: 0, end: 9, zb: 12.8, caps: CAPS_PARTIAL });
  const [auto, setAuto] = useState(true);
  const [hint, setHint] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setMode = useCallback((value: boolean) => {
    pose.current.auto = value;
    setAuto(value);
  }, []);

  const restart = () => {
    const p = pose.current;
    p.z = 0; p.x = 0; p.yaw = 0; p.pitch = 0;
    setMode(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) { setError("WebGL isn't available on this device."); return; }

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(shader)); return null; }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
    const program = gl.createProgram();
    if (!vs || !fs || !program) { setError('The aisle renderer failed to start.'); return; }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

    const U: Record<string, WebGLUniformLocation | null> = {};
    for (const name of ['uA', 'uB', 'uRes', 'uZ', 'uPose', 'uPitch', 'uZB', 'uCa', 'uCb', 'uSa', 'uSb']) U[name] = gl.getUniformLocation(program, name);
    gl.uniform1i(U.uA, 0);
    gl.uniform1i(U.uB, 1);

    let stops: Stop[] = [];
    let disposed = false;
    let raf = 0;
    const textures: WebGLTexture[] = [];

    const makeTexture = (img: HTMLImageElement): WebGLTexture | null => {
      const tex = gl.createTexture();
      if (!tex) return null;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };

    void Promise.all(
      STOP_SOURCES.map(async (source): Promise<Stop | null> => {
        const img = await loadImage(source.src);
        if (!img || disposed) return null;
        const tex = makeTexture(img);
        if (!tex) return null;
        textures.push(tex);
        const w = img.naturalWidth, h = img.naturalHeight, vp = source.vp ?? [0.52, 0.39];
        return { z: source.z, tex, cam: [vp[0] * w, vp[1] * h, source.f ?? (w / 2) / Math.tan((35 * Math.PI) / 180)], size: [w, h] };
      }),
    ).then((list) => {
      if (disposed) return;
      const loaded = list.filter((s): s is Stop => s !== null).sort((a, b) => a.z - b.z);
      if (!loaded.length) { setError('The aisle images failed to load.'); return; }
      const p = pose.current;
      if (loaded.length > 1) {
        const lastZ = loaded[loaded.length - 1].z;
        const full = lastZ >= FULL_FROM_Z;
        p.end = full ? FULL_END : lastZ + 2;
        p.zb = full ? FULL_ZB : lastZ + 5.5;
        p.caps = full ? CAPS_FULL : CAPS_PARTIAL;
      }
      stops = loaded;
    });

    let last = performance.now();
    const frame = (now: number) => {
      const p = pose.current, k = keys.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let mv = ((k.KeyW || k.ArrowUp) ? 1 : 0) - ((k.KeyS || k.ArrowDown) ? 1 : 0) + p.held;
      if (p.auto && p.z < p.end) mv = 1;
      p.z = clamp(p.z + mv * SPEED * dt, 0, p.end);
      if (p.auto && p.z >= p.end) setMode(false);
      p.x = clamp(p.x + ((k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0)) * 0.8 * dt, -0.55, 0.55);
      if (mv || k.KeyA || k.KeyD) p.phase += dt * 7.5;

      const f = p.z / p.end;
      if (progRef.current) progRef.current.style.width = `${f * 100}%`;
      const cap = p.caps.find((c) => f < c[0]);
      if (capRef.current && cap) capRef.current.textContent = cap[1];
      if (distRef.current) distRef.current.textContent = `${p.z.toFixed(1)} m of ${p.end.toFixed(1)} m`;

      if (stops.length) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.uRes, w, h);
        gl.uniform4f(U.uPose, p.x, mv ? 0.028 * Math.sin(p.phase) : 0, p.z, p.yaw);
        gl.uniform1f(U.uPitch, p.pitch);
        gl.uniform1f(U.uZB, p.zb);
        let ia = 0;
        while (ia < stops.length - 2 && stops[ia + 1].z <= p.z) ia++;
        const A = stops[ia], B = stops[Math.min(ia + 1, stops.length - 1)];
        gl.uniform2f(U.uZ, A.z, B.z);
        gl.uniform3fv(U.uCa, A.cam);
        gl.uniform3fv(U.uCb, B.cam);
        gl.uniform2fv(U.uSa, A.size);
        gl.uniform2fv(U.uSb, B.size);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, A.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, B.tex);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') { onClose(); return; }
      keys.current[e.code] = true;
      if (/Arrow|Space/.test(e.code)) e.preventDefault();
      setMode(false);
      setHint(false);
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    let drag: { x: number; y: number; yaw: number; pitch: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      drag = { x: e.clientX, y: e.clientY, yaw: pose.current.yaw, pitch: pose.current.pitch };
      root.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      pose.current.yaw = clamp(drag.yaw - (e.clientX - drag.x) * 0.0035, -0.6, 0.6);
      pose.current.pitch = clamp(drag.pitch + (e.clientY - drag.y) * 0.0006, -0.14, 0.14);
    };
    const onUp = () => { drag = null; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setMode(false);
      pose.current.z = clamp(pose.current.z - e.deltaY * 0.004, 0, pose.current.end);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('wheel', onWheel);
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [onClose, setMode]);

  const hold = (direction: number) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      pose.current.held = direction;
      setMode(false);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerUp: () => { pose.current.held = 0; },
    onPointerCancel: () => { pose.current.held = 0; },
  });

  return (
    <div className="aisle-walk" ref={rootRef} role="dialog" aria-label="Aisle walk">
      <canvas className="aisle-walk-canvas" ref={canvasRef} />
      <div className="aisle-walk-top">
        <div className="aisle-walk-title"><strong>Walk Mode</strong><span>Aisle 3 · Cereal &amp; Breakfast / Aisle 4 · Beverages</span></div>
        <div className="aisle-walk-modes">
          <button type="button" className={auto ? '' : 'on'} onClick={() => setMode(false)}>Manual</button>
          <button type="button" className={auto ? 'on' : ''} onClick={() => setMode(true)}>Autopilot</button>
        </div>
        <button type="button" className="aisle-walk-exit" onClick={onClose}>Exit Walk Mode</button>
      </div>
      {hint && <div className="aisle-walk-hint">W / ↑ walk · S / ↓ back · A D sidestep · drag to look · scroll to walk</div>}
      <div className="aisle-walk-bar">
        <div className="aisle-walk-status">
          <strong ref={capRef} />
          <span ref={distRef} />
          <div className="aisle-walk-progress"><i ref={progRef} /></div>
        </div>
        <button type="button" className="alt" aria-label="Walk backwards" {...hold(-1)}>▼</button>
        <button type="button" {...hold(1)}>Hold to walk ▲</button>
        <button type="button" className="alt" onClick={restart}>Restart</button>
      </div>
      {error && <div className="aisle-walk-error">{error}</div>}
    </div>
  );
}
