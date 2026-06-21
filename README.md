# DSCR Rental Check

Enter a property address and get:

- 🏠 **Property details** for the subject address
- 📊 An **estimated fair-market rent**, computed _from comparable rentals_ so the number is explainable
- 🔗 The **comps used**, each with an outbound link so you can verify them
- 🧮 A **DSCR & cash-flow analysis** (the namesake) pre-filled with the estimated rent

The rent estimate isn't a black box: every comp is size-adjusted to the subject
and weighted by how similar it is (distance, square footage, bed/bath match),
and the methodology is spelled out in the UI.

![flow](https://img.shields.io/badge/Next.js-14-black) ![flow](https://img.shields.io/badge/TypeScript-5-blue)

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

No API keys are needed — the app ships in **demo mode** with a deterministic
mock data provider. The same address always returns the same property and comps,
and comp links open the map location for the (simulated) address.

## How it works

```
address ─▶ /api/analyze ─▶ analyzeAddress()
                              ├─ provider.getProperty(address)
                              ├─ provider.getRentalComps(property)
                              ├─ computeSimilarity() for each comp
                              └─ estimateRent(property, comps)  ◀── explainable estimate
```

| Layer | File | Responsibility |
| --- | --- | --- |
| Data providers | `lib/providers/` | Fetch property + comps. Swappable. |
| Similarity + estimate | `lib/estimate.ts` | Score comps, derive the rent number, range & confidence |
| DSCR math | `lib/dscr.ts` | Amortization, PITIA, DSCR, cash flow, cash-on-cash |
| API | `app/api/analyze/route.ts` | Validates input, runs the pipeline |
| UI | `app/`, `components/` | Form, estimate card, comps table, DSCR calculator |

## Going live (swap in real data)

The mock provider implements the same `RentalDataProvider` interface as a live
one, so switching to real data is a config change — the UI and API don't move.

A **RentCast** provider is already implemented (`lib/providers/rentcast.ts`).
To turn it on:

```bash
cp .env.example .env.local
# edit .env.local:
DATA_PROVIDER=rentcast
RENTCAST_API_KEY=your_key_here   # from https://app.rentcast.io
```

Want a different source (ATTOM, CoreLogic, HouseCanary, Rentometer, …)? Add a
class that implements `RentalDataProvider` (`getProperty` + `getRentalComps`)
in `lib/providers/`, register it in `lib/providers/index.ts`, and you're done.

> ⚠️ Don't scrape Zillow/Redfin — it violates their terms of service and breaks
> constantly. Use a licensed data API instead.

## Deploy to Netlify

Netlify auto-detects Next.js and installs its runtime for you — no plugin
install needed. A `netlify.toml` is included (it just pins the build command and
Node 22). The `/api/analyze` route is deployed automatically as a Netlify
Function, and the app works out of the box in demo mode.

**Via the Netlify UI (easiest):**

1. Push this branch to GitHub (already done).
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick this
   repo.
3. Set **Branch to deploy** to the branch you want to preview (e.g.
   `claude/nifty-turing-m048vu`). Netlify auto-fills the build command
   (`npm run build`) — leave the publish directory blank; the Next runtime
   handles it.
4. **Deploy.** You'll get a live preview URL like
   `https://<your-site>.netlify.app`.

**Via the Netlify CLI:**

```bash
npm i -g netlify-cli
netlify init      # link to a site, or create one
netlify deploy    # draft deploy with a preview URL
netlify deploy --prod
```

**For live data on Netlify:** add `DATA_PROVIDER=rentcast` and
`RENTCAST_API_KEY` under **Site settings → Environment variables**, then
redeploy. Leave them unset to stay in demo mode.

## Project structure

```
app/
  layout.tsx            Root layout + metadata
  page.tsx              Landing page
  globals.css           Tailwind + component styles
  api/analyze/route.ts  POST endpoint: address -> AnalysisResult
components/
  Analyzer.tsx          Client orchestrator (fetch + state)
  AddressForm.tsx       Address input + sample chips
  ResultsView.tsx       Composes the result cards
  PropertyCard.tsx      Subject property details
  RentEstimateCard.tsx  Headline rent + range + methodology
  CompsTable.tsx        Comparable rentals with source links
  DscrCalculator.tsx    Interactive DSCR / cash-flow tool
lib/
  types.ts              Shared domain types
  analyze.ts            End-to-end pipeline
  estimate.ts           Similarity scoring + rent estimate
  dscr.ts               DSCR / cash-flow math
  format.ts             Currency / date helpers
  providers/            Data source abstraction (mock + RentCast)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Lint with Next's ESLint config |

## Notes & disclaimers

- The DSCR figure is gross rent ÷ PITIA, the common lender definition. Cash flow
  additionally subtracts vacancy, management, and maintenance.
- This tool is for informational purposes only — not a loan offer, appraisal, or
  guarantee of rent. Always verify comps before underwriting.
