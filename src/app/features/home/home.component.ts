import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
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
import { RobotMascotComponent } from '../../shared/components/robot-mascot/robot-mascot.component';
import { FloatingModeSwitcherComponent } from '../../shared/components/floating-mode-switcher/floating-mode-switcher.component';
import { PortfolioService } from '../../core/services/portfolio.service';

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
    RobotMascotComponent,
    FloatingModeSwitcherComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gradient" aria-hidden="true"></div>
    <div class="bg-grid" aria-hidden="true"></div>

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
    <app-robot-mascot></app-robot-mascot>
    <app-floating-mode-switcher></app-floating-mode-switcher>
    <app-secret></app-secret>
  `
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

  ngOnInit() {
    if (this.router.url.includes('/secret')) {
      this.portfolioService.unlockSecret();
    }
  }
}
