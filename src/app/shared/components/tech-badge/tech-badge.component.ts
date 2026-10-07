import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <span class="tag">{{ techName }}</span> `,
  styles: [
    `
      .tag {
        display: inline-block;
        padding: 4px 10px;
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-muted);
        border: 1px solid var(--color-line);
        transition:
          color var(--dur-ui) var(--ease-out),
          border-color var(--dur-ui) var(--ease-out);
      }
      .tag:hover {
        color: var(--color-accent);
        border-color: var(--color-accent);
      }
    `
  ]
})
export class TechBadgeComponent {
  @Input({ required: true }) techName!: string;
}
