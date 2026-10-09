import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { PersonalSceneComponent } from '../personal-scene/personal-scene.component';

@Component({
  selector: 'app-personal-hero',
  standalone: true,
  imports: [RevealDirective, PersonalSceneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-hero.component.html',
  styleUrls: ['./personal-hero.component.scss']
})
export class PersonalHeroComponent {
  private readonly portfolio = inject(PortfolioService);

  readonly space = this.portfolio.personal;
}
