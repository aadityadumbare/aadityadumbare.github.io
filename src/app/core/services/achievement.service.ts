import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export interface Toast {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  /** Discovery toasts get the egg-pop + celebration treatment. */
  discovery?: boolean;
}

export type DiscoveryId =
  | 'command-palette'
  | 'secret-panel'
  | 'word-hire'
  | 'word-sudo'
  | 'logo-spin'
  | 'headline-glitch'
  | 'ripple'
  | 'stillness';

export interface Discovery {
  id: DiscoveryId;
  title: string;
  /** Shown while it is still hidden. */
  hint: string;
  /** Revealed once found — the useful bit. */
  tip: string;
}

/** Single source of truth: the list, the `n / N` total, hints and tips. */
export const DISCOVERIES: ReadonlyArray<Discovery> = [
  {
    id: 'command-palette',
    title: 'Power user',
    hint: 'Something responds to a keyboard shortcut on this page.',
    tip: 'Press Cmd/Ctrl + K anywhere. It can jump to any section, copy my email, open the résumé, switch perspective or toggle the theme — all without touching the mouse.'
  },
  {
    id: 'secret-panel',
    title: 'Secret panel',
    hint: 'A classic cheat code still works on websites. So does a certain combo.',
    tip: 'That panel is the admin view: it overrides the accent colour live, switches perspective, and can reset these discoveries. The PIN is the code everyone uses.'
  },
  {
    id: 'word-hire',
    title: 'Word of power',
    hint: 'Type something. Anywhere on the page, outside a text box.',
    tip: 'Typing works anywhere on this page. "hire" is the one that counts — it opens the recruiter brief.'
  },
  {
    id: 'word-sudo',
    title: 'Root access',
    hint: 'You typed one word. Developers know another.',
    tip: '"sudo" unlocks the admin panel without the cheat code. The PIN still stands.'
  },
  {
    id: 'logo-spin',
    title: 'Spin cycle',
    hint: 'The wordmark in the header is more than a link.',
    tip: 'Double-click the logo. Small thing, but the whole page is built with transform-only motion so it stays at 60fps.'
  },
  {
    id: 'headline-glitch',
    title: 'Signal lost',
    hint: 'The headline does something on hover.',
    tip: 'The glitch is two pseudo-elements with chromatic offsets, clipped into bands — no images, no canvas, and it respects reduced-motion.'
  },
  {
    id: 'ripple',
    title: 'Ripple',
    hint: 'Try clicking the empty space in the hero.',
    tip: 'That ripple is a physics impulse: every nearby point gets pushed outward and the energy decays 8% a frame, so the ambient drift is never disturbed. Around 1000 points react to a single click.'
  },
  {
    id: 'stillness',
    title: 'Stillness',
    hint: 'Stop touching the page and wait.',
    tip: 'After ~18 seconds the constellation rearranges into my initials. Any input releases it — the whole thing is reversible, which is the hard part of getting it to feel calm.'
  }
];

const STORAGE_KEY = 'portfolio_discoveries';
const HINT_KEY = 'portfolio_hint_shown';
const TOAST_MS = 7000;
const MAX_VISIBLE = 3;
const HINT_DELAY_MS = 12000;

/**
 * Collects the hidden things a visitor finds, surfacing them as toasts. Each
 * discovery also carries a hint (while locked) and a tip (once found), so the
 * hunt is discoverable rather than guesswork.
 */
@Injectable({ providedIn: 'root' })
export class AchievementService {
  private readonly doc = inject(DOCUMENT);

  readonly toasts = signal<Toast[]>([]);
  readonly found = signal<ReadonlySet<DiscoveryId>>(new Set<DiscoveryId>());

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private seq = 0;

  constructor() {
    this.found.set(this.load());
    this.scheduleNudge();
  }

  /** A discovery: shown the first time only. Metadata comes from DISCOVERIES. */
  unlock(id: DiscoveryId): void {
    if (this.found().has(id)) {
      return;
    }
    this.found.update((set) => new Set(set).add(id));
    this.persist();

    const discovery = DISCOVERIES.find((d) => d.id === id);
    this.notify(discovery?.title ?? 'Found something', discovery?.tip ?? '', 'Discovery', true);
    this.celebrate();
  }

  /** A transient message that can repeat. */
  notify(title: string, detail: string, eyebrow = 'Discovery', discovery = false): void {
    const id = `toast-${++this.seq}`;
    this.toasts.update((list) => [...list, { id, eyebrow, title, detail, discovery }].slice(-MAX_VISIBLE));
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), TOAST_MS)
    );
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  get total(): number {
    return DISCOVERIES.length;
  }

  isFound(id: DiscoveryId): boolean {
    return this.found().has(id);
  }

  /** Used by the admin panel so the hunt can be replayed. */
  reset(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.found.set(new Set<DiscoveryId>());
    this.toasts.set([]);
    try {
      this.storage()?.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  /**
   * If nothing has been found yet, gently point the way in. Shown at most once
   * per browser so it never becomes a nag.
   */
  private scheduleNudge(): void {
    if (this.found().size > 0 || this.flag(HINT_KEY)) {
      return;
    }
    setTimeout(() => {
      if (this.found().size > 0 || this.flag(HINT_KEY)) {
        return;
      }
      this.setFlag(HINT_KEY);
      this.notify(
        'Something is hidden here',
        `${this.total} things are tucked away on this page. Press Cmd/Ctrl + K, or open the egg in the header for the list.`,
        'Tip'
      );
    }, HINT_DELAY_MS);
  }

  /** Egg-pop celebration: one lime pulse across the viewport. */
  private celebrate(): void {
    const root = document.documentElement;
    root.classList.remove('discovery-celebrate');
    void root.offsetWidth;
    root.classList.add('discovery-celebrate');
    setTimeout(() => root.classList.remove('discovery-celebrate'), 1400);
  }

  private flag(key: string): boolean {
    try {
      return this.storage()?.getItem(key) === '1';
    } catch {
      return false;
    }
  }

  private setFlag(key: string): void {
    try {
      this.storage()?.setItem(key, '1');
    } catch {
      /* ignore */
    }
  }

  private load(): Set<DiscoveryId> {
    try {
      const raw = this.storage()?.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      return new Set(Array.isArray(parsed) ? (parsed as DiscoveryId[]) : []);
    } catch {
      return new Set<DiscoveryId>();
    }
  }

  private persist(): void {
    try {
      this.storage()?.setItem(STORAGE_KEY, JSON.stringify([...this.found()]));
    } catch {
      /* ignore */
    }
  }

  private storage(): Storage | null {
    return this.doc.defaultView?.localStorage ?? null;
  }
}
