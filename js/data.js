/**
 * Portfolio content — edit this file to personalize your site.
 * All text, links, and project data live here for easy updates.
 */
const PORTFOLIO_DATA = {
  profile: {
    name: "Aditya",
    title: "Full Stack Developer",
    tagline: "I craft fast, scalable web experiences from pixel to production.",
    location: "India",
    email: "hello@example.com",
    avatar: "assets/images/avatar.svg",
    resume: "assets/resume/resume.pdf",
    available: true,
  },

  social: [
  { name: "GitHub", url: "https://github.com/yourusername", icon: "github" },
  { name: "LinkedIn", url: "https://linkedin.com/in/yourusername", icon: "linkedin" },
  { name: "Twitter", url: "https://twitter.com/yourusername", icon: "twitter" },
  { name: "Email", url: "mailto:hello@example.com", icon: "email" },
  ],

  stats: [
  { label: "Projects", value: "12+" },
  { label: "Years Coding", value: "4+" },
  { label: "Technologies", value: "20+" },
  ],

  skills: {
    frontend: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Vue", "Tailwind"],
    backend: ["Node.js", "Python", "Express", "FastAPI", "REST APIs", "GraphQL"],
    database: ["PostgreSQL", "MongoDB", "Redis", "SQLite"],
    devops: ["Docker", "Git", "CI/CD", "AWS", "Linux", "Nginx"],
  },

  projects: [
  {
    title: "DevFlow",
    description: "Real-time collaboration platform with live cursors, presence, and document sync. Built for teams who ship fast.",
    image: "assets/images/project-devflow.svg",
    tags: ["React", "Node.js", "WebSocket", "PostgreSQL"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/devflow",
    featured: true,
  },
  {
    title: "API Gateway",
    description: "Lightweight API gateway with rate limiting, JWT auth, and request logging. Handles 10k+ req/min.",
    image: "assets/images/project-api.svg",
    tags: ["Node.js", "Redis", "Docker"],
    liveUrl: null,
    repoUrl: "https://github.com/yourusername/api-gateway",
    featured: true,
  },
  {
    title: "TaskForge",
    description: "Kanban-style project manager with drag-and-drop boards, labels, and team assignments.",
    image: "assets/images/project-taskforge.svg",
    tags: ["Vue", "Firebase", "CSS Grid"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/taskforge",
    featured: false,
  },
  {
    title: "WeatherLens",
    description: "Beautiful weather dashboard with 7-day forecasts, maps, and location-based alerts.",
    image: "assets/images/project-weather.svg",
    tags: ["JavaScript", "OpenWeather API", "PWA"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/weatherlens",
    featured: false,
  },
  ],

  experience: [
  {
    role: "Full Stack Developer",
    company: "Tech Company",
    period: "2023 — Present",
    description: "Led development of customer-facing web apps serving 50k+ users. Reduced page load by 40% through optimization.",
  },
  {
    role: "Frontend Developer",
    company: "Startup Inc",
    period: "2021 — 2023",
    description: "Built responsive UIs and design systems. Collaborated with designers to ship pixel-perfect interfaces.",
  },
  {
    role: "Junior Developer",
    company: "Digital Agency",
    period: "2020 — 2021",
    description: "Developed client websites and learned full-stack fundamentals across the JavaScript ecosystem.",
  },
  ],

  terminal: {
    commands: [
    { cmd: "whoami", output: "fullstack-dev" },
    { cmd: "cat skills.txt", output: "JS · React · Node · Python · SQL · Docker" },
    { cmd: "npm run build", output: "✓ Compiled successfully in 1.2s" },
    { cmd: "git status", output: "On branch main — ready to ship 🚀" },
    ],
  },
};
