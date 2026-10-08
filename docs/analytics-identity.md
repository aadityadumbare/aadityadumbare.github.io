# Visitor identity & contact form

How the portfolio attaches a real identity to an anonymous visitor, and what the contact form
does. The backing service is a separate project (`analytics-service`) — see its own
`docs/profiles-and-privacy.md` for the server-side view.

---

## The flow

```
visitor lands
  └─ inline tracker (src/index.html) mints a stable anonymous id → localStorage["analytics_uid"]
     └─ POST /api/v1/events            { eventType: "pageview", userId, client… }
        …
visitor uses the contact form (name + email + consent)
  └─ POST /api/v1/profiles/identify    { appKey, userId, username, email, traits, consent }
     └─ 202 { ok: true, profileId }
        └─ window.trackEvent("contact_identified")   → dashboard sees identity + the event
```

Because the form reuses `analytics_uid`, the profile is **linked to that visitor's earlier page
views** rather than starting a new person.

---

## Endpoint

### `POST /api/v1/profiles/identify`

Public by default (a project key is required only when the project has `writeKeyRequired: true`,
sent as `Authorization: Bearer ak_…`). Rate-limited.

```jsonc
{
  "appKey": "portfolio-site",          // required
  "userId": "u_…",                     // required — the anonymous id
  "username": "Jane Recruiter",        // optional
  "email": "jane@example.com",         // optional — stored ONLY with consent
  "phone": "+91…",                     // optional — stored ONLY with consent
  "traits": { "source": "portfolio_contact_form", "message": "…" },
  "consent": {
    "granted": true,
    "basis": "explicit",
    "source": "portfolio_contact_form",
    "text": "<the exact wording the visitor agreed to>"
  }
}
```

Returns `202 { ok: true, profileId }`.

> The schema is **`.strict()`** — unknown top-level keys are rejected with `400`. That is why the
> free-text message travels inside `traits`, not as a top-level field.

---

## Consent model

- **Email and phone are only stored when `consent.granted === true`.** Anything else is dropped
  server-side.
- The form **requires** the consent checkbox before it will submit, so the site never sends PII
  it has no permission to store.
- The exact wording shown to the visitor is sent as `consent.text` and persisted, so there is a
  record of *what* was agreed to (alongside `basis`, `source`, and a server `grantedAt`).
- Erasure paths exist server-side: `DELETE /apps/:appKey/profiles/:id?eraseEvents=` and
  `POST /apps/:appKey/profiles/forget { email }`.

The consent copy in the UI:

> I agree to my name and email being stored so Aditya can reply to me. I understand I can ask for
> them to be deleted at any time.

---

## Client implementation

`src/app/core/services/analytics.service.ts`

- `identifyUser(request)` — POSTs to the endpoint, returns `{ ok, profileId }`.
- **Endpoint resolution** matches the inline tracker: `localhost` / `127.0.0.1` →
  `http://localhost:3000`, otherwise `https://analytics-service-if1u.onrender.com`.
- **`userId`** is read from `localStorage["analytics_uid"]` and only generated if absent, so it
  always matches the tracker's id.
- **Timeout** of 15 s (`AbortController`) because the Render free tier spins down and cold-starts.
- **Error mapping** to human messages: `429` → rate limited, `400` → details rejected, otherwise
  "could not reach the server".

### Form (`src/app/features/contact/`)

Signal-based (no `@angular/forms`), with four states: `idle · submitting · success · error`.

| Field | Rule | Sent as |
| --- | --- | --- |
| Name | required, ≤ 128 chars | `username` |
| Email | required, must look like an email, ≤ 256 chars | `email` |
| Message | optional, ≤ 1000 chars | `traits.message` |
| Consent | must be ticked | `consent` |

On success the form is replaced by a confirmation panel (focused for screen readers) with a
"Send another" action, and a `contact_identified` custom event is fired via `window.trackEvent`.

---

## Testing locally

```bash
# terminal 1 — the analytics service, in-memory MongoDB
cd C:/System/BE/analytics-service
NODE_ENV=development npm run dev:local            # http://localhost:3000

# terminal 2 — the portfolio
cd C:/System/FE/aadityadumbare.github.io
npm start                                         # http://localhost:4200
```

Then open `/#contact`, submit the form, and confirm the profile landed:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin-dev-password"}' | jq -r .token)

curl -s "http://localhost:3000/api/v1/apps/portfolio-site/profiles?limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq
```

(`admin` / `admin-dev-password` are the **development** defaults; production reads
`ADMIN_USERNAME` / `ADMIN_PASSWORD` from the environment.)

> `npm run dev:local` runs `tsx` **without `--watch`**. After editing backend code, restart it —
> otherwise new routes simply 404. This is exactly how a stale instance first made
> `/profiles/identify` return 404 during development.

---

## Production prerequisite

The identity feature must be **committed and deployed** in the service before the live site can
use it. Until then the form correctly shows its error state. Check whether the route is live
without creating any data:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  https://analytics-service-if1u.onrender.com/api/v1/profiles/identify \
  -H 'Content-Type: application/json' -d '{}'
# 400 → route is live (payload failed validation)
# 404 → not deployed yet
```

## If `writeKeyRequired` is turned on

For a project with `writeKeyRequired: true`, `/profiles/identify` (and `/events`) require that
project's key as a Bearer token. `portfolio-site` currently leaves this off, so writes are
public and no key is sent. If you enable it, add the key to `AnalyticsService` — do **not** ship
it as a build-time constant in client code if you want it secret; a write key is inherently
visible to anyone who can call the endpoint.
