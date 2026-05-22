# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**CLM Health Check** — a multi-step diagnostic form (8 steps) built for **Moreira Suzuki Advocacia para Negócios**. Users answer 5 legal-risk questions about their distribution/franchise network, fill a lead capture gate, then receive a scored results page. On submission, two side-effects fire in parallel: the lead is persisted to a Neon Postgres database and a summary email is sent via Resend.

## Commands

```bash
npm run dev       # development server (http://localhost:3000)
npm run build     # production build — run this to catch TypeScript errors
npm run start     # serve the production build
```

No test suite or linter is configured beyond the default Next.js TypeScript check. Use `npm run build` as the verification step after any change.

## Environment variables

Copy from Vercel with:
```bash
npx vercel env pull .env.local
```

Required at runtime:
| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | `@neondatabase/serverless` in `/api/save-lead` |
| `RESEND_API_KEY` | `resend` in `/api/send-email` |

Both API routes fail **silently** when env vars are missing — the user always reaches the results page regardless.

## Architecture

The entire frontend is a single client component: `app/health-check-form.tsx`. There are no additional pages or client-side routes. `app/page.tsx` is a thin server wrapper that just renders it.

### Form state machine

`HealthCheckForm` owns all state and drives the step transitions:

```
step 0 → context filter (ContextOption)
step 1–5 → pilar questions (PilarAnswer: 'A'|'B'|'C')
step 6 → lead capture gate (LeadData)
step 7 → results page
```

On step 6 submission (`handleLeadNext`), both API routes are called in parallel via `Promise.all` before advancing to step 7. Failures are swallowed.

### Scoring logic

`getScoreLevel(answers)` counts C answers across pilares 1–5:
- ≤ 2 C answers → `"green"` (Risco Baixo)
- 3 C answers → `"yellow"` (Risco Moderado)
- ≥ 4 C answers → `"red"` (Risco Alto)

Score maps to Portuguese for DB/email: `verde / amarelo / vermelho`.

### Data duplication — known trade-off

`PILARES` (questions + recommendations) is defined in `app/health-check-form.tsx` **and** duplicated as `PILARES_DATA` in `app/api/send-email/route.ts` for email generation. If you update copy in one place, update the other.

### Phone validation

`stripPhone` → `formatPhone` → `validatePhone` in `health-check-form.tsx`:
- Strips `+55` country code and non-digits
- Auto-formats as `(XX) XXXXX-XXXX` on each keystroke
- Validates: 11 digits, DDD 11–99, 9th digit must be `9`
- Raw digits (stripped) are sent to the API, not the formatted string

## Brand / styling

- **No design system** — all styling is Tailwind utility classes + inline `style` props for brand colors
- Primary: `#B8CD0F` (lime), Navy: `#2D2F5B`, Body text: `#1A1A1A`
- Quality levels: good = `#B8CD0F`, medium = `#EAB308`, bad = `#DC2626`
- Font: Arial throughout (set on root div, not in Tailwind config)
- Fixed header (`h-16`) and footer require `pt-16 pb-12` on the main content wrapper
- Two image assets must exist in `/public/`: `fundo_ondas-01.png` (wave texture) and `logo_horizontal_em_branco-01.png` (white horizontal logo)

## API routes

### `POST /api/save-lead`
Inserts one row into the `leads` table. Uses `neon(process.env.DATABASE_URL!)` instantiated per-request. Required fields: `nome`, `empresa`, `email`, `whatsapp`.

### `POST /api/send-email`
Sends a plain-text email via Resend. `new Resend(process.env.RESEND_API_KEY)` is instantiated inside the handler (not module scope) to avoid build-time crashes when the key is absent. Update the `FROM` constant once the sending domain is verified in Resend.

## Database

Managed Neon Postgres (connected via Vercel Storage). Schema in `schema.sql` — run once to create the `leads` table. The `channel_binding=require` parameter in the `DATABASE_URL` connection string is incompatible with the Neon serverless driver in Node.js scripts; strip it when running ad-hoc queries outside Next.js.
