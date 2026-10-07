import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  styles: [
    `
      .section__header {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        margin-bottom: var(--space-3xl);
      }
      .section__header::after {
        content: '';
        display: block;
        height: 1px;
        background: var(--color-line);
        margin-top: var(--space-md);
      }
      @media (max-width: 480px) {
        .section__header {
          margin-bottom: var(--space-xl);
        }
      }
    `
  ]
})
export class SectionHeaderComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) title!: string;
}
