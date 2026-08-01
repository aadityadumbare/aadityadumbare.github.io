import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section__header">
      <span class="section__label">{{ label }}</span>
      <h2 class="section__title">{{ title }}</h2>
    </div>
  `,
  styles: [`
    .section__header {
      margin-bottom: var(--space-3xl);
    }
    .section__label {
      display: block;
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      color: var(--color-accent-light);
      margin-bottom: var(--space-sm);
    }
    .section__title {
      font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    @media (max-width: 480px) {
      .section__header {
        margin-bottom: var(--space-xl);
      }
    }
  `]
})
export class SectionHeaderComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) title!: string;
}
