import { Component, inject, signal, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { PortfolioMode } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-secret',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent implements AfterViewInit {
  portfolioService = inject(PortfolioService);

  pin = signal<string>('');
  isAuthorized = signal<boolean>(false);
  errorMessage = signal<string>('');

  accentColors = [
    { name: 'Indigo (Default)', hex: '#6366f1' },
    { name: 'Cyberpunk Rose', hex: '#ff007f' },
    { name: 'Matrix Green', hex: '#00ff66' },
    { name: 'Neon Amber', hex: '#ffb700' },
    { name: 'Ocean Cyan', hex: '#00f7ff' }
  ];

  @ViewChild('pinInput') pinInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // Focus pin input on load
    setTimeout(() => {
      if (this.pinInput) {
        this.pinInput.nativeElement.focus();
      }
    }, 100);
  }

  onPinInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pin.set(input.value);
    this.errorMessage.set('');

    const targetPin = this.portfolioService.config().secretPin;
    if (input.value === targetPin) {
      this.isAuthorized.set(true);
    } else if (input.value.length >= targetPin.length) {
      this.errorMessage.set('INVALID SECURE PIN. ACCESS DENIED.');
      this.pin.set('');
      input.value = '';
    }
  }

  setAccentColor(colorHex: string) {
    document.documentElement.style.setProperty('--color-accent', colorHex);
    // Add glow variation
    document.documentElement.style.setProperty('--color-accent-glow', `${colorHex}40`);
    document.documentElement.style.setProperty('--color-accent-light', this.lightenColor(colorHex, 20));
  }

  toggleSwitcher() {
    const current = this.portfolioService.config().showModeSwitcher;
    this.portfolioService.toggleModeSwitcher(!current);
  }

  toggleProjectDeepDives() {
    const current = this.portfolioService.config().enableProjectDeepDives;
    this.portfolioService.toggleProjectDeepDives(!current);
  }

  closePanel() {
    this.portfolioService.lockSecret();
    this.isAuthorized.set(false);
    this.pin.set('');
    this.errorMessage.set('');
  }

  // Lightens a hex color by a percent
  private lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#',''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
  }
}
