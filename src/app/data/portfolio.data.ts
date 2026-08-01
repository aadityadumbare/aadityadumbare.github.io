import { PortfolioData } from '../core/models/portfolio.models';

export interface AppConfig {
  showModeSwitcher: boolean; // Should the nav switcher dropdown be visible
  enableProjectDeepDives: boolean; // Show project case-study dialogs
  allowKonamiCode: boolean;  // Enable easter eggs like Konami code
  secretPin: string;         // PIN code to unlock secret features / mode editor
}

export const APP_CONFIG: AppConfig = {
  showModeSwitcher: false, // Hidden by default; can be enabled from the admin panel
  enableProjectDeepDives: true, // Enable when project case studies are ready to publish
  allowKonamiCode: true,
  secretPin: "1234"      // Safe and simple default PIN
};

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Aditya Dumbare",
    title: "Full Stack Software Developer",
    tagline: "Results-driven Full Stack Software Developer with 2+ years of experience designing, developing, and maintaining enterprise web applications using .NET, Angular, React, Node.js, SQL Server, and MongoDB.",
    location: "Pune, Maharashtra, India",
    email: "aadityadumbare@gmail.com",
    avatar: "assets/images/profile-portfolio.png",
    resume: "https://drive.google.com/file/d/1SglYVo7w_nCucnqj4su0I7pFQgOE6SAZ/view?usp=sharing",
    available: true,
  },

  social: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/adityadumbare/", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/aadityadumbare", icon: "github" },
    { name: "Email", url: "mailto:aadityadumbare@gmail.com", icon: "email" },
  ],

  stats: [
    { label: "Experience", value: "2+ Yrs" },
    { label: "Projects", value: "10+" },
    { label: "Tech Stack", value: "15+" },
  ],

  skills: {
    backend: [
      "C#",
      ".NET Core",
      "ASP.NET Core",
      "Entity Framework Core",
      "Web API",
      "Java",
      "Spring Boot",
      "Node.js",
      "Express.js",
      "REST APIs",
      "LINQ"
    ],
    frontend: [
      "Angular (8–22)",
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Angular Signals",
      "RxJS",
      "NgRx",
      "Angular Material",
      "Tailwind CSS",
      "Bootstrap"
    ],
    database: [
      "SQL Server",
      "MongoDB",
      "Firebase"
    ],
    devops: [
      "Docker",
      "Git",
      "GitLab",
      "Azure DevOps",
      "Postman",
      "Swagger/OpenAPI",
      "Jira",
      "CI/CD"
    ],
  },

  projects: [
    {
      title: "TransCore (Delaware E-ZPass)",
      description: "Contributed to enterprise backend services and toll collection system integrations. Designed and developed secure RESTful APIs with JWT authentication, role-based authorization, and high-performance SQL query optimizations.",
      image: null,
      tags: [".NET Core", "C#", "SQL Server", "JWT Auth", "Clean Architecture"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
      modes: ["fullstack", "backend"]
    },
    {
      title: "EPSON – E-Procurement & E-Payment",
      description: "Led the migration of EPSON E-Procurement from Angular 12 to Angular 20 and rebuilt the E-Payment platform from Angular 8 to Angular 20. Integrated procurement workflows, secure payment APIs, and high-performance SQL databases.",
      image: null,
      tags: ["Angular (8–22)", ".NET Core", "SQL Server", "Angular Signals", "Web API"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
      modes: ["fullstack", "frontend", "backend"]
    },
    {
      title: "Waayu Food Delivery App",
      description: "Developed full-stack food delivery features including real-time chat with Socket.IO, Firestore notifications, payment gateway integrations (Razorpay, Easebuzz), and ONDC integration during the initial implementation phase.",
      image: null,
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.IO", "ONDC"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
      modes: ["fullstack", "frontend", "backend"]
    },
    {
      title: "CARS (Contract Management System)",
      description: "Developed backend modules and business logic using Java and Spring Boot. Implemented secure REST APIs, contract lifecycle management logic, and integrated SQL databases.",
      image: null,
      tags: ["Java", "Spring Boot", "REST APIs", "SQL"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
      modes: ["fullstack", "backend"]
    },
    {
      title: "Network Solutions (Newfold & Bluehost)",
      description: "Worked on Webpack Module Federation to develop scalable Micro Frontend applications integrating Angular and React modules, with backend enhancements in .NET Core.",
      image: null,
      tags: ["Angular", "React.js", "Webpack", "Micro-Frontends", ".NET Core"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
      modes: ["fullstack", "frontend", "backend"]
    },
    {
      title: "Meridukaan Marketplace",
      description: "Built a responsive MERN stack e-commerce marketplace. Integrated Firebase Authentication and Firestore for real-time marketplace listings, and designed scalable MongoDB collections.",
      image: null,
      tags: ["Angular", "Node.js", "MongoDB", "Firebase"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
      modes: ["fullstack", "frontend"]
    },
    {
      title: "Music Genres Classification",
      description: "A Machine Learning application for automatic music genre classification using facial emotion detection to dynamically recommend music/playlists based on the user's current mood.",
      image: null,
      tags: ["Python", "Machine Learning", "Data Processing"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
      modes: ["fullstack", "personal"]
    },
  ],

  experience: [
    {
      role: "Software Developer",
      company: "Senwell Group Pvt Ltd",
      period: "Aug 2024 — Present",
      description: "Designed and developed enterprise-scale Full Stack applications using Angular (8–22), React, ASP.NET Core, .NET Core, and Microservices. Integrated Next.js pages with SSR/SSG. Rebuilt Angular 8/12 applications to Angular 22 implementing Standalone Components and Angular Signals. Developed backend modules using Java and Spring Boot for the CARS contract management system. Optimized SQL Server queries and handled GitLab CI/CD pipelines.",
      modes: ["fullstack", "frontend", "backend"]
    },
    {
      role: "Executive Software Developer",
      company: "Destek InfoSolutions Pvt Ltd",
      period: "Dec 2023 — Jun 2024",
      description: "Developed single-page applications using Angular 14-17 and React.js. Built Express.js backend REST APIs integrated with MongoDB, Firebase Authentication, and Firestore. Implemented Socket.IO for real-time chat, integrated Razorpay/Easebuzz payment gateways, and contributed ONDC integration for Waayu food delivery.",
      modes: ["fullstack", "frontend", "backend"]
    },
    {
      role: "Intern Software Developer",
      company: "Destek InfoSolutions Pvt Ltd",
      period: "Jun 2023 — Dec 2023",
      description: "Developed web applications using Angular and React. Built responsive layouts with Bootstrap and Angular Material, resolved UI bugs, integrated frontend components with REST APIs, and participated in Agile Scrum sprint workflows.",
      modes: ["fullstack", "frontend", "personal"]
    },
  ],

  terminal: {
    commands: [
      { cmd: "whoami", output: "aditya-dumbare" },
      { cmd: "cat skills.txt", output: ".NET Core · C# · Java · Spring Boot · Angular · React · SQL · MongoDB" },
      { cmd: "dotnet build", output: "Build succeeded. 0 Warning(s) 0 Error(s) (1.1s)" },
      { cmd: "git status", output: "On branch main — ready to deploy 🚀" },
    ],
  },
};
