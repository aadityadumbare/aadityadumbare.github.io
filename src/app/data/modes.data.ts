import { ModeConfig, PortfolioMode } from '../core/models/portfolio.models';

/**
 * The perspective registry.
 *
 * A "mode" is not just a data filter — it carries its own identity (label,
 * icon, codename), its own visual vibe (accent + tokens) and its own ordered
 * list of sections with per-mode headings. Every switcher, the command
 * palette, the nav and the page itself read from here, so adding or reshaping
 * a perspective is a one-file change.
 */
export const MODE_REGISTRY: Record<PortfolioMode, ModeConfig> = {
  fullstack: {
    key: 'fullstack',
    label: 'Full Stack Developer',
    shortLabel: 'Full Stack',
    icon: '⚡',
    codename: 'Signal Lime',
    description: 'The whole stack — APIs, data, and the interface on top.',
    title: 'Full Stack Software Developer',
    tagline:
      'Results-driven Full Stack Software Developer with 2+ years of experience designing, developing, and maintaining enterprise web applications using .NET, Angular, React, Node.js, SQL Server, and MongoDB.',
    about: [
      "Hello! I'm Aditya, a results-driven Software Developer based in Pune, India. I specialize in building secure, scalable, and high-performance applications across the entire stack.",
      'With over 2 years of professional experience, I have partnered with global enterprise clients including EPSON, TransCore (Delaware E-ZPass), and Network Solutions (Newfold & Bluehost) to engineer robust APIs, microservices, and modern frontend architectures.',
      'I am highly proficient in the Microsoft .NET ecosystem, Angular (8–22), React, Java, Spring Boot, and database engines like SQL Server and MongoDB. I enjoy turning complex problems into elegant, responsive web solutions.'
    ],
    contactNote:
      "I'm currently open to Full Stack, Frontend, or Backend developer roles. Leave your details and I'll get back to you, or email me directly.",
    vibe: {
      accent: '#d4ff00',
      accentInk: '#08080a',
      accentLight: '#e2ff5c',
      accentGlow: 'rgba(212, 255, 0, 0.32)',
      accentSecondary: '#d4ff00',
      gradient: 'linear-gradient(135deg, #d4ff00 0%, #b9e000 100%)',
      tint: 'rgba(212, 255, 0, 0.07)',
      blend: 'additive'
    },
    sections: [
      { id: 'about', label: '01 / About', title: 'Who I am' },
      { id: 'skills', label: '02 / Capabilities', title: 'What I build with' },
      { id: 'projects', label: '03 / Selected work', title: "What I've built" },
      { id: 'experience', label: '04 / Experience', title: "Where I've worked" },
      { id: 'contact', label: '05 / Contact', title: "Let's talk" }
    ]
  },

  frontend: {
    key: 'frontend',
    label: 'Frontend Developer',
    shortLabel: 'Frontend',
    icon: '🎨',
    codename: 'Signal Violet',
    description: 'Interfaces, interaction, and the feel of a product.',
    title: 'Frontend Developer',
    tagline:
      'Results-driven Frontend Developer with 2+ years of experience designing, developing, and maintaining high-performance web applications using Angular, React.js, Next.js, and modern UI libraries.',
    about: [
      "I'm Aditya — a frontend developer who cares about how software feels, not only whether it works. Based in Pune, India.",
      'Over 2+ years I have modernised large Angular applications (including a full Angular 8→22 migration), crafted interfaces in React and Next.js, and obsessed over motion, accessibility, and the small details that make a product feel considered.',
      'I work comfortably in TypeScript, Angular Signals, RxJS, and design systems, and I like being the person who makes the last 10% — the part users actually notice — feel effortless.'
    ],
    contactNote:
      "I'm open to Frontend and Full Stack roles where craft matters. Tell me about your product, or email me directly.",
    vibe: {
      accent: '#8b5cf6',
      accentInk: '#0a0812',
      accentLight: '#a78bfa',
      accentGlow: 'rgba(139, 92, 246, 0.38)',
      accentSecondary: '#22d3ee',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)',
      tint: 'rgba(139, 92, 246, 0.10)',
      blend: 'additive'
    },
    sections: [
      { id: 'about', label: '01 / Profile', title: 'Design-minded engineer' },
      { id: 'skills', label: '02 / Frontend stack', title: 'What I craft with' },
      { id: 'projects', label: '03 / Interfaces', title: "Products I've shipped" },
      { id: 'experience', label: '04 / Track record', title: "Where I've delivered" },
      { id: 'contact', label: '05 / Contact', title: "Let's talk" }
    ]
  },

  backend: {
    key: 'backend',
    label: 'Backend / .NET',
    shortLabel: 'Backend',
    icon: '⚙️',
    codename: 'Signal Cyan',
    description: 'Services, data, and the systems that hold everything up.',
    title: 'Backend / .NET Developer',
    tagline:
      'Results-driven Backend Developer with 2+ years of experience designing, developing, and maintaining scalable enterprise APIs, microservices, and databases using .NET Core, C#, Java, Spring Boot, and SQL Server.',
    about: [
      "I'm Aditya — a backend engineer based in Pune, India, who likes systems that stay calm under pressure.",
      'With 2+ years building enterprise platforms, I have designed secure REST APIs, microservices, and data layers in .NET Core, C#, Java, and Spring Boot — including toll-collection integrations and contract-management systems where correctness is not optional.',
      'I am at home in SQL Server and MongoDB, fluent in clean architecture and JWT/OAuth, and I care about query performance, clear contracts, and services that are easy to reason about at 3 a.m.'
    ],
    contactNote:
      "I'm open to Backend and Full Stack roles on systems that need to hold up. Tell me what you're building, or email me directly.",
    vibe: {
      accent: '#22d3ee',
      accentInk: '#04141a',
      accentLight: '#67e8f9',
      accentGlow: 'rgba(34, 211, 238, 0.34)',
      accentSecondary: '#3b82f6',
      gradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)',
      tint: 'rgba(34, 211, 238, 0.09)',
      blend: 'additive'
    },
    sections: [
      { id: 'about', label: '01 / Profile', title: 'Systems-minded engineer' },
      { id: 'skills', label: '02 / Backend stack', title: 'What I engineer with' },
      { id: 'projects', label: '03 / Systems', title: "Platforms I've built" },
      { id: 'experience', label: '04 / Track record', title: "Where I've delivered" },
      { id: 'contact', label: '05 / Contact', title: "Let's talk" }
    ]
  },

  personal: {
    key: 'personal',
    label: 'Personal Corner',
    shortLabel: 'Personal',
    icon: '☕',
    codename: 'Sunset Amber',
    description: 'The human behind the commits — stories, frames, and side quests.',
    title: 'Software Developer & Tech Enthusiast',
    tagline:
      'Welcome to my personal corner — a place for the things that do not fit on a résumé: stories, photographs, little films, and the projects I build purely because they are fun.',
    about: [
      "Off the clock I am a maker first. I chase sound, light, and small strange ideas, and I collect them here."
    ],
    contactNote:
      'No agenda here — if something in this corner resonated, or you just want to say hi, this reaches me directly.',
    vibe: {
      accent: '#ffb347',
      accentInk: '#1a1204',
      accentLight: '#ffcf80',
      accentGlow: 'rgba(255, 179, 71, 0.34)',
      accentSecondary: '#ff6b9d',
      gradient: 'linear-gradient(135deg, #ffb347 0%, #ff8a5c 100%)',
      tint: 'rgba(255, 145, 90, 0.10)',
      blend: 'additive'
    },
    sections: [
      { id: 'now', label: '01 / Now', title: "What I'm into right now" },
      { id: 'gallery', label: '02 / Frames', title: 'Things I saw and kept' },
      { id: 'films', label: '03 / Motion', title: 'Clips from the quiet hours' },
      { id: 'lab', label: '04 / The lab', title: 'What I tinker with' },
      { id: 'contact', label: '05 / Say hi', title: 'Reach the human' }
    ]
  }
};

/** Ordered list — drives switchers, the palette and any mode iterator. */
export const MODES: ModeConfig[] = [
  MODE_REGISTRY.fullstack,
  MODE_REGISTRY.frontend,
  MODE_REGISTRY.backend,
  MODE_REGISTRY.personal
];

export const MODE_KEYS: PortfolioMode[] = MODES.map((mode) => mode.key);

export function isPortfolioMode(value: string | null): value is PortfolioMode {
  return !!value && (MODE_KEYS as string[]).includes(value);
}
