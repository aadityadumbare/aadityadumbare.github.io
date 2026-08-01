import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-robot-mascot',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './robot-mascot.component.html',
  styleUrls: ['./robot-mascot.component.scss']
})
export class RobotMascotComponent {
  bubbleText = signal("Hi! I'm Aditya's bot assistant. I'm here to help!");
  showBubble = signal(true);
  hasSettled = signal(false);

  private readonly dialogues = [
    "Hi there! I'm Aditya's helper bot. \u{1F916}",
    'Aditya specializes in .NET Core and Angular/React!',
    "Need a backend or full-stack developer? You're in the right place!",
    "Feel free to click 'Say Hello' to send an email directly!",
    'Check out the featured projects below! \u{1F447}',
    'Click the terminal on the hero banner for a tech surprise!'
  ];
  private dialogueIndex = 0;
  private hideBubbleTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    setTimeout(() => {
      if (this.hasSettled()) {
        return;
      }

      this.hasSettled.set(true);
      this.bubbleText.set("Hi! I'm Aditya's bot assistant. I'm here to help!");
      this.showBubble.set(true);
      this.hideBubbleTimer = setTimeout(() => this.showBubble.set(false), 3500);
    }, 7500);
  }

  onBotClick() {
    this.clearHideTimer();
    this.hasSettled.set(true);

    this.bubbleText.set(this.dialogues[this.dialogueIndex]);
    this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogues.length;
    this.showBubble.set(true);
    this.hideBubbleTimer = setTimeout(() => this.showBubble.set(false), 3500);
  }

  private clearHideTimer() {
    if (this.hideBubbleTimer) {
      clearTimeout(this.hideBubbleTimer);
      this.hideBubbleTimer = undefined;
    }
  }
}
