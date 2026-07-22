/**
 * Main application entry — navigation, theme, scroll effects.
 */
(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";

  function init() {
    Render.init();
    Terminal.init();
    initTheme();
    initNavigation();
    initScrollReveal();
    initActiveNav();
    initBotMascot();
  }

  /* Theme */
  function initTheme() {
    const toggle = document.getElementById("theme-toggle");
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    } else if (!prefersDark) {
      document.documentElement.setAttribute("data-theme", "light");
    }

    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* Mobile navigation */
  function initNavigation() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    const links = menu.querySelectorAll(".nav__link");

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("nav__menu--open");
      document.body.style.overflow = isOpen ? "" : "hidden";
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("nav__menu--open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Scroll reveal */
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* Active nav link on scroll */
  function initActiveNav() {
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav__link");

    function onScroll() {
      const scrollY = window.scrollY;
      header.classList.toggle("header--scrolled", scrollY > 50);

      let current = "";
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (scrollY >= top) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle(
          "nav__link--active",
          link.getAttribute("href") === `#${current}`
        );
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Bot Mascot Click Interactions */
  function initBotMascot() {
    const bot = document.getElementById("bot-mascot");
    const bubble = document.getElementById("bot-bubble");
    if (!bot || !bubble) return;

    const phrases = [
      "Hi there! I'm Aditya's helper bot. 🤖",
      "Aditya specializes in .NET Core and Angular/React!",
      "Need a backend or full-stack developer? You're in the right place!",
      "Feel free to click 'Say Hello' to send an email directly!",
      "Check out the featured projects below! 👇",
      "Click the terminal on the hero banner for a tech surprise!"
    ];
    let phraseIndex = 0;
    let timer = null;

    bot.addEventListener("click", () => {
      if (timer) clearTimeout(timer);

      bubble.style.animation = "none";
      bubble.offsetHeight; // force reflow

      bubble.textContent = phrases[phraseIndex];
      phraseIndex = (phraseIndex + 1) % phrases.length;
      
      bubble.style.opacity = "1";
      bubble.style.transform = "scale(1)";
      bubble.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

      timer = setTimeout(() => {
        bubble.style.opacity = "0";
        bubble.style.transform = "scale(0.8)";
      }, 3500);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
