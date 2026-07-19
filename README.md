# Portfolio — GitHub Pages

A fast, dependency-free full stack developer portfolio. Pure HTML, CSS, and JavaScript — no build step, no npm, no frameworks.

**Live at:** `https://yourusername.github.io`

---

## Quick Start (GitHub Pages)

### 1. Create the repository

Create a new repo named **`yourusername.github.io`** (replace `yourusername` with your GitHub username).

### 2. Push this project

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Save — your site will be live in ~1 minute

---

## Customize Your Content

All personal data lives in one file:

```
js/data.js
```

Edit these sections:

| Section    | What to update                          |
|-----------|------------------------------------------|
| `profile` | Name, title, email, location, resume path |
| `social`  | GitHub, LinkedIn, Twitter links          |
| `stats`   | Your numbers                             |
| `skills`  | Tech stack by category                 |
| `projects`| Project cards with links and tags        |
| `experience` | Work history                        |

### Assets to replace

| File | Purpose |
|------|---------|
| `assets/images/avatar.svg` | Your profile photo (use `.jpg` or `.png` and update path in `data.js`) |
| `assets/resume/resume.pdf` | Your resume PDF |
| `assets/images/favicon.svg` | Browser tab icon |

---

## Project Structure

```
portfolio/
├── index.html              # Main page
├── css/
│   ├── variables.css       # Design tokens & theming
│   ├── base.css            # Reset & global styles
│   ├── layout.css          # Sections & responsive layout
│   ├── components.css      # UI components
│   └── animations.css      # Keyframes & motion
├── js/
│   ├── data.js             # ★ All your content here
│   ├── icons.js            # SVG icon definitions
│   ├── render.js           # DOM rendering logic
│   ├── terminal.js         # Hero terminal animation
│   └── main.js             # App init (theme, nav, scroll)
└── assets/
    ├── images/             # Images & project thumbnails
    └── resume/             # Resume PDF
```

---

## Features

- Fully responsive (mobile, tablet, desktop)
- Dark / light theme with persistence
- Animated terminal in hero section
- Scroll reveal animations
- Accessible (skip link, ARIA labels, keyboard focus)
- Zero dependencies — works offline
- SEO meta tags included

---

## Local Preview

Open `index.html` directly in a browser, or use any static server:

```bash
# Python
python -m http.server 8080

# Node (if installed)
npx serve .
```

Then visit `http://localhost:8080`

---

## License

MIT — use freely for your personal portfolio.
