import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Generative artwork: a slow, hue-driven gradient composition that stands in
 * for a photograph or a video poster until a real asset is dropped in. Pure CSS
 * and zero bytes of media, so the personal space costs nothing to ship.
 */
@Component({
  selector: 'app-generative-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame" [style.--hue]="hue()">
      <div class="frame__layer frame__layer--a"></div>
      <div class="frame__layer frame__layer--b"></div>
      <div class="frame__grain" aria-hidden="true"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
      }
      .frame {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: #0b0b0e;
      }
      .frame__layer {
        position: absolute;
        inset: -30%;
      }
      .frame__layer--a {
        background: conic-gradient(
          from 0deg,
          hsl(var(--hue) 72% 55%),
          hsl(calc(var(--hue) + 42) 82% 46%),
          hsl(calc(var(--hue) - 34) 80% 62%),
          hsl(var(--hue) 72% 55%)
        );
        filter: blur(32px) saturate(1.25);
        opacity: 0.85;
        animation: frame-spin 26s linear infinite;
      }
      .frame__layer--b {
        background:
          radial-gradient(ellipse 55% 50% at 28% 28%, hsl(calc(var(--hue) + 24) 92% 68% / 0.8), transparent 62%),
          radial-gradient(ellipse 50% 58% at 76% 72%, hsl(calc(var(--hue) - 44) 88% 46% / 0.72), transparent 66%);
        mix-blend-mode: screen;
        animation: frame-drift 19s ease-in-out infinite alternate;
      }
      .frame__grain {
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 3px);
        opacity: 0.3;
        mix-blend-mode: overlay;
      }
      @keyframes frame-spin {
        to {
          transform: rotate(360deg) scale(1.12);
        }
      }
      @keyframes frame-drift {
        from {
          transform: translate3d(-6%, -4%, 0) scale(1.05);
        }
        to {
          transform: translate3d(6%, 5%, 0) scale(1.16);
        }
      }
    `
  ]
})
export class GenerativeFrameComponent {
  readonly hue = input.required<number>();
}
