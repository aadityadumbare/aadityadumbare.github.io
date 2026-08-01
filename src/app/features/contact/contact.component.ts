import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  portfolioService = inject(PortfolioService);

  profile = this.portfolioService.profile;
  social = this.portfolioService.social;
}
