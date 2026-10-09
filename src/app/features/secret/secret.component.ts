import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  signal
} from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { MotionService } from '../../core/services/motion.service';
import { AchievementService } from '../../core/services/achievement.service';

@Component({
  selector: 'app-secret',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent implements AfterViewInit, OnDestroy {
  readonly portfolioService = inject(PortfolioService);
  readonly achievements = inject(AchievementService);
  private readonly motion = inject(MotionService);

  pin = signal<string>('');
  isAuthorized = signal<boolean>(false);
  errorMessage = signal<string>('');

  readonly modes = this.portfolioService.modes;

  accentColors = [
    { name: 'Signal Lime (Default)', hex: '#d4ff00' },
    { name: 'Ink White', hex: '#f5f5f4' },
    { name: 'Signal Orange', hex: '#ff6b35' },
    { name: 'Cyber Cyan', hex: '#22d3ee' },
    { name: 'Hot Magenta', hex: '#ff2d78' }
  ];

  @ViewChild('pinInput') pinInput?: ElementRef<HTMLInputElement>;

  constructor() {
    // Freeze page scroll (and the hero's 3D loop) while the panel is open.
    effect(() => {
      if (this.portfolioService.isSecretUnlocked()) {
        this.motion.lockScroll('secret-panel');
      } else {
        this.motion.unlockScroll('secret-panel');
      }
    });
  }

  get portfolio(): PortfolioService {
    return this.portfolioService;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.pinInput?.nativeElement.focus(), 100);
  }

  ngOnDestroy(): void {
    this.motion.unlockScroll('secret-panel');
  }

  onPinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pin.set(input.value);
    this.errorMessage.set('');

    const targetPin = this.portfolioService.config().secretPin;
    if (input.value === targetPin) {
      this.isAuthorized.set(true);
    } else if (input.value.length >= targetPin.length) {
      this.errorMessage.set('Invalid secure PIN. Access denied.');
      this.pin.set('');
      input.value = '';
    }
  }

  setAccentColor(colorHex: string): void {
    this.portfolioService.setAccentOverride(colorHex);
  }

  resetAccent(): void {
    this.portfolioService.setAccentOverride(null);
  }

  toggleSwitcher(): void {
    this.portfolioService.toggleModeSwitcher(!this.portfolioService.config().showModeSwitcher);
  }

  toggleProjectDeepDives(): void {
    this.portfolioService.toggleProjectDeepDives(!this.portfolioService.config().enableProjectDeepDives);
  }

  resetDiscoveries(): void {
    this.achievements.reset();
    this.achievements.notify('Discoveries reset', 'The hunt starts again.', 'System');
  }

  closePanel(): void {
    this.portfolioService.lockSecret();
    this.isAuthorized.set(false);
    this.pin.set('');
    this.errorMessage.set('');
  }
}
