import { ChangeDetectionStrategy, Component, ElementRef, HostListener, NgZone, computed, inject, signal, viewChild } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { MotionService } from '../../core/services/motion.service';
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
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocused: HTMLElement | null = null;

  projects = this.portfolioService.projects;
  config = this.portfolioService.config;
  header = computed(() => this.portfolioService.sectionHeader('projects'));
  selectedProject = signal<ProjectItem | null>(null);

  openDeepDive(project: ProjectItem): void {
    if (!this.config().enableProjectDeepDives) {
      return;
    }
    this.selectedProject.set(project);
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.motion.lockScroll('project-dialog');
    // Focus after the dialog has rendered so the keyboard lands inside it.
    this.zone.runOutsideAngular(() =>
      setTimeout(() => this.dialogRef()?.nativeElement.focus())
    );
  }

  closeDeepDive(): void {
    if (!this.selectedProject()) {
      return;
    }
    this.selectedProject.set(null);
    this.motion.unlockScroll('project-dialog');
    this.lastFocused?.focus?.();
    this.lastFocused = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDeepDive();
  }
}
