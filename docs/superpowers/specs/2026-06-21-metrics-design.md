# Metrics: Add Analytics Providers (GA, Clarity, Vercel)

## Context

This project currently has no analytics or performance monitoring wired up.
The previous site (`../subhranshu.com/app/metrics/`) has a `Metrics`
component that mounts Google Analytics (GA4) and Microsoft Clarity via
hand-rolled `next/script` tags, included once in the root layout.

`.env.local` already contains `NEXT_PUBLIC_GOOGLE_ANALYTICS` and
`NEXT_PUBLIC_MICROSOFT_CLARITY` keys (currently empty), carried over in
anticipation of this work — no new env vars are needed for those two.

This spec ports that behavior into the new project, modernizes the Google
Analytics integration to use Next.js's official first-party package instead
of a hand-rolled script, and adds Vercel Analytics + Speed Insights since
this project deploys on Vercel.

## Goals

- Google Analytics (GA4), Microsoft Clarity, Vercel Analytics, and Vercel
  Speed Insights are all wired into the app.
- None of the four fire during local development (`next dev`) — only in
  production builds — so local testing never pollutes real analytics data.
- File organization follows this project's existing convention
  (non-route code under `src/components/`, not `src/app/`).

## Non-Goals

- No SPA route-change tracking fixes for GA4 (the reference project doesn't
  do this either — `gtag('config', ...)` fires once on initial load only).
  Out of scope for this port.
- No cookie-consent banner or privacy-preference gating.
- No `.env.example` file — out of scope for this change.
- No automated tests — these are script-loader components with no logic
  worth unit-testing, consistent with this project's existing lack of a
  test suite.

## Design

### 1. File structure — `src/components/metrics/`

```
src/components/metrics/
├── index.tsx              — <Metrics /> orchestrator, gates on NODE_ENV
├── google-analytics.tsx   — wraps @next/third-parties/google
└── clarity.tsx            — ported from reference, "use client"
```

Vercel Analytics and Speed Insights are single-line components imported
directly in `index.tsx` — small enough that they don't need their own
files.

### 2. `google-analytics.tsx`

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";

const Analytics = () => (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!} />
);

export default Analytics;
```

Uses Next.js's official first-party integration instead of a hand-rolled
`<Script>` tag — same `afterInteractive` loading behavior, officially
maintained, less code than the reference's manual implementation.

### 3. `clarity.tsx`

Ported verbatim from `../subhranshu.com/app/metrics/clarity.tsx` (no
official Next.js or Microsoft package exists for the web snippet):

```tsx
"use client";

import Script from "next/script";

const MicrosoftClarity = () => (
  <Script
    id="microsoft-clarity-init"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY}");
        `,
    }}
  />
);

export default MicrosoftClarity;
```

### 4. `index.tsx` — orchestrator with production gating

```tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "./google-analytics";
import MicrosoftClarity from "./clarity";

const Metrics = () => {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default Metrics;
```

One gate covers all four providers, including the two Vercel widgets
(which don't strictly need it — they no-op usefully outside Vercel — but
gating them too keeps the behavior uniform and the component simple).

### 5. Layout integration — `src/app/layout.tsx`

Import `Metrics` from `@/components/metrics` and render `<Metrics />` once,
inside `<body>`, near the top — same placement pattern as the reference
project.

### Data flow

1. `RootLayout` renders `<Metrics />` on every page.
2. In dev, `Metrics` returns `null` — no requests fire.
3. In a production build, all four providers render: GA's snippet pushes
   to `dataLayer` and loads `gtag.js`; Clarity's snippet loads its tag
   script; Vercel's components send their own beacons automatically.

### Error handling

None needed — these are fire-and-forget script loaders with no user-facing
failure mode. If an env var is missing, the corresponding script simply
loads with an empty/undefined ID (matches reference behavior; no new
validation is being introduced).

## Dependencies

Added (via `bun add`): `@next/third-parties`, `@vercel/analytics`,
`@vercel/speed-insights`.

No new env vars — `NEXT_PUBLIC_GOOGLE_ANALYTICS` and
`NEXT_PUBLIC_MICROSOFT_CLARITY` already exist in `.env.local`. Vercel's
packages need no env vars; they auto-detect the Vercel deployment
environment.

## Verification

- [!IMPORTANT] VERIFICATION MUST BE DONE BY THE USER. AFTER ALL TASKS, GUIDE THE USER TO TEST THE IMPLEMENTATION
- `bun run build` and `bun run lint` must pass.
- `bun run dev`: view page source / browser network tab and confirm no
  requests to `googletagmanager.com`, `clarity.ms`, or Vercel's analytics
  endpoints fire.
- `bun run build && bun run start` (production mode locally): confirm
  requests to `googletagmanager.com` and `clarity.ms` do fire. Vercel
  Analytics/Speed Insights beacons are best confirmed after an actual
  Vercel deploy, since they're tied to Vercel's edge infrastructure.
