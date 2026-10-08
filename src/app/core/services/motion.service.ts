import { DOCUMENT, Injectable, NgZone, inject, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns the page-wide motion foundation:
 *  - Lenis inertia scrolling (mouse/trackpad only)
 *  - the GSAP ticker <-> ScrollTrigger bridge
 *  - anchor-link delegation so `href="#id"` lands correctly under Lenis
 *  - the reduced-motion preference, exposed as a signal
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);

  readonly reducedMotion = signal(false);
  readonly smoothScroll = signal(false);
  /** True while any dialog/overlay wants the page scroll frozen. */
  readonly overlayOpen = signal(false);

  private readonly locks = new Set<string>();
  private lenis: Lenis | null = null;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.watchReducedMotion();
      this.apply();
      this.delegateAnchorLinks();
      this.watchResize();
    });
  }

  /** Programmatic scroll that respects Lenis when active. */
  scrollTo(target: string | HTMLElement, offset = 0): void {
    const el = typeof target === 'string' ? this.doc.querySelector<HTMLElement>(target) : target;
    if (!el) {
      return;
    }
    const header = this.headerOffset();
    this.zone.runOutsideAngular(() => {
      if (this.lenis) {
        this.lenis.scrollTo(el, { offset: offset - header, duration: 1.1 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + offset - header;
        window.scrollTo({ top, behavior: this.reducedMotion() ? 'auto' : 'smooth' });
      }
    });
  }

  /** Freeze page scrolling while an overlay is open. Ref-counted per caller id. */
  lockScroll(id: string): void {
    this.locks.add(id);
    this.applyScrollLock();
  }

  unlockScroll(id: string): void {
    this.locks.delete(id);
    this.applyScrollLock();
  }

  private applyScrollLock(): void {
    const locked = this.locks.size > 0;
    this.overlayOpen.set(locked);
    this.doc.documentElement.classList.toggle('scroll-locked', locked);
    if (locked) {
      this.lenis?.stop();
    } else {
      this.lenis?.start();
    }
  }

  /** Recalculate Lenis + ScrollTrigger geometry after layout changes. */
  refresh(): void {
    this.zone.runOutsideAngular(() => {
      this.lenis?.resize();
      ScrollTrigger.refresh();
    });
  }

  private headerOffset(): number {
    const raw = getComputedStyle(this.doc.documentElement).getPropertyValue('--header-height');
    const value = parseFloat(raw);
    return Number.isFinite(value) ? value * 16 : 64;
  }

  private watchReducedMotion(): void {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(mq.matches);
    mq.addEventListener('change', () => {
      this.reducedMotion.set(mq.matches);
      this.apply();
    });
  }

  private apply(): void {
    const canSmooth = !this.reducedMotion() && window.matchMedia('(pointer: fine)').matches;

    if (canSmooth && !this.lenis) {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(this.tick);
      gsap.ticker.lagSmoothing(0);
      this.lenis = lenis;
      this.smoothScroll.set(true);
    } else if (!canSmooth && this.lenis) {
      gsap.ticker.remove(this.tick);
      this.lenis.destroy();
      this.lenis = null;
      this.smoothScroll.set(false);
    }
  }

  private readonly tick = (time: number): void => {
    this.lenis?.raf(time * 1000);
  };

  private delegateAnchorLinks(): void {
    this.doc.addEventListener(
      'click',
      (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
          return;
        }
        const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
        if (!anchor) {
          return;
        }
        const hash = anchor.getAttribute('href');
        if (!hash || hash === '#') {
          event.preventDefault();
          this.scrollTo(document.body, 0);
          return;
        }
        const target = this.doc.querySelector<HTMLElement>(hash);
        if (!target) {
          return;
        }
        event.preventDefault();
        this.scrollTo(target);
        try {
          window.history.pushState(null, '', hash);
        } catch {
          /* history can be unavailable in sandboxed contexts */
        }
      },
      { passive: false }
    );
  }

  private watchResize(): void {
    window.addEventListener('resize', () => {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => this.refresh(), 150);
    });
  }
}
