import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  effect,
  inject,
  viewChild
} from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { MotionService } from '../../../core/services/motion.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-recruiter-snapshot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recruiter-snapshot.component.html',
  styleUrls: ['./recruiter-snapshot.component.scss']
})
export class RecruiterSnapshotComponent {
  private readonly portfolioService = inject(PortfolioService);
  private readonly ui = inject(UiService);
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocused: HTMLElement | null = null;

  /** Open state lives in UiService so the palette and typed words can trigger it. */
  readonly isOpen = this.ui.recruiterOpen;

  profile = this.portfolioService.profile;
  stats = this.portfolioService.stats;

  constructor() {
    effect(() => {
      if (this.ui.recruiterOpen()) {
        this.lastFocused = document.activeElement as HTMLElement | null;
        this.motion.lockScroll('recruiter-snapshot');
        this.zone.runOutsideAngular(() => setTimeout(() => this.dialogRef()?.nativeElement.focus()));
      } else {
        this.motion.unlockScroll('recruiter-snapshot');
        this.lastFocused?.focus?.();
        this.lastFocused = null;
      }
    });
  }

  open(): void {
    this.ui.openRecruiter();
  }

  close(): void {
    this.ui.closeRecruiter();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
