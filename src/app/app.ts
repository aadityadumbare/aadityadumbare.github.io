import { Component, ChangeDetectionStrategy, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioService } from './core/services/portfolio.service';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private portfolioService = inject(PortfolioService);
  private konamiIndex = 0;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      this.portfolioService.unlockSecret();
      return;
    }

    if (!this.portfolioService.config().allowKonamiCode) {
      return;
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const expected = KONAMI_SEQUENCE[this.konamiIndex];
    const normalizedExpected = expected.length === 1 ? expected.toLowerCase() : expected;

    if (key === normalizedExpected) {
      this.konamiIndex++;
      if (this.konamiIndex === KONAMI_SEQUENCE.length) {
        this.konamiIndex = 0;
        this.portfolioService.unlockSecret();
      }
    } else {
      const first = KONAMI_SEQUENCE[0];
      const normalizedFirst = first.length === 1 ? first.toLowerCase() : first;
      this.konamiIndex = key === normalizedFirst ? 1 : 0;
    }
  }
}
