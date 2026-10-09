import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { GenerativeFrameComponent } from '../generative-frame/generative-frame.component';

@Component({
  selector: 'app-personal-gallery',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective, GenerativeFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-gallery.component.html',
  styleUrls: ['./personal-gallery.component.scss']
})
export class PersonalGalleryComponent {
  private readonly portfolio = inject(PortfolioService);

  readonly space = this.portfolio.personal;
  readonly header = computed(() => this.portfolio.sectionHeader('gallery'));
}
