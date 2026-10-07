import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  private readonly portfolioService = inject(PortfolioService);

  private readonly filteredSkills = this.portfolioService.skills;

  skillCategories = computed(() => {
    const s = this.filteredSkills();
    const list: { title: string; items: string[] }[] = [];

    if (s.frontend?.length) {
      list.push({ title: 'Frontend Engineering', items: s.frontend });
    }
    if (s.backend?.length) {
      list.push({ title: 'Backend & APIs', items: s.backend });
    }
    if (s.database?.length) {
      list.push({ title: 'Databases', items: s.database });
    }
    if (s.devops?.length) {
      list.push({ title: 'DevOps & Tooling', items: s.devops });
    }

    return list;
  });
}
