import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tag">{{ techName }}</span>
  `,
  styles: [`
    .tag {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-accent-light);
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: inline-block;
    }
    .tag:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--color-accent);
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) techName!: string;
}
