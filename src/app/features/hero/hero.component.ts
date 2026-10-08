import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AchievementService } from '../../core/services/achievement.service';
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
  private readonly achievements = inject(AchievementService);

  profile = this.portfolioService.profile;
  stats = this.portfolioService.stats;

  glitching = signal(false);

  /** Click the headline: a short signal-loss glitch on the accent phrase. */
  glitch(): void {
    this.glitching.set(false);
    requestAnimationFrame(() => this.glitching.set(true));
    setTimeout(() => this.glitching.set(false), 950);

    this.achievements.unlock('headline-glitch');
  }
}
