/**
 * Animated terminal component in the hero section.
 */
const Terminal = {
  container: null,
  body: null,
  lineIndex: 0,
  charIndex: 0,
  isTyping: false,
  commands: [],

  init() {
    this.container = document.getElementById("terminal");
    if (!this.container) return;

    this.commands = PORTFOLIO_DATA.terminal.commands;
    this.renderShell();
    this.body = this.container.querySelector(".terminal__body");
    this.typeNext();
  },

  renderShell() {
    this.container.innerHTML = `
      <div class="terminal__header">
        <span class="terminal__dot terminal__dot--red"></span>
        <span class="terminal__dot terminal__dot--yellow"></span>
        <span class="terminal__dot terminal__dot--green"></span>
        <span class="terminal__title">~/portfolio</span>
      </div>
      <div class="terminal__body"></div>
    `;
  },

  typeNext() {
    if (this.lineIndex >= this.commands.length) {
      this.lineIndex = 0;
      setTimeout(() => {
        this.body.innerHTML = "";
        this.typeNext();
      }, 3000);
      return;
    }

    const { cmd, output } = this.commands[this.lineIndex];
    const line = document.createElement("div");
    line.className = "terminal__line";
    line.innerHTML = `<span class="terminal__prompt">$ </span><span class="terminal__cmd"></span>`;
    this.body.appendChild(line);

    const cmdEl = line.querySelector(".terminal__cmd");
    this.typeText(cmdEl, cmd, () => {
      const outputEl = document.createElement("div");
      outputEl.className = "terminal__output";
      outputEl.textContent = output;
      this.body.appendChild(outputEl);
      this.body.scrollTop = this.body.scrollHeight;

      this.lineIndex++;
      setTimeout(() => this.typeNext(), 600);
    });
  },

  typeText(element, text, callback) {
    let i = 0;
    const speed = 50;

    const type = () => {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        this.body.scrollTop = this.body.scrollHeight;
        setTimeout(type, speed);
      } else if (callback) {
        setTimeout(callback, 300);
      }
    };

    type();
  },
};
