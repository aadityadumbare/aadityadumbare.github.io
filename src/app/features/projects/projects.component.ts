import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { ProjectItem } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  private readonly portfolioService = inject(PortfolioService);

  projects = this.portfolioService.projects;
  config = this.portfolioService.config;
  selectedProject = signal<ProjectItem | null>(null);

  openDeepDive(project: ProjectItem): void {
    if (this.config().enableProjectDeepDives) {
      this.selectedProject.set(project);
    }
  }

  closeDeepDive(): void {
    this.selectedProject.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDeepDive();
  }
}
