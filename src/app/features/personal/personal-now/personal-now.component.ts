import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-personal-now',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-now.component.html',
  styleUrls: ['./personal-now.component.scss']
})
export class PersonalNowComponent {
  private readonly portfolio = inject(PortfolioService);

  readonly space = this.portfolio.personal;
  readonly header = computed(() => this.portfolio.sectionHeader('now'));
  readonly openStory = signal<string | null>(null);

  toggle(id: string): void {
    this.openStory.update((current) => (current === id ? null : id));
  }
}
