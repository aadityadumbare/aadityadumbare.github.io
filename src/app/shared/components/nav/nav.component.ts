import { Component, inject, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { ModeSwitcherComponent } from '../mode-switcher/mode-switcher.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, ModeSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  themeService = inject(ThemeService);
  
  isScrolled = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);

  navLinks = [
    { label: 'About', hash: '#about' },
    { label: 'Skills', hash: '#skills' },
    { label: 'Projects', hash: '#projects' },
    { label: 'Experience', hash: '#experience' },
    { label: 'Contact', hash: '#contact' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  scrollToSection(hash: string, event: Event) {
    event.preventDefault();
    this.closeMenu();
    
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      // Update browser history/hash
      window.history.pushState(null, '', hash);
    }
  }
}
