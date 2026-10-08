import { Injectable, signal } from '@angular/core';

/**
 * Small shared UI state, so unrelated features (the command palette, the
 * typed-secret words, the nav) can open overlays without reaching into each
 * other's components.
 */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly commandOpen = signal(false);
  readonly recruiterOpen = signal(false);
  readonly discoveriesOpen = signal(false);

  openCommand(): void {
    this.commandOpen.set(true);
  }

  closeCommand(): void {
    this.commandOpen.set(false);
  }

  toggleCommand(): void {
    this.commandOpen.update((open) => !open);
  }

  openRecruiter(): void {
    this.recruiterOpen.set(true);
  }

  closeRecruiter(): void {
    this.recruiterOpen.set(false);
  }

  openDiscoveries(): void {
    this.discoveriesOpen.set(true);
  }

  closeDiscoveries(): void {
    this.discoveriesOpen.set(false);
  }
}
