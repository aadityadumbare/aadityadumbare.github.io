import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { RecruiterSnapshotComponent } from '../../shared/components/recruiter-snapshot/recruiter-snapshot.component';
import { ParticleFieldComponent } from '../../shared/components/particle-field/particle-field.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, RecruiterSnapshotComponent, ParticleFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  private readonly portfolioService = inject(PortfolioService);

  profile = this.portfolioService.profile;
  stats = this.portfolioService.stats;
}
