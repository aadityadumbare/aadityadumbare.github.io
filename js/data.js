/**
 * Portfolio content — edit this file to personalize your site.
 * All text, links, and project data live here for easy updates.
 */
const PORTFOLIO_DATA = {
  profile: {
    name: "Aditya Dumbare",
    title: "Software Developer",
    tagline: "Results-driven Software Developer with 2+ years of experience building scalable enterprise applications using .NET, Angular, React, and Node.js.",
    location: "Pune, Maharashtra, India",
    email: "aadityadumbare@gmail.com",
    avatar: "assets/images/avatar.svg",
    resume: "https://drive.google.com/file/d/12PBfy8qAs19_0rsHZ9HFhsjbwAJW4DRV/view?usp=drive_link",
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
      ".NET Core",
      "ASP.NET Core",
      "C#",
      "Entity Framework",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Microservices"
    ],
    frontend: [
      "Angular",
      "React",
      "TypeScript",
      "JavaScript",
      "RxJS",
      "NgRx",
      "Tailwind CSS",
      "Bootstrap",
      "HTML5",
      "CSS3"
    ],
    database: [
      "SQL Server",
      "MongoDB",
      "Firebase",
      "Firestore"
    ],
    devops: [
      "Docker",
      "Git",
      "GitLab",
      "Azure DevOps",
      "CI/CD",
      "Postman",
      "Jira"
    ],
  },

  projects: [
    {
      title: "EPSON (Eprocurement & Epayment)",
      description: "Designed, developed, and maintained scalable ASP.NET Core Web APIs and modular backend components for an enterprise procurement and payment solution. Optimized database queries, caching, and integrated secure payment gateways.",
      image: "assets/images/project-api.svg",
      tags: [".NET Core", "ASP.NET Core", "SQL Server", "Angular", "Web API"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
    },
    {
      title: "Waayu Food Delivery",
      description: "Full-stack food delivery application built on the MERN stack. Implemented real-time chat with Socket.IO, integrated payment gateways (Razorpay, Easebuzz), and Firestore for real-time notifications.",
      image: "assets/images/project-devflow.svg",
      tags: ["React", "Node.js", "Express.js", "MongoDB", "Socket.IO"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
    },
    {
      title: "Transcore (Delaware E-ZPass)",
      description: "Contributed to the Delaware E-ZPass electronic toll collection system. Implemented secure RESTful APIs with JWT authentication, optimized high-performance database queries, and designed robust backend services.",
      image: "assets/images/project-taskforge.svg",
      tags: [".NET Core", "C#", "SQL Server", "JWT Auth", "Clean Architecture"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
    },
    {
      title: "Meridukaan Marketplace",
      description: "An e-commerce marketplace platform built using the MERN stack. Designed scalable MongoDB database schemas, built responsive web pages, and implemented Firebase Authentication and Firestore features.",
      image: "assets/images/project-weather.svg",
      tags: ["Angular", "Node.js", "Express.js", "MongoDB", "Firebase"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
    },
    {
      title: "Network Solutions (NewFold)",
      description: "Worked on frontend features and performance improvements. Developed micro-frontend components using Webpack Module Federation to integrate multiple Angular and React applications into a unified platform.",
      image: "assets/images/project-api.svg",
      tags: ["Angular", "React", "Webpack", "Micro-Frontends"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
    },
    {
      title: "Music Genres Classification",
      description: "A Machine Learning application for automatic music genre classification using facial emotion detection to dynamically recommend music/playlists based on the user's current mood.",
      image: "assets/images/project-taskforge.svg",
      tags: ["Python", "Machine Learning", "Data Processing"],
      liveUrl: null,
      repoUrl: null,
      featured: false,
    },
  ],

  experience: [
    {
      role: "Software Developer",
      company: "Senwell Group Pvt Ltd",
      period: "Aug 2024 — Present",
      description: "Developed and maintained scalable ASP.NET Core Web APIs and backend solutions following Clean Architecture and Dependency Injection. Optimized SQL Server queries and indexes for high performance. Built responsive enterprise UIs and micro-frontends with Angular, React, RxJS, NgRx, and Webpack Module Federation. Managed GitLab CI/CD pipelines and peer reviews.",
    },
    {
      role: "Executive Software Developer",
      company: "Destek InfoSolutions Pvt Ltd",
      period: "Dec 2023 — Jun 2024",
      description: "Built modern single-page applications using Angular 14-17 and React. Built Express.js backend REST APIs integrated with MongoDB, Firebase Authentication, and Firestore. Implemented Socket.IO for real-time chat, and payment gateways (Razorpay, Easebuzz). Optimized application bundle size, lazy loading, and rendering performance.",
    },
    {
      role: "Intern Software Developer",
      company: "Destek InfoSolutions Pvt Ltd",
      period: "Jun 2023 — Dec 2023",
      description: "Assisted in frontend web development using Angular, TypeScript, and Angular Material. Integrated frontend components with REST APIs, resolved UI bugs, and gained hands-on experience in version control (Git) and Agile sprint workflows.",
    },
  ],

  terminal: {
    commands: [
      { cmd: "whoami", output: "aditya-dumbare" },
      { cmd: "cat skills.txt", output: ".NET Core · C# · Angular · React · Node.js · SQL" },
      { cmd: "dotnet build", output: "Build succeeded. 0 Warning(s) 0 Error(s) (1.2s)" },
      { cmd: "git status", output: "On branch main — ready to deploy 🚀" },
    ],
  },
};
