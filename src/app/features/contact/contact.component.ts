import { ChangeDetectionStrategy, Component, ElementRef, NgZone, computed, inject, signal, viewChild } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type FieldName = 'name' | 'email' | 'consent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shown to the visitor and stored alongside the consent record. */
const CONSENT_TEXT =
  'I agree to my name and email being stored so Aditya can reply to me. I understand I can ask for them to be deleted at any time.';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private readonly portfolioService = inject(PortfolioService);
  private readonly analytics = inject(AnalyticsService);
  private readonly zone = inject(NgZone);

  private readonly formRef = viewChild<ElementRef<HTMLFormElement>>('form');
  private readonly doneRef = viewChild<ElementRef<HTMLElement>>('done');

  profile = this.portfolioService.profile;
  social = this.portfolioService.social;
  header = computed(() => this.portfolioService.sectionHeader('contact'));
  contactNote = computed(() => this.portfolioService.activeModeConfig().contactNote);

  readonly consentText = CONSENT_TEXT;

  nameInput = signal('');
  emailInput = signal('');
  messageInput = signal('');
  consentInput = signal(false);

  private readonly touched = signal<Record<FieldName, boolean>>({ name: false, email: false, consent: false });

  status = signal<FormStatus>('idle');
  errorMessage = signal('');
  submittedEmail = signal('');

  readonly nameError = computed(() => {
    const value = this.nameInput().trim();
    if (!value) {
      return 'Please add your name.';
    }
    return value.length > 128 ? 'That name is longer than the server accepts.' : '';
  });

  readonly emailError = computed(() => {
    const value = this.emailInput().trim();
    if (!value) {
      return 'Please add an email so I can reply.';
    }
    if (value.length > 256) {
      return 'That email address is too long.';
    }
    return EMAIL_RE.test(value) ? '' : "That email address doesn't look right.";
  });

  readonly consentError = computed(() =>
    this.consentInput() ? '' : 'Please tick the box so I can store your details.'
  );

  readonly isValid = computed(() => !this.nameError() && !this.emailError() && !this.consentError());

  showError(field: FieldName): boolean {
    return this.touched()[field] && !!this.errorFor(field);
  }

  markTouched(field: FieldName): void {
    this.touched.update((state) => ({ ...state, [field]: true }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.touched.set({ name: true, email: true, consent: true });

    if (!this.isValid()) {
      this.status.set('idle');
      this.focusFirstInvalid();
      return;
    }

    this.status.set('submitting');
    this.errorMessage.set('');

    try {
      await this.analytics.identifyUser({
        username: this.nameInput().trim(),
        email: this.emailInput().trim(),
        traits: this.buildTraits(),
        consent: {
          granted: true,
          basis: 'explicit',
          source: 'portfolio_contact_form',
          text: CONSENT_TEXT
        }
      });

      this.submittedEmail.set(this.emailInput().trim());
      this.status.set('success');
      window.trackEvent?.('contact_identified', { source: 'contact_form' });
      this.zone.runOutsideAngular(() => setTimeout(() => this.doneRef()?.nativeElement.focus()));
    } catch (error) {
      this.status.set('error');
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  }

  reset(): void {
    this.nameInput.set('');
    this.emailInput.set('');
    this.messageInput.set('');
    this.consentInput.set(false);
    this.touched.set({ name: false, email: false, consent: false });
    this.status.set('idle');
    this.errorMessage.set('');
    this.submittedEmail.set('');
  }

  private buildTraits(): Record<string, unknown> {
    const traits: Record<string, unknown> = { source: 'portfolio_contact_form' };
    const message = this.messageInput().trim();
    if (message) {
      traits['message'] = message;
    }
    return traits;
  }

  private errorFor(field: FieldName): string {
    if (field === 'name') {
      return this.nameError();
    }
    if (field === 'email') {
      return this.emailError();
    }
    return this.consentError();
  }

  private focusFirstInvalid(): void {
    this.zone.runOutsideAngular(() =>
      setTimeout(() => {
        const form = this.formRef()?.nativeElement;
        form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      })
    );
  }
}
