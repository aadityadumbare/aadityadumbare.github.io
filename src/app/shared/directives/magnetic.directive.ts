import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../core/services/motion.service';

/** Pulls an element toward the pointer. Pointer-fine only. */
@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective implements OnInit, OnDestroy {
  /** Pointer-follow strength, 0–1. */
  @Input('appMagnetic') strength = 0.4;
  /** Maximum travel in pixels. */
  @Input() magneticMax = 9;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private enabled = false;

  private readonly onMove = (event: MouseEvent): void => {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const max = Number(this.magneticMax) || 9;
    const strength = Number(this.strength) || 0.4;
    gsap.to(this.el.nativeElement, {
      x: gsap.utils.clamp(-max, max, relX * max * strength * 2),
      y: gsap.utils.clamp(-max, max, relY * max * strength * 2),
      duration: 0.4,
      ease: 'power3.out'
    });
  };

  private readonly onLeave = (): void => {
    gsap.to(this.el.nativeElement, { x: 0, y: 0, duration: 0.55, ease: 'power3.out' });
  };

  ngOnInit(): void {
    if (this.motion.reducedMotion() || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    this.enabled = true;
    const node = this.el.nativeElement;
    node.addEventListener('mousemove', this.onMove);
    node.addEventListener('mouseleave', this.onLeave);
  }

  ngOnDestroy(): void {
    if (!this.enabled) {
      return;
    }
    this.el.nativeElement.removeEventListener('mousemove', this.onMove);
    this.el.nativeElement.removeEventListener('mouseleave', this.onLeave);
    gsap.killTweensOf(this.el.nativeElement);
  }
}
