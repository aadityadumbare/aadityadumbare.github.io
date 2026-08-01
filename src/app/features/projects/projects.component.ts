import { Component, inject, ChangeDetectionStrategy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ProjectItem } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, TechBadgeComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  portfolioService = inject(PortfolioService);

  projects = this.portfolioService.projects;
  config = this.portfolioService.config;
  selectedProject = signal<ProjectItem | null>(null);

  readonly projectMotionClasses: Record<string, string> = {
    'TransCore (Delaware E-ZPass)': 'project-card--transcore',
    'EPSON â€“ E-Procurement & E-Payment': 'project-card--epson',
    'Waayu Food Delivery App': 'project-card--waayu',
    'CARS (Contract Management System)': 'project-card--cars',
    'Network Solutions (Newfold & Bluehost)': 'project-card--network',
    'Meridukaan Marketplace': 'project-card--meridukaan',
    'Music Genres Classification': 'project-card--music'
  };

  getMotionClass(projectTitle: string) {
    return this.projectMotionClasses[projectTitle] ?? '';
  }

  openDeepDive(project: ProjectItem) {
    if (this.config().enableProjectDeepDives) {
      this.selectedProject.set(project);
    }
  }

  closeDeepDive() {
    this.selectedProject.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeDeepDive();
  }
}
