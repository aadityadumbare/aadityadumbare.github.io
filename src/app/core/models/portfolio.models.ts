export type PortfolioMode = 'frontend' | 'backend' | 'fullstack' | 'personal';

/**
 * The visual "vibe" a perspective carries. Every value maps onto a design
 * token, so switching modes re-skins the whole site without touching a
 * component. `tint` feeds the fixed background glow, `blend` tells the WebGL
 * scenes whether additive light reads correctly against the palette.
 */
export interface ModeVibe {
  accent: string;
  accentInk: string;
  accentLight: string;
  accentGlow: string;
  accentSecondary: string;
  gradient: string;
  tint: string;
  blend: 'additive' | 'normal';
}

/** A section a perspective wants on the page, with this mode's own heading. */
export interface ModeSectionConfig {
  id: string;
  label: string;
  title: string;
}

/** Everything the UI needs to know about one perspective. */
export interface ModeConfig {
  key: PortfolioMode;
  label: string;
  shortLabel: string;
  icon: string;
  codename: string;
  description: string;
  title: string;
  tagline: string;
  /** About paragraphs, written for this perspective. */
  about: string[];
  /** Line shown beside the contact form, written for this perspective. */
  contactNote: string;
  vibe: ModeVibe;
  sections: ModeSectionConfig[];
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  avatar: string;
  resume: string;
  available: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface SkillGroup {
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  modes: PortfolioMode[]; // Tagged modes to show this project
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  modes: PortfolioMode[]; // Tagged modes to show this experience
}

export interface TerminalCommand {
  cmd: string;
  output: string;
}

export interface TerminalData {
  commands: TerminalCommand[];
}

export interface PortfolioData {
  profile: ProfileData;
  social: SocialLink[];
  stats: StatItem[];
  skills: SkillGroup;
  projects: ProjectItem[];
  experience: ExperienceItem[];
  terminal: TerminalData;
}

/* ==========================================================================
   PERSONAL SPACE
   The `personal` perspective is not a filter — it is its own place, with its
   own content shape. Media is generative by default (no binary assets), but
   every item accepts a real `src` once one is dropped into the repo.
   ========================================================================== */

export interface NowItem {
  label: string;
  value: string;
}

export interface PersonalStory {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  tag: string;
  accent: boolean;
}

export interface GalleryPhoto {
  id: string;
  caption: string;
  meta: string;
  /** Real image path, or null to render the generative artwork. */
  src: string | null;
  /** Hue (0–360) driving the generative artwork / image treatment. */
  hue: number;
  span: 'normal' | 'wide' | 'tall';
}

export interface VideoClip {
  id: string;
  title: string;
  description: string;
  duration: string;
  tags: string[];
  /** Real video path + poster, or null for the generative placeholder. */
  src: string | null;
  poster: string | null;
  hue: number;
}

export interface SideProject {
  id: string;
  title: string;
  description: string;
  year: string;
  tags: string[];
  url: string | null;
  status: 'shipped' | 'building' | 'exploring';
}

export interface ReadingItem {
  id: string;
  title: string;
  creator: string;
  kind: 'book' | 'album' | 'article' | 'film';
  note: string;
}

export interface PersonalSpace {
  eyebrow: string;
  greeting: string;
  intro: string;
  mood: string;
  nowUpdated: string;
  now: NowItem[];
  stories: PersonalStory[];
  gallery: GalleryPhoto[];
  videos: VideoClip[];
  sideProjects: SideProject[];
  reading: ReadingItem[];
}
