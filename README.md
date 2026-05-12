# Merchants AI — Procurement Desk (Prototype)

A prototype of the special-order procurement process for **Merchants Paper Company Limited**, supervised by AI with a human-in-the-loop at every step. Maps directly onto Work Instruction MWI-0703-02.

Built for a presentation to Carol Whitehead, President.

## What it shows

**Carol's executive dashboard** — KPIs (cycle time, margin recovered, AR exposure caught, hours saved), live pipeline funnel, at-risk deals, AI agent activity feed.

**Four live case scenarios**, each fully clickable end-to-end:

1. **Should have been stock** — Caesars Windsor F&B asks for a "special order" of nitrile gloves. AI matches to an existing stock SKU and a value-grade alternative. Margin recovered.
2. **Credit risk caught early** — Lakeshore Hospitality requests $45K of chemicals. AI surfaces AR aging + NSF history and prepares a brief for the Director of Sales before sales effort is spent.
3. **Complex sourcing** — Riverbend Suites wants custom-embossed CleanBeyondGreen towels. AI shortlists 3 suppliers, drafts RFQs, parses returned quotes into a side-by-side comparison.
4. **Stalled deal rescue** — Erie Shores Healthcare quote silent for 14 days. AI drafts a tactful follow-up + alternative product (supplier lead-time changed), flags the deal on Carol's dashboard.

**Operator view** — what Sales Assistant / AR / Purchasing see in their workday. AI surfaces what needs them.

**Case file view** — every AI recommendation has Approve / Edit / Reject. Nothing moves without a human green button. Full audit log of every step.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy

Push to GitHub, then on [vercel.com/new](https://vercel.com/new) import the repo. Vercel auto-detects Next.js — no build config needed.

### Activate the live AI demo

The `/demo` page calls `claude-opus-4-7` through the Anthropic API to process arbitrary inbound text end-to-end. To activate it:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com) (~$5 free credit, takes a minute)
2. In your Vercel project → **Settings → Environment Variables**, add:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: the key from step 1
   - **Environments**: Production, Preview, Development
3. Redeploy from the Deployments tab (1 click)

Without the key, the rest of the prototype still works — only the live-AI panel falls back to a friendly "set the key in Vercel" message.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4
- TypeScript
- Static seeded data (`src/lib/data.ts`) — no backend yet

## Phase 2 — embedded in Google Workspace

Merchants already has Google Enterprise Plus. Phase 2 surfaces this AI in:

- **Gmail sidecar** for sales reps and Sales Assistant
- **AppSheet** for the procurement case file
- **Google Chat** for AR / Purchasing approvals
- **Vertex AI / Gemini** as the model
- **Looker Studio** for the executive dashboard
