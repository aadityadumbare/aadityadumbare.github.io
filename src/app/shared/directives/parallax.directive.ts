import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../core/services/motion.service';

/**
 * Scrubbed vertical parallax. `speed` is the travel as a fraction of the
 * element's own height (e.g. 0.12 shifts ±12%).
 */
@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input('appParallax') speed = 0.12;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private tween: gsap.core.Tween | null = null;

  ngOnInit(): void {
    if (this.motion.reducedMotion()) {
      return;
    }
    const speed = Number(this.speed) || 0.12;
    this.tween = gsap.fromTo(
      this.el.nativeElement,
      { yPercent: -speed * 100 },
      {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}
