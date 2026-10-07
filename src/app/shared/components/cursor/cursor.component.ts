import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  NgZone,
  OnDestroy,
  inject
} from '@angular/core';
import { MotionService } from '../../../core/services/motion.service';

const INTERACTIVE = 'a,button,[data-cursor],input,textarea,select,[role="button"]';

/**
 * Monochrome cursor companion: an instant dot plus a lagging ring that reacts
 * to interactive elements. Only enabled for fine pointers with motion allowed.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cursor" #root aria-hidden="true">
      <span class="cursor__ring" #ring></span>
      <span class="cursor__dot" #dot></span>
      <span class="cursor__label" #label></span>
    </div>
  `,
  styleUrl: './cursor.component.scss'
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);

  private enabled = false;
  private raf = 0;
  private tx = 0;
  private ty = 0;
  private rx = 0;
  private ry = 0;
  private visible = false;

  private root?: HTMLElement;
  private ring?: HTMLElement;
  private dot?: HTMLElement;
  private labelEl?: HTMLElement;

  private readonly onMove = (event: PointerEvent): void => {
    this.tx = event.clientX;
    this.ty = event.clientY;
    if (!this.visible) {
      this.visible = true;
      this.root?.classList.add('is-visible');
      this.rx = this.tx;
      this.ry = this.ty;
    }
    if (this.dot) {
      this.dot.style.transform = `translate3d(${this.tx}px, ${this.ty}px, 0)`;
    }
  };

  private readonly onOver = (event: PointerEvent): void => {
    const target = event.target as HTMLElement | null;
    const hit = target?.closest?.(INTERACTIVE) as HTMLElement | null;
    if (!hit) {
      this.root?.classList.remove('is-active');
      this.setLabel('');
      return;
    }
    this.root?.classList.add('is-active');
    this.setLabel(hit.getAttribute('data-cursor') === 'view' ? 'View' : '');
  };

  private readonly onLeave = (): void => {
    this.visible = false;
    this.root?.classList.remove('is-visible');
  };

  ngAfterViewInit(): void {
    if (!window.matchMedia('(pointer: fine)').matches || this.motion.reducedMotion()) {
      this.host.nativeElement.remove();
      return;
    }
    this.enabled = true;
    this.root = this.host.nativeElement.querySelector<HTMLElement>('.cursor') ?? undefined;
    this.ring = this.host.nativeElement.querySelector<HTMLElement>('.cursor__ring') ?? undefined;
    this.dot = this.host.nativeElement.querySelector<HTMLElement>('.cursor__dot') ?? undefined;
    this.labelEl = this.host.nativeElement.querySelector<HTMLElement>('.cursor__label') ?? undefined;

    this.doc.documentElement.classList.add('has-custom-cursor');

    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onMove, { passive: true });
      this.doc.addEventListener('pointerover', this.onOver, true);
      this.doc.documentElement.addEventListener('mouseleave', this.onLeave);
      this.loop();
    });
  }

  ngOnDestroy(): void {
    if (!this.enabled) {
      return;
    }
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
    this.doc.removeEventListener('pointerover', this.onOver, true);
    this.doc.documentElement.removeEventListener('mouseleave', this.onLeave);
    this.doc.documentElement.classList.remove('has-custom-cursor');
  }

  private setLabel(text: string): void {
    if (this.labelEl) {
      this.labelEl.textContent = text;
    }
  }

  private readonly loop = (): void => {
    this.rx += (this.tx - this.rx) * 0.16;
    this.ry += (this.ty - this.ry) * 0.16;
    if (this.ring) {
      this.ring.style.transform = `translate3d(${this.rx}px, ${this.ry}px, 0)`;
    }
    if (this.labelEl) {
      this.labelEl.style.transform = `translate3d(${this.rx}px, ${this.ry}px, 0)`;
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
