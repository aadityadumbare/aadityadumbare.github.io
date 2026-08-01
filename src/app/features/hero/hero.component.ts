import { Component, inject, signal, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { TerminalCommand } from '../../core/models/portfolio.models';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { RecruiterSnapshotComponent } from '../../shared/components/recruiter-snapshot/recruiter-snapshot.component';

interface ConsoleLine {
  text: string;
  isCmd: boolean;
  isOutput: boolean;
  prompt?: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RevealDirective, RecruiterSnapshotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  portfolioService = inject(PortfolioService);

  profile = this.portfolioService.profile;
  stats = this.portfolioService.stats;
  terminalData = this.portfolioService.terminal;

  // Terminal Simulation state
  lines = signal<ConsoleLine[]>([]);
  currentCommandIndex = signal<number>(0);
  currentText = signal<string>('');
  isTyping = signal<boolean>(false);

  ngOnInit() {
    this.runTerminalSimulation();
  }

  async runTerminalSimulation() {
    const commands = this.terminalData().commands;
    
    for (let i = 0; i < commands.length; i++) {
      this.currentCommandIndex.set(i);
      const cmdObj = commands[i];

      // Add a fresh command prompt line with empty text
      this.isTyping.set(true);
      await this.typeCommand(cmdObj.cmd);
      this.isTyping.set(false);

      // Add typed command to list
      this.lines.update(arr => [...arr, {
        text: cmdObj.cmd,
        isCmd: true,
        isOutput: false,
        prompt: 'visitor@aditya-dumbare:~$'
      }]);
      this.currentText.set('');

      // Wait briefly, then show output
      await this.sleep(400);
      this.lines.update(arr => [...arr, {
        text: cmdObj.output,
        isCmd: false,
        isOutput: true
      }]);

      await this.sleep(800);
    }
  }

  private typeCommand(fullText: string): Promise<void> {
    return new Promise((resolve) => {
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < fullText.length) {
          this.currentText.update(t => t + fullText.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 70);
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  scrollToSection(hash: string, event: Event) {
    event.preventDefault();
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
