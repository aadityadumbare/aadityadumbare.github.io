import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, TechBadgeComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  portfolioService = inject(PortfolioService);

  // Read filtered skill group
  filteredSkills = this.portfolioService.skills;

  // Format skills as an array of categories for rendering
  skillCategories = computed(() => {
    const s = this.filteredSkills();
    const list = [];

    if (s.frontend && s.frontend.length > 0) {
      list.push({ title: 'Frontend Development', items: s.frontend, icon: '🎨' });
    }
    if (s.backend && s.backend.length > 0) {
      list.push({ title: 'Backend Development', items: s.backend, icon: '⚙️' });
    }
    if (s.database && s.database.length > 0) {
      list.push({ title: 'Database Systems', items: s.database, icon: '💾' });
    }
    if (s.devops && s.devops.length > 0) {
      list.push({ title: 'DevOps & Tools', items: s.devops, icon: '🛠️' });
    }

    return list;
  });
}
