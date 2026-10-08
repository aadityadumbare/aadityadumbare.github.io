import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AchievementService } from '../../../core/services/achievement.service';

/** Discovery toasts — earned once per browser, announced politely. */
@Component({
  selector: 'app-toasts',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" role="status" aria-live="polite">
      @for (toast of achievements.toasts(); track toast.id) {
        <div class="toast" [class.toast--discovery]="toast.discovery">
          @if (toast.discovery) {
            <span class="toast__egg" aria-hidden="true">
              <span class="toast__egg-crack"></span>
            </span>
          }
          <div class="toast__body">
            <p class="toast__eyebrow">{{ toast.eyebrow }}</p>
            <p class="toast__title">{{ toast.title }}</p>
            <p class="toast__detail">{{ toast.detail }}</p>
          </div>
          <button
            type="button"
            class="toast__close"
            (click)="achievements.dismiss(toast.id)"
            aria-label="Dismiss discovery"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toasts.component.scss'
})
export class ToastsComponent {
  readonly achievements = inject(AchievementService);
}
