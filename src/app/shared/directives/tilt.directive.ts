import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../core/services/motion.service';

/** Subtle 3D tilt following the pointer. Pointer-fine only. */
@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective implements OnInit, OnDestroy {
  /** Maximum rotation in degrees. */
  @Input('appTilt') max = 6;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private enabled = false;

  private readonly onMove = (event: MouseEvent): void => {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const max = Number(this.max) || 6;
    const px = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const py = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    gsap.to(this.el.nativeElement, {
      rotateY: gsap.utils.clamp(-max, max, px * max),
      rotateX: gsap.utils.clamp(-max, max, -py * max),
      transformPerspective: 1000,
      transformOrigin: 'center',
      duration: 0.45,
      ease: 'power3.out'
    });
  };

  private readonly onLeave = (): void => {
    gsap.to(this.el.nativeElement, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
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
