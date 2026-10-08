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
type Group = import('three').Group;
type Color = import('three').Color;
type BufferGeometry = import('three').BufferGeometry;
type ShaderMaterial = import('three').ShaderMaterial;
type LineBasicMaterial = import('three').LineBasicMaterial;
type BufferAttribute = import('three').BufferAttribute;

interface FieldConfig {
  count: number;
  spread: [number, number, number];
  linkRadius: number;
  maxLinks: number;
  pointSize: number;
}

const DESKTOP: FieldConfig = { count: 2200, spread: [24, 15, 12], linkRadius: 2.6, maxLinks: 1400, pointSize: 34 };
const MOBILE: FieldConfig = { count: 750, spread: [16, 11, 9], linkRadius: 3.1, maxLinks: 700, pointSize: 30 };

const VERTEX_SHADER = `
  attribute float aScale;
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(0.1, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;

/**
 * Interactive particle constellation for the hero. three.js is imported
 * dynamically so it lands in its own lazy chunk and never blocks first paint.
 * Decorative only — never focusable, never a layout dependency.
 */
@Component({
  selector: 'app-particle-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="particle-field__canvas" aria-hidden="true"></canvas>`,
  styleUrl: './particle-field.component.scss'
})
export class ParticleFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);

  private THREE: ThreeModule | null = null;
  private renderer?: Renderer;
  private scene?: Scene;
  private camera?: Camera;
  private group?: Group;
  private pointGeometry?: BufferGeometry;
  private lineGeometry?: BufferGeometry;
  private pointMaterial?: ShaderMaterial;
  private lineMaterial?: LineBasicMaterial;

  private config: FieldConfig = DESKTOP;
  private positions!: Float32Array;
  private velocities!: Float32Array;
  private linePositions!: Float32Array;
  private lineColors!: Float32Array;
  private pairA!: Int32Array;
  private pairB!: Int32Array;
  private segmentCount = 0;
  private linkRgb: [number, number, number] = [1, 1, 1];
  private frame = 0;

  private running = false;
  private destroyed = false;
  private inView = true;
  private tabVisible = true;
  private darkTheme = true;

  private pointerX = 0;
  private pointerY = 0;
  private camX = 0;
  private camY = 0;
  private scrollFactor = 0;

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private themeObserver?: MutationObserver;

  private readonly onPointerMove = (event: PointerEvent): void => {
    this.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
  };

  private readonly onScroll = (): void => {
    this.scrollFactor = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight || 1)));
  };

  private readonly onVisibility = (): void => {
    this.tabVisible = !document.hidden;
    this.syncLoop();
  };

  constructor() {
    // Pause the render loop while a dialog is open: a backdrop-filter blur over
    // a live WebGL canvas is what makes the UI feel frozen.
    effect(() => {
      this.motion.overlayOpen();
      this.syncLoop();
    });
  }

  ngAfterViewInit(): void {
    if (this.motion.reducedMotion() || !this.supportsWebGL()) {
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
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.themeObserver?.disconnect();
    this.pointGeometry?.dispose();
    this.lineGeometry?.dispose();
    this.pointMaterial?.dispose();
    this.lineMaterial?.dispose();
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
    this.config = isMobile ? MOBILE : DESKTOP;
    this.darkTheme = document.documentElement.getAttribute('data-theme') !== 'light';

    const color = new THREE.Color(
      this.darkTheme ? this.readCssVar('--color-accent', '#d4ff00') : this.readCssVar('--color-ink', '#f5f5f4')
    );

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 12);
    this.camera = camera;

    const group = new THREE.Group();
    scene.add(group);
    this.group = group;

    this.buildPoints(THREE, group, color);
    this.buildLines(THREE, group, color);
    this.rebuildPairs();

    this.resize(canvas, renderer, camera);
    this.observe(canvas);
    this.attachListeners();
    this.syncLoop();
  }

  private buildPoints(THREE: ThreeModule, group: Group, color: Color): void {
    const { count, spread } = this.config;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const [sx, sy, sz] = spread;

    for (let i = 0; i < count; i++) {
      this.positions[i * 3] = (Math.random() - 0.5) * sx;
      this.positions[i * 3 + 1] = (Math.random() - 0.5) * sy;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * sz;
      this.velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      scales[i] = 0.5 + Math.random() * 1.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.pointGeometry = geometry;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: this.config.pointSize },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: color },
        uOpacity: { value: this.darkTheme ? 0.95 : 0.5 }
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: this.darkTheme ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    this.pointMaterial = material;

    const points = new THREE.Points(geometry, material);
    group.add(points);
  }

  private buildLines(THREE: ThreeModule, group: Group, color: Color): void {
    this.linePositions = new Float32Array(this.config.maxLinks * 6);
    this.lineColors = new Float32Array(this.config.maxLinks * 6);
    this.pairA = new Int32Array(this.config.maxLinks);
    this.pairB = new Int32Array(this.config.maxLinks);
    this.linkRgb = [color.r, color.g, color.b];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3));
    geometry.setDrawRange(0, 0);
    this.lineGeometry = geometry;

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: this.darkTheme ? 0.55 : 0.35,
      depthWrite: false,
      blending: this.darkTheme ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    this.lineMaterial = material;

    group.add(new THREE.LineSegments(geometry, material));
  }

  /** Spatial-hash neighbour search. Allocates, so it runs rarely (every 20 frames). */
  private rebuildPairs(): void {
    const positions = this.positions;
    const count = positions.length / 3;
    const r = this.config.linkRadius;
    const r2 = r * r;
    const cell = r;
    const buckets = new Map<number, number[]>();
    const key = (ix: number, iy: number, iz: number): number =>
      ((ix + 512) << 20) ^ ((iy + 512) << 10) ^ (iz + 512);

    for (let i = 0; i < count; i++) {
      const k = key(
        Math.floor(positions[i * 3] / cell),
        Math.floor(positions[i * 3 + 1] / cell),
        Math.floor(positions[i * 3 + 2] / cell)
      );
      const bucket = buckets.get(k);
      if (bucket) {
        bucket.push(i);
      } else {
        buckets.set(k, [i]);
      }
    }

    const maxSeg = this.config.maxLinks;
    let seg = 0;

    for (let i = 0; i < count && seg < maxSeg; i++) {
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      const cx = Math.floor(px / cell);
      const cy = Math.floor(py / cell);
      const cz = Math.floor(pz / cell);

      for (let ox = -1; ox <= 1 && seg < maxSeg; ox++) {
        for (let oy = -1; oy <= 1 && seg < maxSeg; oy++) {
          for (let oz = -1; oz <= 1 && seg < maxSeg; oz++) {
            const bucket = buckets.get(key(cx + ox, cy + oy, cz + oz));
            if (!bucket) {
              continue;
            }
            for (let b = 0; b < bucket.length; b++) {
              const j = bucket[b];
              if (j <= i) {
                continue;
              }
              const dx = px - positions[j * 3];
              const dy = py - positions[j * 3 + 1];
              const dz = pz - positions[j * 3 + 2];
              if (dx * dx + dy * dy + dz * dz > r2) {
                continue;
              }
              this.pairA[seg] = i;
              this.pairB[seg] = j;
              seg++;
              if (seg >= maxSeg) {
                break;
              }
            }
          }
        }
      }
    }
    this.segmentCount = seg;
  }

  /** Cheap per-frame work: drift the points, then resample the cached pairs. */
  private updateFrame(): void {
    const positions = this.positions;
    const velocities = this.velocities;
    const [sx, sy, sz] = this.config.spread;
    const hx = sx / 2;
    const hy = sy / 2;
    const hz = sz / 2;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      if (positions[i] > hx || positions[i] < -hx) velocities[i] *= -1;
      if (positions[i + 1] > hy || positions[i + 1] < -hy) velocities[i + 1] *= -1;
      if (positions[i + 2] > hz || positions[i + 2] < -hz) velocities[i + 2] *= -1;
    }

    const pointPositions = linePointAttribute(this.pointGeometry);
    if (pointPositions) {
      pointPositions.needsUpdate = true;
    }

    if (this.frame % 20 === 0) {
      this.rebuildPairs();
    }
    this.updateLines();
  }

  private updateLines(): void {
    const r = this.config.linkRadius;
    const r2 = r * r;
    const positions = this.positions;
    const lp = this.linePositions;
    const lc = this.lineColors;
    const [cr, cg, cb] = this.linkRgb;

    for (let s = 0; s < this.segmentCount; s++) {
      const i = this.pairA[s];
      const j = this.pairB[s];
      const ix = i * 3;
      const jx = j * 3;
      const base = s * 6;
      lp[base] = positions[ix];
      lp[base + 1] = positions[ix + 1];
      lp[base + 2] = positions[ix + 2];
      lp[base + 3] = positions[jx];
      lp[base + 4] = positions[jx + 1];
      lp[base + 5] = positions[jx + 2];

      const dx = positions[ix] - positions[jx];
      const dy = positions[ix + 1] - positions[jx + 1];
      const dz = positions[ix + 2] - positions[jx + 2];
      const d2 = dx * dx + dy * dy + dz * dz;
      const fade = 1 - Math.min(1, d2 / r2);
      const f = fade * fade;
      lc[base] = cr * f;
      lc[base + 1] = cg * f;
      lc[base + 2] = cb * f;
      lc[base + 3] = cr * f;
      lc[base + 4] = cg * f;
      lc[base + 5] = cb * f;
    }

    if (this.lineGeometry) {
      this.lineGeometry.setDrawRange(0, this.segmentCount * 2);
      (this.lineGeometry.attributes['position'] as BufferAttribute).needsUpdate = true;
      (this.lineGeometry.attributes['color'] as BufferAttribute).needsUpdate = true;
    }
  }

  private readonly render = (): void => {
    const { renderer, scene, camera } = this;
    if (!renderer || !scene || !camera) {
      return;
    }

    this.frame++;
    this.updateFrame();

    this.camX += (this.pointerX * 1.4 - this.camX) * 0.045;
    this.camY += (-this.pointerY * 1.0 - this.camY) * 0.045;
    camera.position.set(this.camX, this.camY, 12 - this.scrollFactor * 2.5);
    camera.lookAt(0, 0, 0);

    if (this.group) {
      this.group.rotation.y += 0.0006;
      this.group.rotation.x = this.camY * 0.05;
    }

    renderer.render(scene, camera);
  };

  private syncLoop(): void {
    const shouldRun =
      this.darkTheme && this.inView && this.tabVisible && !this.motion.overlayOpen() && !!this.renderer && !this.destroyed;
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
    this.onScroll();
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

    this.themeObserver = new MutationObserver(() => {
      this.darkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
      this.syncLoop();
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  private attachListeners(): void {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private readCssVar(variable: string, fallback: string): string {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    return raw || fallback;
  }
}

function linePointAttribute(geometry: BufferGeometry | undefined): BufferAttribute | undefined {
  return geometry?.attributes['position'] as BufferAttribute | undefined;
}
