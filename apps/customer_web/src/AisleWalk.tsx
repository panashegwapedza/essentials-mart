import { useCallback, useEffect, useRef, useState } from 'react';
import './AisleWalk.css';
import { MORPH_DEPTH, MORPH_PAIRS, MORPH_STOPS } from './aisleWalkMorph';
import type { Tps } from './aisleWalkMorph';

/**
 * AISLE-WALK-001 — photographic aisle walk-through (aligned morph).
 * Visual layer only (ADR-014): price, stock and basket truth stay server-side.
 *
 * Neighbouring stop photos are registered with a thin-plate-spline warp built from shared landmarks
 * (green panel corners, fridge top, sign tiles; see scripts/aisle-walk/build_morph.py), so the far wall,
 * fridges, signs and floor coincide while one photo morphs into the next. Every frame uses a fixed,
 * slightly zoomed 3:2 cut-out of the photo, so the view stays stable.
 */

type Props = { onClose: () => void };
type Stop = { z: number; tex: WebGLTexture };
type Caption = [number, string];
type Pose = { z: number; x: number; yaw: number; pitch: number; phase: number; auto: boolean; held: number };
type Packed = { c: Float32Array; w: Float32Array; aff: Float32Array };

const SPEED = 1.35;
const EXTRA = 1.2; // metres walked past the last stop (slow zoom into it)
const END = MORPH_STOPS[MORPH_STOPS.length - 1].z + EXTRA;
const N = 19; // landmarks (7) + border anchors (12); must match build_morph.py
const CAPS: Caption[] = [
  [0.2, 'Aisle 3 · Cereal & Breakfast on your left, Aisle 4 · Beverages on your right'],
  [0.55, 'Walking down the aisle'],
  [0.85, 'Snacks (5) and Personal Care (6) are ahead'],
  [2, 'Fresh Produce ahead'],
];

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
// uA = source photo (iteration start), uB = destination photo; uS = warp progress from the source side,
// uMix = weight of the destination. Coordinates are photo pixels / 1024 (x spans 0..1.5).
const FS = `precision highp float;
uniform sampler2D uA,uB;
uniform vec2 uRes,uLook;
uniform float uZoom,uS,uMix;
uniform vec2 uC[${N}],uW[${N}],uAff[3];
vec2 tps(vec2 p){
 vec2 r=uAff[0]+uAff[1]*p.x+uAff[2]*p.y;
 for(int i=0;i<${N};i++){vec2 d=p-uC[i];float q=dot(d,d);if(q>1e-10)r+=uW[i]*(.5*q*log(q));}
 return r;}
float val(vec2 p){float e=min(min(p.x,1.5-p.x),min(p.y,1.-p.y));return smoothstep(0.,.05,e);}
vec3 tx(sampler2D s,vec2 p){return texture2D(s,clamp(p*vec2(.6666667,1.),vec2(.0005),vec2(.9995))).rgb;}
void main(){
 vec2 sp=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
 float s=max(uRes.x/1536.,uRes.y/1024.)*1.1;
 vec2 pn=(vec2(768.,512.)+(sp-.5*uRes)/s+uLook)/1024.;
 pn=vec2(.75,.52)+(pn-vec2(.75,.52))/uZoom;
 vec2 ps=pn;
 for(int k=0;k<4;k++){ps=pn-uS*(tps(ps)-ps);}
 vec2 pd=tps(ps);
 float ws=(1.-uMix)*val(ps)+1e-4,wd=uMix*val(pd)+1e-4;
 vec3 c=(tx(uA,ps)*ws+tx(uB,pd)*wd)/(ws+wd);
 vec2 n=gl_FragCoord.xy/uRes-.5;c*=1.-.35*dot(n,n);
 gl_FragColor=vec4(c,1.);}`;

const IDENTITY: Packed = { c: new Float32Array(N * 2), w: new Float32Array(N * 2), aff: new Float32Array([0, 0, 1, 0, 0, 1]) };
const pack = (t: Tps): Packed => ({ c: new Float32Array(t.c), w: new Float32Array(t.w), aff: new Float32Array(t.aff) });
const PAIRS = MORPH_PAIRS.map((p) => ({ ab: pack(p.ab), ba: pack(p.ba) }));

const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
const smooth = (x: number): number => x * x * (3 - 2 * x);
const inv = (z: number): number => 1 / (MORPH_DEPTH - z);
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
  const pose = useRef<Pose>({ z: 0, x: 0, yaw: 0, pitch: 0, phase: 0, auto: true, held: 0 });
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
    for (const name of ['uA', 'uB', 'uRes', 'uLook', 'uZoom', 'uS', 'uMix', 'uC', 'uW', 'uAff']) U[name] = gl.getUniformLocation(program, name);
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
      MORPH_STOPS.map(async (source): Promise<Stop | null> => {
        const img = await loadImage(source.src);
        if (!img || disposed) return null;
        const tex = makeTexture(img);
        if (!tex) return null;
        textures.push(tex);
        return { z: source.z, tex };
      }),
    ).then((list) => {
      if (disposed) return;
      if (list.some((s) => s === null)) { setError('The aisle images failed to load.'); return; }
      stops = list as Stop[];
    });

    const bind = (unit: number, tex: WebGLTexture) => {
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    };

    let last = performance.now();
    const frame = (now: number) => {
      const p = pose.current, k = keys.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let mv = ((k.KeyW || k.ArrowUp) ? 1 : 0) - ((k.KeyS || k.ArrowDown) ? 1 : 0) + p.held;
      if (p.auto && p.z < END) mv = 1;
      p.z = clamp(p.z + mv * SPEED * dt, 0, END);
      if (p.auto && p.z >= END) setMode(false);
      p.x = clamp(p.x + ((k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0)) * 0.8 * dt, -0.55, 0.55);
      if (mv || k.KeyA || k.KeyD) p.phase += dt * 7.5;

      const f = p.z / END;
      if (progRef.current) progRef.current.style.width = `${f * 100}%`;
      const cap = CAPS.find((c) => f < c[0]);
      if (capRef.current && cap) capRef.current.textContent = cap[1];
      if (distRef.current) distRef.current.textContent = `${p.z.toFixed(1)} m of ${END.toFixed(1)} m`;

      if (stops.length) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.uRes, w, h);
        gl.uniform2f(U.uLook, clamp(-p.yaw * 350 - p.x * 60, -70, 70), clamp(p.pitch * 500 + (mv ? 3 * Math.sin(p.phase) : 0), -40, 40));

        const last = stops.length - 1;
        if (last < 1) {
          bind(0, stops[0].tex); bind(1, stops[0].tex);
          gl.uniform1f(U.uZoom, 1); gl.uniform1f(U.uS, 0); gl.uniform1f(U.uMix, 0);
          gl.uniform2fv(U.uC, IDENTITY.c); gl.uniform2fv(U.uW, IDENTITY.w); gl.uniform2fv(U.uAff, IDENTITY.aff);
        } else {
          let i = 0, t = 1, zoom = 1;
          if (p.z >= stops[last].z) {
            i = last - 1;
            zoom = (MORPH_DEPTH - stops[last].z) / (MORPH_DEPTH - p.z);
          } else {
            while (i < last - 1 && stops[i + 1].z <= p.z) i++;
            const a = inv(stops[i].z), b = inv(stops[i + 1].z);
            t = clamp((inv(p.z) - a) / (b - a), 0, 1);
          }
          const wB = smooth(clamp((t - 0.3) / 0.4, 0, 1));
          const forward = t <= 0.5; // solve the warp from the nearer photo so it never folds over
          const tps = forward ? PAIRS[i].ab : PAIRS[i].ba;
          bind(0, (forward ? stops[i] : stops[i + 1]).tex);
          bind(1, (forward ? stops[i + 1] : stops[i]).tex);
          gl.uniform1f(U.uZoom, zoom);
          gl.uniform1f(U.uS, forward ? t : 1 - t);
          gl.uniform1f(U.uMix, forward ? wB : 1 - wB);
          gl.uniform2fv(U.uC, tps.c); gl.uniform2fv(U.uW, tps.w); gl.uniform2fv(U.uAff, tps.aff);
        }
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
      pose.current.z = clamp(pose.current.z - e.deltaY * 0.004, 0, END);
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
