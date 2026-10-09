import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  private readonly portfolioService = inject(PortfolioService);

  experience = this.portfolioService.experience;
  header = computed(() => this.portfolioService.sectionHeader('experience'));
}
