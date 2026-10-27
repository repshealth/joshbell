# Lean Body Academy | VSL Funnel

A three page funnel for Josh Bell's Lean Body Academy.

**Opt in to watch** (`index.html`) > **Watch the video and book a call** (`watch.html`) > **Call confirmation** (`confirmed.html`)

Plain HTML, CSS and JavaScript. No build step, so it can be hosted anywhere that serves static files (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Setup

Everything you need to change lives in `assets/config.js`:

| Setting | What it does |
| --- | --- |
| `vslEmbedUrl` | Josh's VSL embed link (set to his Wistia video). Plays on `watch.html` once they've opted in. |
| `whatsappNumber` | Josh's WhatsApp number in international format, no `+` or spaces (e.g. `447123456789`). |
| `whatsappMessage` | The pre-filled confirmation message. |
| `dashboardFormsUrl`, `dashboardClient` | Sends each opt in to the REPS dashboard, where it lands in Lean Body Academy's Leads. |
| `sheetWebhookUrl` | Saves each opt in as a row in the Google Sheet "Lean Body Academy - Funnel Opt Ins". Set up with `integrations/google-sheet.gs` (instructions at the top of that file). |
| `leadWebhookUrl` | Optional, as well as the dashboard. Zapier, Make, GoHighLevel etc. Receives `{ name, email, phone, source, submittedAt }` on opt-in. |

### Calendly
- The Calendly embed code is in `watch.html` (search for "Calendly inline widget"). To change the event, change its `data-url`.
- Name and email from the opt-in are prefilled automatically.
- To prefill phone too, make the **first** invitee question in the Calendly event a phone/text question.
- In the event settings, set the after-booking redirect to `https://YOUR-DOMAIN/confirmed.html`. The page also redirects itself when a booking is detected, so either way works.

## How it flows
1. Lead lands on the opt in page. Clicking the locked video (or any button) opens a pop up asking for name, email and phone.
2. The lead is sent to the REPS dashboard (and the webhook, if set) and they go straight to the watch page.
3. They watch the video, then book a time in the Calendly embed underneath.
4. They land on the confirmation page and tap the WhatsApp button to confirm their call with Josh.

## Files
```
index.html        Opt in page: locked video, opt in pop up, transformation collage
watch.html        Video plus Calendly embed
confirmed.html    Call confirmation with WhatsApp confirm button
assets/
  config.js       Funnel settings
  styles.css      Shared styles
  img/            Logo and client transformations
```

## Deploying on GitHub Pages
Settings > Pages > Deploy from branch > `main` / root. The site will be live at `https://repshealth.github.io/joshbell/`.
