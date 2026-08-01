import { Component, inject, signal, ChangeDetectionStrategy, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioMode } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-floating-mode-switcher',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './floating-mode-switcher.component.html',
  styleUrls: ['./floating-mode-switcher.component.scss']
})
export class FloatingModeSwitcherComponent implements OnDestroy {
  portfolioService = inject(PortfolioService);

  isVisible = signal(false);
  isOpen = signal(false);

  modes: { key: PortfolioMode; label: string; icon: string }[] = [
    { key: 'fullstack', label: 'Full Stack', icon: '⚡' },
    { key: 'frontend', label: 'Frontend', icon: '🎨' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'personal', label: 'Personal', icon: '☕' }
  ];

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  onZoneEnter() {
    this.hoverTimer = setTimeout(() => this.isVisible.set(true), 2000);
  }

  @HostListener('mouseleave')
  onZoneLeave() {
    this.clearTimer();
    if (!this.isOpen()) {
      this.isVisible.set(false);
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  toggleOpen() {
    this.isOpen.update(v => !v);
  }

  selectMode(mode: PortfolioMode) {
    this.portfolioService.setMode(mode);
    this.isOpen.set(false);
  }

  private clearTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }
}
