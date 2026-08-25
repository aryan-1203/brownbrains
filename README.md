# Brown Brains

The Brown Brains website. Next.js 16, TypeScript, Tailwind CSS 4, Motion, Lenis.
Contact form submissions land in a Google Sheet and are emailed to both of you.

---

## Before anything else: replace the placeholders

All copy and contact details live in `content/`, so you never have to touch a
component to change words on the site. Search the project for `REPLACE` and work
through the list.

**`content/site.ts`**

- `contact.email`, `contact.phone`, `contact.whatsapp` (digits only, with country
  code, no `+`). The location is already set to Bhopal, India.
- `url` — your production domain, no trailing slash. Used for canonical links,
  the sitemap and social cards.
- `founded` — the year you started
- `socials` — real profile URLs, or delete lines you do not want shown
- `proofStats` — the four numbers on the home page. Only claim what is true.
- `engagements` — three example projects. Replace with real work as you land it.

**`content/founders.ts`**

- Both names, roles and bios
- `linkedin` for each of you, or leave `""` to hide the link
- `portrait` — drop a photo in `public/` (for example `public/dad.jpg`) and set
  `portrait: "/dad.jpg"`. Portrait images should be roughly 4:5, at least
  800×1000. Leave `""` and you get a typographic monogram instead, which looks
  deliberate rather than broken.

**`content/services.ts`**, **`content/process.ts`** — the seven services and the
five process stages. Edit the wording freely; the layouts adapt.

---

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The contact form needs the environment variables
below before it can actually save anything.

---

## Deployment

Five steps. Everything used here is free.

### Step 1 — Google Sheet + Apps Script (where submissions are stored)

1. Go to [sheets.new](https://sheets.new) and name the spreadsheet something like
   `Brown Brains Enquiries`.
2. In the menu choose **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste in the entire contents of
   [`scripts/apps-script.gs`](scripts/apps-script.gs).
4. On line 14, change `SHARED_SECRET` to a long random string. Generate one with
   `openssl rand -hex 24` in your terminal. Keep it somewhere safe — you need the
   exact same value in Step 3.
5. Click the **save** icon.
6. Click **Deploy → New deployment**. Click the gear next to "Select type" and
   choose **Web app**. Set:
   - **Description:** anything
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**. Google will ask you to authorise the script. Click
   **Review permissions**, pick your account, and if you see "Google hasn't
   verified this app", click **Advanced → Go to (project name)** and then
   **Allow**. This warning is normal for your own scripts.
8. Copy the **Web app URL**. It ends in `/exec`. That is your
   `GOOGLE_SHEETS_WEBHOOK_URL`.
9. Paste that URL into a browser tab. You should see
   `{"ok":true,"message":"Brown Brains enquiry endpoint is live."}`.

> If you later edit the script, you must click **Deploy → Manage deployments →
> edit (pencil) → Version: New version → Deploy**, or your changes will not go
> live.

### Step 2 — Resend (email notifications)

1. Sign up at [resend.com](https://resend.com). The free tier covers 3,000 emails
   a month, which is far more than a contact form will use.
2. Go to **API Keys → Create API Key**, give it send permission, and copy the key
   (it starts with `re_`). You only get to see it once.
3. For now, use `onboarding@resend.dev` as the sender address. It works
   immediately without any DNS setup.
4. Later, when you own a domain: go to **Domains → Add Domain**, add the DNS
   records Resend gives you at your registrar, wait for verification, and then
   change `CONTACT_FROM_EMAIL` to something like
   `Brown Brains <hello@yourdomain.com>`. Emails from your own domain are far
   less likely to land in spam.

### Step 3 — Environment variables and a local test

Copy the example file and fill in the five values:

```bash
cp .env.example .env.local
```

| Variable | What it is |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | The `/exec` URL from Step 1 |
| `SHEETS_SHARED_SECRET` | The exact same string as `SHARED_SECRET` in the Apps Script |
| `RESEND_API_KEY` | The `re_...` key from Step 2 |
| `CONTACT_TO_EMAILS` | Who gets notified. Comma-separated for both of you. |
| `CONTACT_FROM_EMAIL` | `Brown Brains <onboarding@resend.dev>` to start with |

Then run `npm run dev`, open http://localhost:3000/contact, and send yourself a
test message. You should see a new row appear in the Google Sheet and an email
arrive within a few seconds.

If the row appears but no email does, the form still reports success on purpose —
the spreadsheet is the record of truth, so an email outage can never lose you a
lead. Check the terminal for a `[contact] notification email failed` line.

### Step 4 — Push to GitHub

```bash
git add .
git commit -m "Brown Brains website v1"
```

Create an empty repository at [github.com/new](https://github.com/new) — do not
add a README or .gitignore — then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/brown-brains.git
git branch -M main
git push -u origin main
```

`.env.local` is git-ignored, so your keys stay off GitHub.

### Step 5 — Deploy on Vercel

1. Sign up at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project** and import the `brown-brains` repository.
3. Leave every build setting alone — Vercel detects Next.js automatically.
4. Expand **Environment Variables** and add all five from Step 3. Paste the
   values without surrounding quotes.
5. Click **Deploy**. It takes about a minute.

You get a free URL like `brown-brains.vercel.app`. Every push to `main` now
deploys automatically, and pull requests get their own preview URL.

Finally, set `url` in `content/site.ts` to your live domain and push again, so
canonical links and social cards point at the right place.

### Custom domain (optional)

Buy a domain anywhere, then in Vercel go to **Project → Settings → Domains**, add
it, and copy the DNS records Vercel shows you into your registrar. Vercel issues
the HTTPS certificate automatically. No redeploy needed.

---

## The design system

The site is built on a single idea: it has two personalities, and the page
identity inverts as you scroll between them.

- **Paper** — warm bone and espresso ink. Used for the human disciplines:
  marketing, brand, consulting.
- **Machine** — espresso black with a live neuron graph. Used for the technical
  disciplines: web, apps, AI.
- **Ember** — a burnt-orange band used only for closing calls to action, so the
  page has three temperatures rather than a binary toggle.

Every tone is a set of CSS custom properties in
[`app/globals.css`](app/globals.css). To restyle the entire site, change the
values in the `.tone-paper`, `.tone-machine` and `.tone-ember` blocks — nothing
else needs editing.

Sections declare their own tone:

```tsx
<Section tone="machine" pad="lg" seam canvas>
  <YourContent />
</Section>
```

`ToneProvider` watches which section is crossing the middle of the viewport and
flips `data-tone` on `<html>`, which re-skins the header, cursor and film grain
to match. `canvas` adds the neuron graph, `seam` adds a hairline at the top of
the section.

Where two sections of different tones meet, put a `ToneBridge` between them
instead of a `seam`. It dissolves one tone into the other across a short band, so
a light section meeting a dark one does not read as a hard line scrolling past:

```tsx
<ToneBridge from="paper" to="machine" />
```

Type is Fraunces for display (its variable softness and wonk axes are animated on
the footer wordmark), Inter Tight for body copy, JetBrains Mono for labels.

### Motion

The home hero splits into a human half and a machine half, and the seam between
them moves without anyone having to grab it: with a mouse it drifts toward
wherever the cursor is inside the hero, and on touch the machine half takes over
as the section scrolls away. The handle is a marker and a keyboard control
(arrow keys), not something to drag.

Every effect is behind one switch. If a visitor has "reduce motion" enabled in
their OS, `ToneProvider` reports it and the smooth scrolling, the neuron canvas,
the pinned horizontal process section and the large entrance animations all turn
off, with a static layout in their place. Worth testing in
**System Settings → Accessibility → Display → Reduce motion**.

---

## Project structure

```
app/                    Routes, metadata, sitemap, robots, social card
  api/contact/route.ts  Form handler: validation, spam checks, sheet, email
components/
  chrome/               Header, footer, cursor, grain, smooth scroll, transitions
  tone/                 ToneProvider, Section, ToneBridge — the tone system
  fx/                   Canvas, marquee, word reveals, magnetic buttons, counters
  home/ about/ ...      Page-specific sections
content/                All copy and configuration. Edit this, not components.
lib/                    Validation, sheet and mail clients, rate limiting
scripts/apps-script.gs  Paste into Google Apps Script
```

## Commands

```bash
npm run dev      # development server
npm run build    # production build, also type-checks
npm run lint     # eslint
npm start        # serve the production build locally
```

## Troubleshooting

**The form says something broke and did not save.** The Apps Script call failed.
Open the `/exec` URL in a browser to check the deployment is live, confirm
`SHEETS_SHARED_SECRET` matches `SHARED_SECRET` exactly, and remember that editing
the script requires deploying a **new version**.

**Rows arrive but emails do not.** Check `RESEND_API_KEY`, and that
`CONTACT_FROM_EMAIL` is either `onboarding@resend.dev` or an address on a domain
you have verified in Resend.

**"That is a few too many messages."** The rate limiter allows five submissions
per IP every ten minutes. It resets on its own, and also whenever the server
restarts.

**Changed content but the live site looks the same.** Content is baked in at
build time. Push the change, or redeploy from the Vercel dashboard.
