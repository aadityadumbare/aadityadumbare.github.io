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

  readonly modes = this.portfolioService.modes;

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectMode(modeKey: PortfolioMode) {
    this.portfolioService.setMode(modeKey);
    this.isOpen.set(false);
  }
}
