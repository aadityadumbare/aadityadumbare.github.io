import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Console easter egg — a hello for anyone who opens devtools on a developer's
 * portfolio, plus a nudge towards the two hidden features.
 */
function consoleSignature(): void {
  const mono = 'font-family: ui-monospace, "JetBrains Mono", Consolas, monospace;';
  console.log(
    `%c aditya.dumbare %c full stack developer %c\n\n` +
      `%cAngular 22 · three.js · GSAP · SCSS\n` +
      `Two things are hidden on this page: try the Konami code, or press Ctrl+Shift+L.`,
    `${mono} background:#d4ff00; color:#08080a; font-weight:700; padding:2px 8px; letter-spacing:0.08em;`,
    `${mono} color:#8a8a90; letter-spacing:0.16em; text-transform:uppercase; padding:2px 0;`,
    '',
    `${mono} color:#f5f5f4; line-height:1.7;`
  );
}

consoleSignature();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
