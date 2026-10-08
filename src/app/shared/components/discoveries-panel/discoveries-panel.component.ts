import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  effect,
  inject,
  viewChild
} from '@angular/core';
import { AchievementService, DISCOVERIES } from '../../../core/services/achievement.service';
import { MotionService } from '../../../core/services/motion.service';
import { UiService } from '../../../core/services/ui.service';

/**
 * The discoveries panel: every hidden feature, with a hint while it is locked
 * and the useful tip once it has been found.
 */
@Component({
  selector: 'app-discoveries-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ui.discoveriesOpen()) {
      <div class="dialog-overlay" data-lenis-prevent (click)="close()">
        <section
          #dialog
          class="dialog dialog--sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discoveries-title"
          tabindex="-1"
          (click)="$event.stopPropagation()"
        >
          <header class="dialog__head">
            <div>
              <p class="dialog__eyebrow">{{ foundCount() }} of {{ discoveries.length }} found</p>
              <h2 class="dialog__title" id="discoveries-title">Hidden on this page</h2>
            </div>
            <button type="button" class="dialog__close" (click)="close()" aria-label="Close discoveries">×</button>
          </header>

          <div class="dialog__body">
            <div class="discoveries__bar" aria-hidden="true">
              <span class="discoveries__bar-fill" [style.transform]="'scaleX(' + progress() + ')'"></span>
            </div>

            <ul class="discoveries">
              @for (discovery of discoveries; track discovery.id) {
                <li class="discovery" [class.discovery--found]="achievements.isFound(discovery.id)">
                  <span class="discovery__egg" aria-hidden="true">
                    @if (achievements.isFound(discovery.id)) {
                      <span class="discovery__egg-crack"></span>
                    }
                  </span>
                  <div class="discovery__text">
                    @if (achievements.isFound(discovery.id)) {
                      <p class="discovery__title">{{ discovery.title }}</p>
                      <p class="discovery__tip">{{ discovery.tip }}</p>
                    } @else {
                      <p class="discovery__title discovery__title--locked">Not found yet</p>
                      <p class="discovery__hint">{{ discovery.hint }}</p>
                    }
                  </div>
                </li>
              }
            </ul>

            <div class="dialog__actions">
              <button type="button" class="btn btn--outline" (click)="reset()">Reset the hunt</button>
              <button type="button" class="btn btn--outline" (click)="close()">Close</button>
            </div>
          </div>
        </section>
      </div>
    }
  `,
  styleUrl: './discoveries-panel.component.scss'
})
export class DiscoveriesPanelComponent {
  readonly ui = inject(UiService);
  readonly achievements = inject(AchievementService);
  readonly discoveries = DISCOVERIES;

  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');

  readonly foundCount = () => this.achievements.found().size;
  readonly progress = () => this.achievements.found().size / this.discoveries.length;

  constructor() {
    effect(() => {
      if (this.ui.discoveriesOpen()) {
        this.motion.lockScroll('discoveries');
        this.zone.runOutsideAngular(() => setTimeout(() => this.dialogRef()?.nativeElement.focus()));
      } else {
        this.motion.unlockScroll('discoveries');
      }
    });
  }

  close(): void {
    this.ui.closeDiscoveries();
  }

  reset(): void {
    this.achievements.reset();
    this.achievements.notify('Hunt reset', 'All discoveries cleared. Good luck.', 'System');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.ui.discoveriesOpen()) {
      this.close();
    }
  }
}
