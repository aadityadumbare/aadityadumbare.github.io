import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioMode } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-mode-switcher',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mode-switcher.component.html',
  styleUrls: ['./mode-switcher.component.scss']
})
export class ModeSwitcherComponent {
  portfolioService = inject(PortfolioService);
  isOpen = signal<boolean>(false);

  modes: { key: PortfolioMode; label: string; icon: string }[] = [
    { key: 'fullstack', label: 'Full Stack Developer', icon: '⚡' },
    { key: 'frontend', label: 'Frontend Developer', icon: '🎨' },
    { key: 'backend', label: 'Backend / .NET', icon: '⚙️' },
    { key: 'personal', label: 'Personal Corner', icon: '☕' }
  ];

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectMode(modeKey: PortfolioMode) {
    this.portfolioService.setMode(modeKey);
    this.isOpen.set(false);
  }

  getModeIcon(key: PortfolioMode): string {
    return this.modes.find(m => m.key === key)?.icon || '⚡';
  }

  getModeLabel(key: PortfolioMode): string {
    return this.modes.find(m => m.key === key)?.label || 'Full Stack';
  }
}
