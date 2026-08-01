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
  }

  setTheme(mode: ThemeMode) {
    this.theme.set(mode);
  }
}
