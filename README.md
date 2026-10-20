# Lean Body Academy | VSL Funnel

A three page funnel for Josh Bell's Lean Body Academy.

**VSL page** (`index.html`) > **Book a call** (`book.html`) > **Call confirmation** (`confirmed.html`)

Plain HTML, CSS and JavaScript. No build step, so it can be hosted anywhere that serves static files (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Setup

Everything you need to change lives in `assets/config.js`:

| Setting | What it does |
| --- | --- |
| `vslEmbedUrl` | Josh's VSL embed link (Vimeo or YouTube embed URL). Loads when the play button is pressed. |
| `calendlyUrl` | Josh's Calendly event link. Loads as an inline calendar on `book.html`. |
| `whatsappNumber` | Josh's WhatsApp number in international format, no `+` or spaces (e.g. `447123456789`). |
| `whatsappMessage` | The pre-filled confirmation message. |
| `leadWebhookUrl` | Optional. Zapier, Make, GoHighLevel etc. Receives `{ name, email, phone, source, submittedAt }` on opt-in. |

### Calendly
- Name and email from the opt-in are prefilled automatically.
- To prefill phone too, make the **first** invitee question in the Calendly event a phone/text question.
- In the event settings, set the after-booking redirect to `https://YOUR-DOMAIN/confirmed.html`. The page also redirects itself when a booking is detected, so either way works.

## How it flows
1. Lead watches the VSL and fills in name, email and phone.
2. The lead is sent to the webhook (if set) and passed through to the booking page.
3. They book a time in Calendly and land on the confirmation page.
4. They tap the WhatsApp button to confirm their call with Josh.

## Files
```
index.html        VSL page with opt-in form and transformation collage
book.html         Thank you page with Calendly embed
confirmed.html    Call confirmation with WhatsApp confirm button
assets/
  config.js       Funnel settings
  styles.css      Shared styles
  img/            Logo and client transformations
```

## Deploying on GitHub Pages
Settings > Pages > Deploy from branch > `main` / root. The site will be live at `https://repshealth.github.io/joshbell/`.
