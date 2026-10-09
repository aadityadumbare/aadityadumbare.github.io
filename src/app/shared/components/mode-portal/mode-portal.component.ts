import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { MotionService } from '../../../core/services/motion.service';
import { PortfolioMode } from '../../../core/models/portfolio.models';
import { MODE_REGISTRY } from '../../../data/modes.data';

/** Lines that cycle while the door is open, to make it feel alive. */
const TEASES = [
  'photos · films · half-finished ideas',
  'the parts that do not fit a résumé',
  'come see what I build for fun',
  'stories, frames, and side quests'
];

const PEEK_KEY = 'portfolio_portal_peeked';

/**
 * The doorway between the professional world and the personal one.
 *
 * - Standing in a professional perspective, it is a warm portal pinned to the
 *   right edge: it pulses, it peeks open on its own once to catch the eye, it
 *   cycles teasing copy, and crossing it plays a warm radial wipe.
 * - Standing in the personal space, it becomes a plain, unadorned "Full Stack"
 *   tab — no glow, no theatre, an immediate and professional exit.
 */
@Component({
  selector: 'app-mode-portal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mode-portal.component.html',
  styleUrls: ['./mode-portal.component.scss']
})
export class ModePortalComponent implements OnDestroy {
  private readonly portfolio = inject(PortfolioService);
  private readonly motion = inject(MotionService);

  readonly isPersonal = this.portfolio.isPersonal;

  readonly expanded = signal(false);
  readonly peeked = signal(false);
  readonly wiping = signal(false);
  readonly teaseIndex = signal(0);
  readonly wipeColor = signal(MODE_REGISTRY.personal.vibe.accent);

  readonly tease = computed(() => TEASES[this.teaseIndex()]);

  private teaseTimer: ReturnType<typeof setInterval> | null = null;
  private peekTimer: ReturnType<typeof setTimeout> | null = null;
  private peekHideTimer: ReturnType<typeof setTimeout> | null = null;
  private wipeTimers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    // When the doorway changes side, drop the door's open state with it.
    effect(() => {
      if (this.isPersonal()) {
        this.expanded.set(false);
        this.peeked.set(false);
        this.stopTease();
      } else {
        this.schedulePeek();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTease();
    this.clearTimers();
  }

  expand(): void {
    this.expanded.set(true);
    this.startTease();
  }

  collapse(): void {
    this.expanded.set(false);
    this.stopTease();
  }

  onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    if (host && !host.contains(event.relatedTarget as Node)) {
      this.collapse();
    }
  }

  enterPersonal(): void {
    this.collapse();
    this.transitionTo('personal');
  }

  enterProfessional(): void {
    this.transitionTo('fullstack');
  }

  private transitionTo(mode: PortfolioMode): void {
    if (this.wiping()) {
      return;
    }
    // The professional exit is deliberately instant and unadorned.
    if (this.motion.reducedMotion() || mode === 'fullstack') {
      this.portfolio.setMode(mode);
      return;
    }

    this.wipeColor.set(MODE_REGISTRY[mode].vibe.accent);
    this.wiping.set(true);
    this.wipeTimers.push(setTimeout(() => this.portfolio.setMode(mode), 240));
    this.wipeTimers.push(setTimeout(() => this.wiping.set(false), 940));
  }

  private startTease(): void {
    if (this.teaseTimer) {
      return;
    }
    this.teaseTimer = setInterval(() => {
      this.teaseIndex.update((i) => (i + 1) % TEASES.length);
    }, 2400);
  }

  private stopTease(): void {
    if (this.teaseTimer) {
      clearInterval(this.teaseTimer);
      this.teaseTimer = null;
    }
    this.teaseIndex.set(0);
  }

  /** Open the door by itself once per session — the "it noticed you" moment. */
  private schedulePeek(): void {
    if (this.peekTimer || this.motion.reducedMotion() || this.alreadyPeeked()) {
      return;
    }
    this.peekTimer = setTimeout(() => {
      this.peekTimer = null;
      this.markPeeked();
      this.peeked.set(true);
      this.peekHideTimer = setTimeout(() => {
        this.peekHideTimer = null;
        this.peeked.set(false);
      }, 2800);
    }, 4200);
  }

  private alreadyPeeked(): boolean {
    try {
      return sessionStorage.getItem(PEEK_KEY) === '1';
    } catch {
      return true;
    }
  }

  private markPeeked(): void {
    try {
      sessionStorage.setItem(PEEK_KEY, '1');
    } catch {
      /* storage can be unavailable; the peek simply repeats */
    }
  }

  private clearTimers(): void {
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
      this.peekTimer = null;
    }
    if (this.peekHideTimer) {
      clearTimeout(this.peekHideTimer);
      this.peekHideTimer = null;
    }
    this.wipeTimers.forEach(clearTimeout);
    this.wipeTimers = [];
  }
}
