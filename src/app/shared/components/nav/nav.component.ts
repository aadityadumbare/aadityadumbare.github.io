import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { AchievementService } from '../../../core/services/achievement.service';
import { UiService } from '../../../core/services/ui.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ModeSwitcherComponent } from '../mode-switcher/mode-switcher.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ModeSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  themeService = inject(ThemeService);
  readonly achievements = inject(AchievementService);
  readonly ui = inject(UiService);
  private readonly portfolioService = inject(PortfolioService);

  @ViewChild('progress') private readonly progressRef?: ElementRef<HTMLElement>;

  isScrolled = signal(false);
  isMenuOpen = signal(false);
  spinning = signal(false);

  /** Nav mirrors the active perspective's sections, in order. */
  navLinks = computed(() =>
    this.portfolioService.sections().map((section) => ({
      label: section.label.split('/').pop()?.trim() ?? section.id,
      hash: `#${section.id}`
    }))
  );

  private ticking = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // The scroll-progress bar is written straight to the DOM so scrolling
    // never drives change detection.
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const bar = this.progressRef?.nativeElement;
      if (bar) {
        bar.style.transform = `scaleX(${ratio})`;
      }
      this.isScrolled.set(window.scrollY > 40);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Double-click the wordmark for a spin (and a discovery). */
  spinLogo(): void {
    this.spinning.set(false);
    requestAnimationFrame(() => this.spinning.set(true));
    setTimeout(() => this.spinning.set(false), 950);

    this.achievements.unlock('logo-spin');
  }
}
