import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../core/services/motion.service';

/**
 * Scroll reveal. Keeps the original `[appReveal]` + `[delay]` API so existing
 * templates keep working, but drives the animation with GSAP ScrollTrigger.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Delay in milliseconds before the reveal runs. */
  @Input() delay = 0;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private tween: gsap.core.Tween | null = null;

  ngOnInit(): void {
    const node = this.el.nativeElement;

    if (this.motion.reducedMotion()) {
      gsap.set(node, { opacity: 1 });
      return;
    }

    this.tween = gsap.fromTo(
      node,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: this.delay / 1000,
        ease: 'power3.out',
        // Drop the inline transform once done: a lingering transform would turn
        // this element into the containing block for any fixed-position dialog
        // rendered inside it (breaking overlay positioning).
        onComplete: () => gsap.set(node, { clearProps: 'transform' }),
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          once: true
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}
