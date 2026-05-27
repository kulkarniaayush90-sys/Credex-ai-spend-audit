# Credex AI Spend Audit

Production-quality MVP for a free AI SaaS spend audit product aimed at startups and engineering teams.

## What it does

- Collects AI tool spend inputs for Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf
- Runs a deterministic rule engine to identify overspend, plan mismatch, seat waste, and API optimization opportunities
- Generates a personalized AI summary using Anthropic with a resilient fallback template
- Publishes a shareable public audit URL with no personal/company identifiers in the path
- Captures leads in Supabase and sends a transactional email through Resend

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Supabase
- Zod
- React Hook Form
- Zustand
- Vitest
- Resend
- Anthropic API
- Vercel deployment target

## Local Development

1. Install dependencies.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase, Resend, and Anthropic keys.
4. Run `npm run dev`.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Architecture Notes

- Business logic lives in `lib/audit-engine`
- UI state is persisted with Zustand and localStorage
- The public report uses an opaque audit ID only
- AI is used for summarization only, never for calculations

