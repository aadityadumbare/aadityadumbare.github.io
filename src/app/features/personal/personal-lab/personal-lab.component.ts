import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-personal-lab',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-lab.component.html',
  styleUrls: ['./personal-lab.component.scss']
})
export class PersonalLabComponent {
  private readonly portfolio = inject(PortfolioService);

  readonly space = this.portfolio.personal;
  readonly header = computed(() => this.portfolio.sectionHeader('lab'));
}
