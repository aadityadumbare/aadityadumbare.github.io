import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ContactComponent } from '../contact/contact.component';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SecretComponent } from '../secret/secret.component';
import { FloatingModeSwitcherComponent } from '../../shared/components/floating-mode-switcher/floating-mode-switcher.component';
import { CursorComponent } from '../../shared/components/cursor/cursor.component';
import { ToastsComponent } from '../../shared/components/toasts/toasts.component';
import { CommandPaletteComponent } from '../../shared/components/command-palette/command-palette.component';
import { DiscoveriesPanelComponent } from '../../shared/components/discoveries-panel/discoveries-panel.component';
import { PortfolioService } from '../../core/services/portfolio.service';
import { MotionService } from '../../core/services/motion.service';
import { KeyboardSecretsService } from '../../core/services/keyboard-secrets.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    NavComponent,
    FooterComponent,
    SecretComponent,
    FloatingModeSwitcherComponent,
    CursorComponent,
    ToastsComponent,
    CommandPaletteComponent,
    DiscoveriesPanelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gradient" aria-hidden="true"></div>
    <div class="bg-grid" aria-hidden="true"></div>

    <app-cursor></app-cursor>
    <app-command-palette></app-command-palette>
    <app-discoveries-panel></app-discoveries-panel>
    <app-toasts></app-toasts>

    <app-nav></app-nav>

    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-skills></app-skills>
      <app-projects></app-projects>
      <app-experience></app-experience>
      <app-contact></app-contact>
    </main>

    <app-footer></app-footer>
    <app-floating-mode-switcher></app-floating-mode-switcher>
    <app-secret></app-secret>
  `
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  // Instantiated here so their global listeners come up with the page.
  private readonly motion = inject(MotionService);
  private readonly keyboardSecrets = inject(KeyboardSecretsService);

  ngOnInit(): void {
    if (this.router.url.includes('/secret')) {
      this.portfolioService.unlockSecret();
    }
  }
}
