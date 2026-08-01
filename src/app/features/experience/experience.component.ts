import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  portfolioService = inject(PortfolioService);

  experience = this.portfolioService.experience;
}
