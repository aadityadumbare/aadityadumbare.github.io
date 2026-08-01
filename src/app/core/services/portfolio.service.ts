import { Injectable, signal, computed, effect } from '@angular/core';
import { PortfolioMode, PortfolioData, SkillGroup, ProjectItem, ExperienceItem } from '../models/portfolio.models';
import { PORTFOLIO_DATA, APP_CONFIG, AppConfig } from '../../data/portfolio.data';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // Config
  config = signal<AppConfig>(APP_CONFIG);

  // Active Mode (initially read from query parameters or localStorage or fallback to fullstack)
  activeMode = signal<PortfolioMode>('fullstack');

  // Secret unlock state (e.g. Konami code or secret route)
  isSecretUnlocked = signal<boolean>(false);

  // Base raw data
  private rawData = PORTFOLIO_DATA;

  // Filtered profile based on mode
  profile = computed(() => {
    const base = this.rawData.profile;
    const mode = this.activeMode();
    let title = base.title;
    let tagline = base.tagline;

    if (mode === 'frontend') {
      title = "Frontend Developer";
      tagline = "Results-driven Frontend Developer with 2+ years of experience designing, developing, and maintaining high-performance web applications using Angular, React.js, Next.js, and modern UI libraries.";
    } else if (mode === 'backend') {
      title = "Backend / .NET Developer";
      tagline = "Results-driven Backend Developer with 2+ years of experience designing, developing, and maintaining scalable enterprise APIs, microservices, and databases using .NET Core, C#, Java, Spring Boot, and SQL Server.";
    } else if (mode === 'personal') {
      title = "Software Developer & Tech Enthusiast";
      tagline = "Welcome to my personal corner! I am a software engineer passionate about web development, machine learning, and building cool creative interactive tech projects.";
    }

    return { ...base, title, tagline };
  });

  // Filtered skills based on mode
  skills = computed<SkillGroup>(() => {
    const mode = this.activeMode();
    const allSkills = this.rawData.skills;

    if (mode === 'frontend') {
      return {
        frontend: allSkills.frontend,
        backend: [],
        database: [],
        devops: allSkills.devops.filter(s => ['Git', 'GitLab', 'Postman', 'Jira'].includes(s))
      };
    } else if (mode === 'backend') {
      return {
        frontend: [],
        backend: allSkills.backend,
        database: allSkills.database,
        devops: allSkills.devops.filter(s => ['Docker', 'Git', 'GitLab', 'Azure DevOps', 'Swagger/OpenAPI', 'CI/CD'].includes(s))
      };
    }

    return allSkills;
  });

  // Filtered projects
  projects = computed<ProjectItem[]>(() => {
    const mode = this.activeMode();
    return this.rawData.projects.filter(p => p.modes.includes(mode));
  });

  // Filtered experience
  experience = computed<ExperienceItem[]>(() => {
    const mode = this.activeMode();
    return this.rawData.experience.filter(e => e.modes.includes(mode));
  });

  // Social links & stats
  social = signal(this.rawData.social);
  stats = signal(this.rawData.stats);
  terminal = signal(this.rawData.terminal);

  constructor() {
    // Initial configuration check
    this.detectModeFromUrl();
    
    // Auto-save active mode in localStorage
    effect(() => {
      localStorage.setItem('portfolio_mode', this.activeMode());
    });
  }

  setMode(mode: PortfolioMode) {
    this.activeMode.set(mode);
  }

  detectModeFromUrl() {
    // We can read parameters from window.location directly (safe for early detection)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryMode = params.get('mode') as PortfolioMode;
      const validModes: PortfolioMode[] = ['frontend', 'backend', 'fullstack', 'personal'];

      if (queryMode && validModes.includes(queryMode)) {
        this.activeMode.set(queryMode);
        return;
      }
    } catch (e) {
      console.warn('Could not parse query params', e);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem('portfolio_mode') as PortfolioMode;
    if (saved) {
      this.activeMode.set(saved);
    }
  }

  toggleModeSwitcher(visible: boolean) {
    this.config.update(c => ({ ...c, showModeSwitcher: visible }));
  }

  toggleProjectDeepDives(visible: boolean) {
    this.config.update(c => ({ ...c, enableProjectDeepDives: visible }));
  }

  unlockSecret() {
    this.isSecretUnlocked.set(true);
  }

  lockSecret() {
    this.isSecretUnlocked.set(false);
  }
}
