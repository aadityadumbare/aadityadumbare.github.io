import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
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

  @ViewChild('progress') private readonly progressRef?: ElementRef<HTMLElement>;

  isScrolled = signal(false);
  isMenuOpen = signal(false);

  navLinks = [
    { label: 'About', hash: '#about' },
    { label: 'Skills', hash: '#skills' },
    { label: 'Projects', hash: '#projects' },
    { label: 'Experience', hash: '#experience' },
    { label: 'Contact', hash: '#contact' }
  ];

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
}
