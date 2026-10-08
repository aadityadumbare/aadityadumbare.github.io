import { Injectable, inject } from '@angular/core';
import { AchievementService } from './achievement.service';
import { PortfolioService } from './portfolio.service';
import { UiService } from './ui.service';

/**
 * Hidden words typed anywhere on the page (outside form fields). Keeps a short
 * rolling buffer of recent characters and matches on the tail.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardSecretsService {
  private readonly ui = inject(UiService);
  private readonly achievements = inject(AchievementService);
  private readonly portfolio = inject(PortfolioService);

  private buffer = '';

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('keydown', this.onKey, { passive: true });
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    // Never hijack typing in the contact form or the admin PIN field.
    const target = event.target as HTMLElement | null;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
      return;
    }
    if (event.key.length !== 1) {
      this.buffer = '';
      return;
    }

    this.buffer = (this.buffer + event.key.toLowerCase()).slice(-16);

    if (this.buffer.endsWith('hire')) {
      this.buffer = '';
      this.ui.openRecruiter();
      this.achievements.unlock('word-hire');
    } else if (this.buffer.endsWith('sudo')) {
      this.buffer = '';
      this.portfolio.unlockSecret();
      this.achievements.unlock('word-sudo');
    }
  };
}
