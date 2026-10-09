import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { MotionService } from '../../../core/services/motion.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { GenerativeFrameComponent } from '../generative-frame/generative-frame.component';
import { VideoClip } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-personal-film',
  standalone: true,
  imports: [SectionHeaderComponent, RevealDirective, GenerativeFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-film.component.html',
  styleUrls: ['./personal-film.component.scss']
})
export class PersonalFilmComponent implements OnDestroy {
  private readonly portfolio = inject(PortfolioService);
  private readonly motion = inject(MotionService);

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocused: HTMLElement | null = null;

  readonly space = this.portfolio.personal;
  readonly header = computed(() => this.portfolio.sectionHeader('films'));
  readonly selected = signal<VideoClip | null>(null);

  open(clip: VideoClip): void {
    this.selected.set(clip);
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.motion.lockScroll('personal-film');
    setTimeout(() => this.dialogRef()?.nativeElement.focus());
  }

  close(): void {
    if (!this.selected()) {
      return;
    }
    this.selected.set(null);
    this.motion.unlockScroll('personal-film');
    this.lastFocused?.focus?.();
    this.lastFocused = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  ngOnDestroy(): void {
    this.motion.unlockScroll('personal-film');
  }
}
