/**
 * DOM rendering from PORTFOLIO_DATA.
 */
const Render = {
  init() {
    this.profile();
    this.stats();
    this.social();
    this.skills();
    this.projects();
    this.experience();
    this.footer();
  },

  profile() {
    const { profile } = PORTFOLIO_DATA;

    document.title = `${profile.name} | ${profile.title}`;
    document.getElementById("hero-name").textContent = profile.name;
    document.getElementById("hero-title").textContent = profile.title;
    document.getElementById("hero-tagline").textContent = profile.tagline;
    document.getElementById("about-name").textContent = profile.name;
    document.getElementById("about-avatar").src = profile.avatar;
    document.getElementById("about-avatar").alt = `${profile.name} profile photo`;
    document.getElementById("footer-name").textContent = profile.name;

    const locationEl = document.getElementById("about-location");
    locationEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
      ${profile.location}
    `;

    const availableEl = document.getElementById("hero-available");
    availableEl.textContent = profile.available
      ? "Available for work"
      : "Currently unavailable";

    const resumeBtn = document.getElementById("hero-resume");
    resumeBtn.href = profile.resume;
    resumeBtn.setAttribute("download", "");

    const contactEmail = document.getElementById("contact-email");
    contactEmail.href = `mailto:${profile.email}`;
    contactEmail.textContent = "Say Hello";
  },

  stats() {
    const container = document.getElementById("hero-stats");
    container.innerHTML = PORTFOLIO_DATA.stats
      .map(
        (stat) => `
        <div class="hero__stat">
          <div class="hero__stat-value">${stat.value}</div>
          <div class="hero__stat-label">${stat.label}</div>
        </div>
      `
      )
      .join("");
  },

  socialLink(item) {
    const icon = ICONS[item.icon] || ICONS.email;
    return `
      <a href="${item.url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${item.name}">
        ${icon}
      </a>
    `;
  },

  social() {
    const links = PORTFOLIO_DATA.social.map((s) => this.socialLink(s)).join("");

    document.getElementById("about-social").innerHTML = links;
    document.getElementById("contact-social").innerHTML = links;
  },

  skills() {
    const container = document.getElementById("skills-grid");
    const { skills } = PORTFOLIO_DATA;

    container.innerHTML = Object.entries(skills)
      .map(
        ([key, tags]) => `
        <div class="skill-card reveal">
          <div class="skill-card__icon">${SKILL_ICONS[key]}</div>
          <h3 class="skill-card__title">${SKILL_LABELS[key]}</h3>
          <div class="skill-card__tags">
            ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </div>
      `
      )
      .join("");
  },

  projects() {
    const container = document.getElementById("projects-grid");

    container.innerHTML = PORTFOLIO_DATA.projects
      .map((project) => {
        const featuredClass = project.featured ? "project-card--featured" : "";
        const liveLink = project.liveUrl
          ? `<a href="${project.liveUrl}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="Live demo">${ICONS.external}</a>`
          : "";
        const repoLink = project.repoUrl
          ? `<a href="${project.repoUrl}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="Source code">${ICONS.github}</a>`
          : "";

        return `
          <article class="project-card reveal ${featuredClass}">
            <div class="project-card__image">
              <img src="${project.image}" alt="${project.title} preview" loading="lazy" width="600" height="338">
              <div class="project-card__overlay">
                ${liveLink}
                ${repoLink}
              </div>
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">${project.title}</h3>
              <p class="project-card__desc">${project.description}</p>
              <div class="project-card__tags">
                ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  },

  experience() {
    const container = document.getElementById("timeline");

    container.innerHTML = PORTFOLIO_DATA.experience
      .map(
        (item) => `
        <div class="timeline__item reveal">
          <div class="timeline__dot"></div>
          <h3 class="timeline__role">${item.role}</h3>
          <p class="timeline__company">${item.company}</p>
          <p class="timeline__period">${item.period}</p>
          <p class="timeline__desc">${item.description}</p>
        </div>
      `
      )
      .join("");
  },

  footer() {
    document.getElementById("footer-year").textContent = new Date().getFullYear();
  },
};
