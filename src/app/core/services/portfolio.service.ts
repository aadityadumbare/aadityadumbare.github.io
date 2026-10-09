import { Injectable, signal, computed, effect } from '@angular/core';
import {
  PortfolioMode,
  SkillGroup,
  ProjectItem,
  ExperienceItem,
  ModeConfig,
  ModeSectionConfig,
  PersonalSpace
} from '../models/portfolio.models';
import { PORTFOLIO_DATA, APP_CONFIG, AppConfig } from '../../data/portfolio.data';
import { MODES, MODE_REGISTRY, isPortfolioMode } from '../../data/modes.data';

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

  /** Manual accent override set from the admin panel; null means "use the mode's vibe". */
  accentOverride = signal<string | null>(null);

  /** Base raw data */
  private rawData = PORTFOLIO_DATA;

  /**
   * Whether the "Paper" (light) theme is active. Mirrored from the attribute
   * ThemeService owns rather than injecting the service, so this stays usable
   * wherever there is no matchMedia (e.g. tests, SSR).
   */
  private readonly lightTheme = signal(false);

  /** Every perspective, in display order. Single source of truth for the UI. */
  readonly modes: ModeConfig[] = MODES;

  /** The full definition (identity + vibe + sections) of the active perspective. */
  readonly activeModeConfig = computed<ModeConfig>(() => MODE_REGISTRY[this.activeMode()]);

  /** Ordered sections the active perspective wants on the page. */
  readonly sections = computed<ModeSectionConfig[]>(() => this.activeModeConfig().sections);

  readonly isPersonal = computed(() => this.activeMode() === 'personal');

  /** About paragraphs written for the active perspective. */
  readonly about = computed<string[]>(() => this.activeModeConfig().about);

  /** Filtered profile based on mode */
  profile = computed(() => {
    const base = this.rawData.profile;
    const mode = this.activeModeConfig();

    return { ...base, title: mode.title, tagline: mode.tagline };
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

  /** Loaded on demand the first time the personal perspective is opened. */
  private readonly personalData = signal<PersonalSpace | null>(null);
  private personalLoading = false;
  readonly personal = computed<PersonalSpace>(() => this.personalData() ?? EMPTY_PERSONAL_SPACE);

  constructor() {
    // Initial configuration check
    this.detectModeFromUrl();

    // Mirror the theme attribute (owned by ThemeService) without depending on it.
    const root = document.documentElement;
    this.lightTheme.set(root.getAttribute('data-theme') === 'light');
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(() => this.lightTheme.set(root.getAttribute('data-theme') === 'light')).observe(root, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    // One effect owns every vibe token. The active perspective supplies the
    // palette; a manual accent override (admin panel) layers on top. Light
    // ("Paper") mode darkens the hue so it stays readable on cream, so the two
    // systems can never disagree.
    effect(() => {
      const mode = this.activeModeConfig();
      const override = this.accentOverride();
      const isLight = this.lightTheme();
      const root = document.documentElement;

      root.setAttribute('data-mode', mode.key);

      const base = override ?? mode.vibe.accent;
      const accent = isLight ? this.shade(base, 28) : base;
      const accentLight = isLight ? this.shade(base, 18) : (override ? this.lightenColor(base, 20) : mode.vibe.accentLight);
      const accentGlow = this.hexToRgba(accent, isLight ? 0.22 : 0.36);

      root.style.setProperty('--color-accent', accent);
      root.style.setProperty('--color-accent-ink', isLight ? '#ffffff' : mode.vibe.accentInk);
      root.style.setProperty('--color-accent-light', accentLight);
      root.style.setProperty('--color-accent-glow', accentGlow);
      root.style.setProperty('--color-accent-secondary', isLight ? this.shade(base, 22) : mode.vibe.accentSecondary);
      root.style.setProperty('--mode-tint', isLight ? this.hexToRgba(accent, 0.09) : mode.vibe.tint);
      root.style.setProperty('--mode-blend', mode.vibe.blend);
    });

    // Auto-save active mode in localStorage
    effect(() => {
      localStorage.setItem('portfolio_mode', this.activeMode());
    });

    // Fetch the personal content the first time that perspective is opened.
    effect(() => {
      if (this.isPersonal() && !this.personalData() && !this.personalLoading) {
        void this.loadPersonal();
      }
    });
  }

  private async loadPersonal(): Promise<void> {
    this.personalLoading = true;
    try {
      const { PERSONAL_SPACE } = await import('../../data/personal.data');
      this.personalData.set(PERSONAL_SPACE);
    } finally {
      this.personalLoading = false;
    }
  }

  setMode(mode: PortfolioMode) {
    this.accentOverride.set(null);
    this.activeMode.set(mode);
  }

  /** Heading (label + title) the active perspective wants for a section id. */
  sectionHeader(id: string): ModeSectionConfig {
    return this.sections().find((section) => section.id === id) ?? { id, label: id, title: id };
  }

  setAccentOverride(hex: string | null) {
    this.accentOverride.set(hex);
  }

  detectModeFromUrl() {
    // We can read parameters from window.location directly (safe for early detection)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryMode = params.get('mode');

      if (isPortfolioMode(queryMode)) {
        this.activeMode.set(queryMode);
        return;
      }
    } catch (e) {
      console.warn('Could not parse query params', e);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem('portfolio_mode');
    if (isPortfolioMode(saved)) {
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

  private lightenColor(hex: string, percent: number): string {
    return this.mix(hex, '#ffffff', Math.min(1, Math.max(0, percent / 100)));
  }

  /** Darken a hex toward black by a percentage (0–100). */
  private shade(hex: string, percent: number): string {
    return this.mix(hex, '#000000', Math.min(1, Math.max(0, percent / 100)));
  }

  private mix(hex: string, target: string, amount: number): string {
    const from = this.parseHex(hex);
    const to = this.parseHex(target);
    const channel = (a: number, b: number): number => Math.round(a + (b - a) * amount);
    const value =
      (0x1000000 + channel(from[0], to[0]) * 0x10000 + channel(from[1], to[1]) * 0x100 + channel(from[2], to[2]))
        .toString(16)
        .slice(1);
    return `#${value}`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const [r, g, b] = this.parseHex(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private parseHex(hex: string): [number, number, number] {
    const normalized = hex.replace('#', '').trim();
    const full = normalized.length === 3 ? normalized.split('').map((c) => c + c).join('') : normalized;
    const num = parseInt(full.slice(0, 6) || '000000', 16);
    return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
  }
}

/** Shown until the personal content chunk resolves — keeps templates total. */
const EMPTY_PERSONAL_SPACE: PersonalSpace = {
  eyebrow: '',
  greeting: '',
  intro: '',
  mood: '',
  nowUpdated: '',
  now: [],
  stories: [],
  gallery: [],
  videos: [],
  sideProjects: [],
  reading: []
};
