import { ChangeDetectionStrategy, Component, ElementRef, HostListener, NgZone, inject, signal, viewChild } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { MotionService } from '../../../core/services/motion.service';

@Component({
  selector: 'app-recruiter-snapshot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recruiter-snapshot.component.html',
  styleUrls: ['./recruiter-snapshot.component.scss']
})
export class RecruiterSnapshotComponent {
  private readonly portfolioService = inject(PortfolioService);
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocused: HTMLElement | null = null;

  isOpen = signal(false);
  profile = this.portfolioService.profile;
  stats = this.portfolioService.stats;

  open(): void {
    this.isOpen.set(true);
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.motion.lockScroll('recruiter-snapshot');
    this.zone.runOutsideAngular(() =>
      setTimeout(() => this.dialogRef()?.nativeElement.focus())
    );
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    this.motion.unlockScroll('recruiter-snapshot');
    this.lastFocused?.focus?.();
    this.lastFocused = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
