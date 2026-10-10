# Brown Brains — Design System (MASTER)

Source of truth for the full-site redesign. Page agents read this first.

## The idea (unchanged)
Brown Brains is one company doing **marketing** (brand, positioning, campaigns, consultation) and **engineering** (web, apps, AI workflows, product building) as **one team**. Two halves, one brain. Clients stop juggling two vendors and losing budget in the gap between them.

## Hard content rules
- NEVER mention a founding year, "Est.", "since", "2026", or how new/young the company is. No `new Date().getFullYear()` shown to users either.
- NEVER imply the team size. Not "three people", "a trio", "small team of X", and not "100+ experts", "large team", "army". Say "the team", "senior people", "the people you meet do the work". The About page shows three named leaders. Frame them as the leadership, not the whole company.
- Copy must be LIGHT. Headlines 2 to 8 words. Supporting lines max ~20 words. No paragraphs longer than 2 sentences. Prefer graphics, numbers, short lists over prose. Cut anything a skimmer would skip.
- Tone: confident, plain, warm. No buzzword soup, no "synergy", no "cutting-edge", and no em-dashes as a stylistic tic. Use full stops and commas.
- Currency is INR (₹). Location Bhopal, India. Clients anywhere.

## Palette — "Midnight & Saffron" (trust + contrast)
| Token | Hex | Use |
|---|---|---|
| midnight | #0a1733 | primary dark ground, main text on light |
| midnight-2 / -3 | #112347 / #1a305c | raised dark surfaces |
| cobalt | #2b59ff | engineering half, primary CTA on light, links |
| cobalt-deep | #1d3fd1 | pressed/hover |
| sky | #9fb6ff | cobalt-tinted text on dark |
| saffron | #ffb224 | marketing half, CTA on dark, highlights |
| saffron-deep | #e8930b | |
| mint | #22c79a | small "positive/live" signals only |
| chalk | #f5f6f9 | light ground |
| paper | #ffffff | cards on chalk |
| slate | #4a5677 | muted text on light |

Saffron = marketing, cobalt = engineering, everywhere. When the two meet, that's the brand moment.

Section themes (in `app/globals.css`): wrap a band in `<Section theme="chalk|midnight|cobalt|saffron">` (`components/ui/Section.tsx`). Inside a theme, use semantic utilities: `bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `border-rule`, `bg-accent`, `text-on-accent`, `text-accent`. Brand constants (`bg-saffron`, `text-cobalt`, `bg-midnight` …) are always available.
Accent per theme: chalk→cobalt, midnight→saffron, cobalt→saffron, saffron→midnight.
Alternate themes down the page so every scroll brings a colour change. Contrast ≥ 4.5:1 for body text. Never saffron text on chalk/white (fails contrast); saffron as fills/shapes on light is fine.

## Typography
- Display: **Schibsted Grotesk** (`font-display`), weights 600–900, tight tracking (-0.035em to -0.05em). Headings are bold and compact, not light serif.
- Body: **Public Sans** (`font-sans`, default), 16px+ base, line-height 1.6.
- NO monospace anywhere. Labels use the `eyebrow` utility / `<Eyebrow>` component.
- Sizes: `text-mega`, `text-display`, `text-title`, `text-heading`, `text-lead` (all fluid clamps).

## Shared building blocks (do not modify; ask the lead if you need a change)
- `components/ui/Section.tsx` — themed band, `pad` for standard vertical rhythm (`section-pad`).
- `components/ui/Button.tsx` — pill CTA, variants primary/secondary/ghost, arrow nudges on hover.
- `components/ui/Eyebrow.tsx`, `components/ui/Marquee.tsx` (CSS ticker).
- `components/motion/Reveal.tsx` — fade + rise on enter view.
- `components/motion/SplitReveal.tsx` — headline words slide up from a mask (`immediate` for heroes).
- `components/motion/ScrollWords.tsx` — paragraph lights up word by word with scroll.
- `components/motion/Parallax.tsx`, `components/motion/Counter.tsx`.
- `lib/motion.ts` — easings (`easeOutExpo`), springs, `inView`, variants.
- Utilities: `shell` (container with gutters), `eyebrow`, `lead`, `section-pad`, `dot-grid`, `link-underline`, `field`.
- Chrome (already built): floating navy capsule header (hides on scroll down), saffron scroll-progress bar, split saffron/cobalt route transition, midnight footer with a scroll-assembled giant wordmark. The header floats ~80px tall over the top of every page, so heroes need top padding (~pt-36 md:pt-44).

## Motion principles
- Library: `motion/react` (Framer Motion v12+ API: `motion`, `useScroll`, `useTransform`, `useSpring`, `useInView`, `AnimatePresence`, `useReducedMotion`). Lenis smooth scroll is already running and synced.
- Every page should feel alive on scroll: pinned/sticky scroll-scrubbed sequences (`sticky top-0 h-screen` inside a tall `h-[300vh]` wrapper + `useScroll({target})`), masks and clip-path reveals, parallax layers, SVG paths drawing (`pathLength`), counters, cards that stack/fan, colour shifts. Each page needs at least one signature scroll moment nobody has seen before.
- Animate only transform / opacity / clip-path / pathLength. Never width/height/top/left.
- Durations 150–300ms for micro-interactions, 600–1000ms for reveals. Ease `easeOutExpo`. Exits faster than entries.
- `useReducedMotion()` → render final readable state, no scrubbing. Content must make sense without animation and DOM order must be the reading order.
- Mobile (≤768px): simplify. Shorter pinned sections (or none), no horizontal scroll-jacking that traps the user; keep it smooth on mid-range phones.
- Graphics: build with inline SVG + CSS/Tailwind (shapes, orbits, grids, diagrams, nodes, charts). No external images except the team portraits in /public. No emoji as icons. Decorative SVG gets `aria-hidden`.

## UX rules (from ui-ux-pro-max)
- Touch targets ≥ 44×44px; visible focus (global saffron ring); `cursor-pointer` on clickables.
- One primary CTA per viewport-height; mini CTA at the end of each chapter, big CTA at the end.
- Headings hierarchy: exactly one `h1` per page.
- No horizontal page scroll at 375px. Test layouts at 375 / 768 / 1024 / 1440.
- Images via `next/image` with `sizes` and meaningful `alt`.
- Forms: visible labels, inline errors near the field, clear loading/success states.

## Next.js notes
This repo runs Next 16.3 (see `node_modules/next/dist/docs/`). Pages are server components by default; put `"use client"` only on interactive/animated leaf components. `next/dynamic` is fine for below-the-fold heavy client sections. Export `metadata` from each page.
