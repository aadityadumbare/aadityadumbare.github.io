import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<ThemeMode>('dark');

  constructor() {
    // Detect theme preference
    const saved = localStorage.getItem('portfolio_theme') as ThemeMode;
    if (saved) {
      this.theme.set(saved);
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      this.theme.set(prefersLight ? 'light' : 'dark');
    }

    // Apply theme whenever it changes
    effect(() => {
      const active = this.theme();
      document.documentElement.setAttribute('data-theme', active);
      localStorage.setItem('portfolio_theme', active);
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    this.flashScanlines();
  }

  setTheme(mode: ThemeMode) {
    this.theme.set(mode);
  }

  /**
   * Easter egg: a brief scanline sweep whenever the theme flips. Restarting the
   * CSS animation needs the class removed, a forced reflow, then re-added, so
   * rapid toggles each play it. Neutralised by prefers-reduced-motion.
   */
  private flashScanlines(): void {
    const root = document.documentElement;
    root.classList.remove('theme-flash');
    void root.offsetWidth;
    root.classList.add('theme-flash');
    setTimeout(() => root.classList.remove('theme-flash'), 700);
  }
}
