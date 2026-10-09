import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { MotionService } from '../../../core/services/motion.service';

type ThreeModule = typeof import('three');
type Renderer = import('three').WebGLRenderer;
type Scene = import('three').Scene;
type Camera = import('three').PerspectiveCamera;
type ShaderMaterial = import('three').ShaderMaterial;
type BufferGeometry = import('three').BufferGeometry;
type Color = import('three').Color;

/** Detail + density per device class. */
const DESKTOP_ORB_DETAIL = 24;
const MOBILE_ORB_DETAIL = 12;
const DESKTOP_DUST = 1400;
const MOBILE_DUST = 520;

/**
 * Ashima / Stefan Gustavson simplex noise (3D). Self-contained so the scene
 * needs no extra dependency — the detail lives in the shade, not the bundle.
 */
const SIMPLEX_3D = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const ORB_VERTEX = `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uSpeed;
uniform float uPulse;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vNoise;
${SIMPLEX_3D}

vec3 displace(vec3 p, vec3 n) {
  float n1 = snoise(p * uFreq + vec3(0.0, 0.0, uTime * uSpeed));
  float n2 = snoise(p * (uFreq * 2.15) + vec3(uTime * uSpeed * 1.35, 0.0, 0.0)) * 0.4;
  float amount = (n1 + n2) * (uAmp + uPulse * 0.4);
  return p + n * amount;
}

void main() {
  vec3 n0 = normalize(normal);
  vec3 shifted = displace(position, n0);

  vec3 up = abs(n0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(n0, up));
  vec3 bitangent = normalize(cross(n0, tangent));
  float eps = 0.02;
  vec3 pA = displace(position + tangent * eps, n0);
  vec3 pB = displace(position + bitangent * eps, n0);
  vec3 recomputed = normalize(cross(pA - shifted, pB - shifted));
  if (dot(recomputed, n0) < 0.0) {
    recomputed = -recomputed;
  }

  vNoise = length(shifted) - length(position);
  vNormal = normalize(normalMatrix * recomputed);
  vWorldPos = (modelMatrix * vec4(shifted, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(shifted, 1.0);
}
`;

const ORB_FRAGMENT = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vNoise;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

  vec3 L = normalize(vec3(0.55, 0.9, 0.75));
  float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);

  float band = smoothstep(-0.35, 0.55, vNoise * 3.2 + sin(uTime * 0.15) * 0.1);
  vec3 color = mix(uColorA, uColorB, band);
  color = mix(color * 0.18, color, clamp(fres + diff * 0.4, 0.0, 1.0));
  color += uColorA * pow(fres, 1.4) * 1.05;

  // Additive: the dark body dissolves into pure rim light.
  float alpha = clamp(0.42 + fres * 0.75, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;

const HALO_FRAGMENT = `
uniform vec3 uColorA;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.2);
  gl_FragColor = vec4(uColorA, fres * 0.5);
}
`;

const DUST_VERTEX = `
attribute float aScale;
uniform float uSize;
uniform float uPixelRatio;
varying float vFade;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFade = clamp(1.0 - (-mv.z) * 0.06, 0.15, 1.0);
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(0.1, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const DUST_FRAGMENT = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, alpha * uOpacity * vFade);
}
`;

/**
 * The personal-space centrepiece: a slowly breathing, noise-displaced orb
 * wrapped in an orbital dust field. Pointer moves parallax the camera; a click
 * sends a heartbeat pulse through the surface. Decorative only.
 *
 * three.js is imported dynamically, so it stays in its own lazy chunk. The
 * scene is skipped entirely under reduced motion / weak hardware, where the
 * CSS fallback gradient stands in.
 */
@Component({
  selector: 'app-personal-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="personal-scene__canvas" aria-hidden="true"></canvas>`,
  styleUrls: ['./personal-scene.component.scss']
})
export class PersonalSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);

  private THREE: ThreeModule | null = null;
  private renderer?: Renderer;
  private scene?: Scene;
  private camera?: Camera;

  private orb?: import('three').Mesh;
  private halo?: import('three').Mesh;
  private orbMaterial?: ShaderMaterial;
  private haloMaterial?: ShaderMaterial;
  private dustMaterial?: ShaderMaterial;
  private orbGeometry?: BufferGeometry;
  private haloGeometry?: BufferGeometry;
  private dustGeometry?: BufferGeometry;

  private dustGroup?: import('three').Group;

  private time = 0;
  private lastTime = 0;
  private pulse = 0;

  private running = false;
  private destroyed = false;
  private inView = true;
  private tabVisible = true;

  private pointerX = 0;
  private pointerY = 0;
  private camX = 0;
  private camY = 0;

  private colorA: Color | null = null;
  private colorB: Color | null = null;
  private additive = true;

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private modeObserver?: MutationObserver;

  private readonly onPointerMove = (event: PointerEvent): void => {
    this.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
  };

  private readonly onPointerDown = (): void => {
    if (this.motion.reducedMotion()) {
      return;
    }
    this.pulse = 1;
  };

  private readonly onVisibility = (): void => {
    this.tabVisible = !document.hidden;
    this.syncLoop();
  };

  constructor() {
    // Never render behind an open dialog — a live WebGL canvas under a blurred
    // overlay is exactly what makes an interface feel frozen.
    effect(() => {
      this.motion.overlayOpen();
      this.syncLoop();
    });
  }

  ngAfterViewInit(): void {
    if (this.motion.reducedMotion() || !this.supportsWebGL()) {
      this.canvasRef.nativeElement.parentElement?.classList.add('personal-scene--static');
      return;
    }
    this.zone.runOutsideAngular(() => {
      void this.init();
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.running = false;
    this.renderer?.setAnimationLoop(null);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.modeObserver?.disconnect();
    this.orbGeometry?.dispose();
    this.haloGeometry?.dispose();
    this.dustGeometry?.dispose();
    this.orbMaterial?.dispose();
    this.haloMaterial?.dispose();
    this.dustMaterial?.dispose();
    this.renderer?.dispose();
  }

  private supportsWebGL(): boolean {
    if ((navigator.hardwareConcurrency ?? 8) <= 2) {
      return false;
    }
    try {
      const probe = document.createElement('canvas');
      return !!(probe.getContext('webgl2') || probe.getContext('webgl'));
    } catch {
      return false;
    }
  }

  private async init(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    const THREE = await import('three');
    if (this.destroyed) {
      return;
    }
    this.THREE = THREE;

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    this.colorA = new THREE.Color(this.readCssVar('--color-accent', '#ffb347'));
    this.colorB = new THREE.Color(this.readCssVar('--color-accent-secondary', '#ff6b9d'));
    // Vibe-driven: the perspective declares whether additive light reads well.
    this.additive = this.readCssVar('--mode-blend', 'additive') !== 'normal';

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);
    this.camera = camera;

    this.buildOrb(THREE, scene, isMobile ? MOBILE_ORB_DETAIL : DESKTOP_ORB_DETAIL);
    this.buildHalo(THREE, scene);
    this.buildDust(THREE, scene, isMobile ? MOBILE_DUST : DESKTOP_DUST);

    this.resize(canvas, renderer, camera);
    this.observe(canvas);
    this.attachListeners();
    this.syncLoop();
  }

  private buildOrb(THREE: ThreeModule, scene: Scene, detail: number): void {
    const geometry = new THREE.IcosahedronGeometry(1.3, detail);
    this.orbGeometry = geometry;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.24 },
        uFreq: { value: 1.35 },
        uSpeed: { value: 0.22 },
        uPulse: { value: 0 },
        uColorA: { value: this.colorA },
        uColorB: { value: this.colorB }
      },
      vertexShader: ORB_VERTEX,
      fragmentShader: ORB_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: this.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    this.orbMaterial = material;

    const mesh = new THREE.Mesh(geometry, material);
    this.orb = mesh;
    scene.add(mesh);
  }

  private buildHalo(THREE: ThreeModule, scene: Scene): void {
    const geometry = new THREE.IcosahedronGeometry(1.72, 4);
    this.haloGeometry = geometry;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColorA: { value: this.colorA }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: HALO_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.haloMaterial = material;

    const mesh = new THREE.Mesh(geometry, material);
    this.halo = mesh;
    scene.add(mesh);
  }

  private buildDust(THREE: ThreeModule, scene: Scene, count: number): void {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Flattened spherical shell, so the dust reads as an orbiting disc.
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.1 + Math.random() * 1.9;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.42;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      scales[i] = 0.35 + Math.random() * 1.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.dustGeometry = geometry;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: 26 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: this.colorA },
        uOpacity: { value: 0.6 }
      },
      vertexShader: DUST_VERTEX,
      fragmentShader: DUST_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: this.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    this.dustMaterial = material;

    const group = new THREE.Group();
    this.dustGroup = group;
    group.add(new THREE.Points(geometry, material));
    scene.add(group);
  }

  private readonly render = (): void => {
    const { renderer, scene, camera } = this;
    if (!renderer || !scene || !camera) {
      return;
    }

    const now = performance.now() / 1000;
    const delta = this.lastTime ? Math.min(now - this.lastTime, 0.05) : 0.016;
    this.lastTime = now;
    this.time += delta;

    this.pulse *= 0.94;
    if (this.pulse < 0.001) {
      this.pulse = 0;
    }

    const orb = this.orbMaterial?.uniforms;
    if (orb) {
      orb['uTime'].value = this.time;
      orb['uPulse'].value = this.pulse;
    }

    // Camera parallax — eased so the orb feels weighty, not jittery.
    this.camX += (this.pointerX * 0.55 - this.camX) * 0.04;
    this.camY += (-this.pointerY * 0.42 - this.camY) * 0.04;
    camera.position.set(this.camX, this.camY, 4.4);
    camera.lookAt(0, 0, 0);

    if (this.orb) {
      this.orb.rotation.y += delta * 0.08;
      this.orb.rotation.x = this.camY * 0.15;
    }
    if (this.halo) {
      this.halo.rotation.y -= delta * 0.03;
    }
    if (this.dustGroup) {
      this.dustGroup.rotation.y += delta * 0.05;
      this.dustGroup.rotation.x = 0.32 + this.camY * 0.1;
    }

    renderer.render(scene, camera);
  };

  private syncLoop(): void {
    const shouldRun =
      this.inView && this.tabVisible && !this.motion.overlayOpen() && !!this.renderer && !this.destroyed;
    if (shouldRun && !this.running) {
      this.running = true;
      this.renderer?.setAnimationLoop(this.render);
    } else if (!shouldRun && this.running) {
      this.running = false;
      this.renderer?.setAnimationLoop(null);
    }
  }

  private resize(canvas: HTMLCanvasElement, renderer: Renderer, camera: Camera): void {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }

  private observe(canvas: HTMLCanvasElement): void {
    const target = canvas.parentElement ?? canvas;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.renderer && this.camera) {
        this.resize(canvas, this.renderer, this.camera);
      }
    });
    this.resizeObserver.observe(target);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.inView = entries.some((entry) => entry.isIntersecting);
        this.syncLoop();
      },
      { threshold: 0 }
    );
    this.intersectionObserver.observe(target);

    // The accent (and its override) can change while the scene is alive.
    this.modeObserver = new MutationObserver(() => {
      this.colorA?.set(this.readCssVar('--color-accent', '#ffb347'));
      this.colorB?.set(this.readCssVar('--color-accent-secondary', '#ff6b9d'));
    });
    this.modeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode', 'data-theme', 'style']
    });
  }

  private attachListeners(): void {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private readCssVar(variable: string, fallback: string): string {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    return raw || fallback;
  }
}
