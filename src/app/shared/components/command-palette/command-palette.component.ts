import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { AchievementService } from '../../../core/services/achievement.service';
import { MotionService } from '../../../core/services/motion.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ThemeService } from '../../../core/services/theme.service';
import { UiService } from '../../../core/services/ui.service';

interface Command {
  id: string;
  label: string;
  hint: string;
  group: 'Navigate' | 'Actions' | 'Perspective' | 'Meta';
  run: () => void;
}

/**
 * ⌘/Ctrl+K command palette. Keyboard-first: type to filter, arrows to move,
 * enter to run, escape to close.
 */
@Component({
  selector: 'app-command-palette',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ui.commandOpen()) {
      <div class="palette-overlay" data-lenis-prevent (click)="close()">
        <div
          #panel
          class="palette"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          tabindex="-1"
          (click)="$event.stopPropagation()"
        >
          <div class="palette__field">
            <span class="palette__prompt" aria-hidden="true">&gt;</span>
            <input
              #input
              class="palette__input"
              type="text"
              autocomplete="off"
              spellcheck="false"
              placeholder="Type a command…"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              [attr.aria-activedescendant]="'palette-option-' + activeIndex()"
              [value]="query()"
              (input)="onQuery($any($event.target).value)"
              (keydown)="onKeydown($event)"
            />
            <kbd class="palette__kbd">esc</kbd>
          </div>

          <ul class="palette__list" id="palette-list" role="listbox" aria-label="Commands">
            @for (command of results(); track command.id; let i = $index) {
              <li
                class="palette__item"
                [class.palette__item--active]="i === activeIndex()"
                [id]="'palette-option-' + i"
                role="option"
                [attr.aria-selected]="i === activeIndex()"
                (click)="run(command)"
                (mouseenter)="activeIndex.set(i)"
              >
                <span class="palette__group">{{ command.group }}</span>
                <span class="palette__label">{{ command.label }}</span>
                @if (command.hint) {
                  <span class="palette__hint">{{ command.hint }}</span>
                }
              </li>
            } @empty {
              <li class="palette__empty">No command matches “{{ query() }}”.</li>
            }
          </ul>

          <div class="palette__foot" aria-hidden="true">
            <span class="palette__foot-key"><kbd>↑</kbd><kbd>↓</kbd> move</span>
            <span class="palette__foot-key"><kbd>↵</kbd> run</span>
            <span class="palette__foot-key"><kbd>esc</kbd> close</span>
            <span class="palette__foot-touch">Tap a command to run it</span>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './command-palette.component.scss'
})
export class CommandPaletteComponent implements OnDestroy {
  readonly ui = inject(UiService);
  private readonly motion = inject(MotionService);
  private readonly portfolio = inject(PortfolioService);
  private readonly theme = inject(ThemeService);
  private readonly achievements = inject(AchievementService);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  query = signal('');
  activeIndex = signal(0);

  /** Computed so hints stay live (current perspective, discovery count). */
  private readonly commands = computed<Command[]>(() => this.buildCommands());

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.commands();
    if (!q) {
      return all;
    }
    return all.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  });

  constructor() {
    // Global shortcut: ⌘/Ctrl + K
    window.addEventListener('keydown', this.onShortcut, { passive: false });

    effect(() => {
      if (this.ui.commandOpen()) {
        this.query.set('');
        this.activeIndex.set(0);
        this.motion.lockScroll('command-palette');
        this.achievements.unlock('command-palette');
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.panelRef()?.nativeElement.focus();
            this.inputRef()?.nativeElement.focus();
          });
        });
      } else {
        this.motion.unlockScroll('command-palette');
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onShortcut);
  }

  onQuery(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.results();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => (items.length ? (i + 1) % items.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => (items.length ? (i - 1 + items.length) % items.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = items[this.activeIndex()];
      if (command) {
        this.run(command);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  run(command: Command): void {
    // Unlock synchronously first: Lenis ignores scrollTo while stopped, so a
    // "Go to …" command would silently do nothing if the palette still held
    // its own scroll lock when the command ran.
    this.motion.unlockScroll('command-palette');
    this.ui.closeCommand();
    command.run();
  }

  close(): void {
    this.ui.closeCommand();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.ui.commandOpen()) {
      this.close();
    }
  }

  private readonly onShortcut = (event: KeyboardEvent): void => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.ui.toggleCommand();
    }
  };

  private buildCommands(): Command[] {
    const go = (hash: string) => () => this.motion.scrollTo(hash);

    // Navigate + Perspective are generated from the registry, so the palette
    // always matches the active mode's sections and perspectives.
    const navCommands = this.portfolio.sections().map<Command>((section) => ({
      id: `go-${section.id}`,
      label: `Go to ${section.label.split('/').pop()?.trim() ?? section.id}`,
      hint: section.label.split('/')[0]?.trim() ?? '',
      group: 'Navigate',
      run: go(`#${section.id}`)
    }));

    return [
      ...navCommands,

      {
        id: 'toggle-theme',
        label: 'Toggle light / dark theme',
        hint: '',
        group: 'Actions',
        run: () => this.theme.toggleTheme()
      },
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: 'clipboard',
        group: 'Actions',
        run: () => void this.copyEmail()
      },
      {
        id: 'open-resume',
        label: 'Open résumé',
        hint: 'new tab',
        group: 'Actions',
        run: () => window.open(this.portfolio.profile().resume, '_blank', 'noopener')
      },
      {
        id: 'recruiter',
        label: 'Open the recruiter snapshot',
        hint: '30 seconds',
        group: 'Actions',
        run: () => this.ui.openRecruiter()
      },
      {
        id: 'unlock-secret',
        label: 'Open the hidden admin panel',
        hint: 'are you sure?',
        group: 'Actions',
        run: () => this.portfolio.unlockSecret()
      },

      ...this.portfolio.modes.map<Command>((mode) => ({
        id: `mode-${mode.key}`,
        label: `Perspective: ${mode.label}`,
        hint: this.portfolio.activeMode() === mode.key ? 'current' : mode.codename,
        group: 'Perspective',
        run: () => this.portfolio.setMode(mode.key)
      })),

      {
        id: 'discoveries',
        label: 'Show hidden features',
        hint: `${this.achievements.found().size} / ${this.achievements.total} found`,
        group: 'Meta',
        run: () => this.ui.openDiscoveries()
      }
    ];
  }

  private async copyEmail(): Promise<void> {
    const email = this.portfolio.profile().email;
    try {
      await navigator.clipboard.writeText(email);
      this.achievements.notify('Copied', `${email} is on your clipboard.`, 'Clipboard');
    } catch {
      this.achievements.notify('Clipboard blocked', 'Copy failed — use the email link instead.', 'Clipboard');
    }
  }
}
