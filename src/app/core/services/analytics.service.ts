import { DOCUMENT, Injectable, inject } from '@angular/core';

declare global {
  interface Window {
    /** Exposed by the inline analytics tracker in index.html. */
    trackEvent?: (eventName: string, metadata?: Record<string, unknown>) => void;
  }
}

export interface IdentifyConsent {
  granted: boolean;
  basis?: string;
  source?: string;
  text?: string;
}

/**
 * Mirrors `POST /api/v1/profiles/identify`. The schema is strict and only these
 * keys are accepted, so never spread arbitrary fields into the request body.
 */
export interface IdentifyRequest {
  username?: string;
  email?: string;
  phone?: string;
  traits?: Record<string, unknown>;
  consent?: IdentifyConsent;
}

export interface IdentifyResult {
  ok: boolean;
  profileId?: string;
}

const LOCAL_HOSTS = ['localhost', '127.0.0.1'];
const PROD_BASE = 'https://analytics-service-if1u.onrender.com';
const LOCAL_BASE = 'http://localhost:3000';
const REQUEST_TIMEOUT_MS = 15000;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly appKey = 'portfolio-site';

  /**
   * Attach a real identity to this visitor's anonymous `userId`. Email/phone
   * are only stored server-side when consent is granted.
   */
  async identifyUser(request: IdentifyRequest): Promise<IdentifyResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appKey: this.appKey, userId: this.userId, ...request }),
        keepalive: true,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(this.describeError(response.status));
      }

      return (await response.json()) as IdentifyResult;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('The server is taking too long to respond. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  private get endpoint(): string {
    const host = this.doc.location?.hostname ?? '';
    const base = LOCAL_HOSTS.includes(host) ? LOCAL_BASE : PROD_BASE;
    return `${base}/api/v1/profiles/identify`;
  }

  /** The same anonymous id the inline tracker writes, so the profile links up. */
  private get userId(): string {
    const storage = this.safeStorage();
    const existing = storage?.getItem('analytics_uid');
    if (existing) {
      return existing;
    }
    const id = `u_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    storage?.setItem('analytics_uid', id);
    return id;
  }

  private safeStorage(): Storage | null {
    try {
      return this.doc.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private describeError(status: number): string {
    if (status === 429) {
      return 'Too many requests just now. Please try again in a minute.';
    }
    if (status === 400) {
      return 'Some of those details were rejected. Please check them and try again.';
    }
    return 'Could not reach the server. Please try again, or email me directly.';
  }
}
