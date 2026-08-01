export type PortfolioMode = 'frontend' | 'backend' | 'fullstack' | 'personal';

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
