import { Component, ChangeDetectionStrategy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-recruiter-snapshot',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recruiter-snapshot.component.html',
  styleUrls: ['./recruiter-snapshot.component.scss']
})
export class RecruiterSnapshotComponent {
  private readonly portfolioService = inject(PortfolioService);

  isOpen = signal(false);
  profile = this.portfolioService.profile;
  stats = this.portfolioService.stats;

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
