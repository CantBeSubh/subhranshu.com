# Design: TanStack Query for server actions

## Context

The app has two server action files consumed by client components:

- `src/actions/count.ts` — `getLikeCount`, `getVisitCount` (each independently query the same `counter` row), `incrementLikeCount`, `incrementVisitCount`.
- `src/actions/send-email.ts` — `sendEmail` (form-based mutation, returns `{ error }` or `{ data }`, never throws).

Consumers:

- `src/app/page.tsx` (Server Component) awaits `getLikeCount()`/`getVisitCount()` and passes results into `HeroStatsProvider`.
- `src/components/hero-stats.tsx` hand-rolls optimistic UI with `useOptimistic`/`useTransition`, and fires `incrementVisitCount()` once in a mount `useEffect`. Exposes `HeroStatsProvider`, `useHeroStats`, `LikeBadge`, `VisitLikeCounter`.
- `src/components/section/contact-section.tsx` uses `<form action={sendEmail}>` with manual toast handling; `contact-submit-button.tsx` reads pending state via `useFormStatus()`.

No query library is installed. Goal: introduce TanStack Query as the data layer for all five server actions, replacing the ad-hoc state management, while keeping the app's small scale in mind (no over-engineering).

## Architecture & setup

- Add dependencies: `@tanstack/react-query` (v5), `@tanstack/react-query-devtools`.
- New `src/components/providers/query-provider.tsx` (`"use client"`):
  - Creates a `QueryClient` via `useState(() => new QueryClient())` — per component instance, not module scope, so concurrent SSR requests don't share state.
  - Wraps `children` in `QueryClientProvider`.
  - Renders `ReactQueryDevtools` only when `process.env.NODE_ENV !== "production"`.
- `src/app/layout.tsx` wraps `{children}` in this provider, alongside the existing `ThemeProvider`/`TooltipProvider`.
- New `src/hooks/` directory (new convention for this codebase) for query/mutation hooks.
- SSR data flow: keep Server Components fetching initial values directly (no `dehydrate`/`HydrationBoundary`); pass results into `useQuery`'s `initialData`. Avoids prefetch/hydration boilerplate for a 2-query app.

## Counter feature (likes + visits)

- `src/actions/count.ts`: replace `getLikeCount`/`getVisitCount` with one `getCounter()` action returning `{ likeCount, visitCount }` from a single `db.counter.findFirst()` call (falls back to `{ likeCount: 96, visitCount: 96 }` on error, matching current defaults). `incrementLikeCount`/`incrementVisitCount` are unchanged.
- New `src/hooks/use-counter.ts` (`"use client"`), query key `["counter"]`:
  - `useCounterQuery(initialData: { likeCount: number; visitCount: number })` — `useQuery({ queryKey: ["counter"], queryFn: getCounter, initialData })`.
  - `useLikeMutation()` — `useMutation({ mutationFn: incrementLikeCount })`. `onMutate`: cancel in-flight `["counter"]` queries, snapshot current cache value, optimistically write `likeCount + 1`. `onError`: restore the snapshot. `onSettled`: invalidate `["counter"]` to resync with the server.
  - `useVisitMutation()` — `useMutation({ mutationFn: incrementVisitCount })`. `onSuccess`: invalidate `["counter"]` so the visible visit count updates (previously the UI never reflected the increment until a full reload — this is an intentional small UX fix).
- `src/components/hero-stats.tsx`: internals replaced, **public API unchanged** (`HeroStatsProvider`, `useHeroStats`, `LikeBadge`, `VisitLikeCounter` keep the same signatures, so no other file changes).
  - Remove `useOptimistic`/`useTransition`.
  - `HeroStatsProvider` calls `useCounterQuery({ likeCount: initialLikeCount, visitCount: initialVisitCount })` for data and `useLikeMutation()`/`useVisitMutation()` for actions.
  - Mount `useEffect` calls `visitMutation.mutate()` once, same as today.
  - `like()` calls `likeMutation.mutateAsync()` wrapped in the same `toast.promise(...)` loading/success/error copy as today.
- `src/app/page.tsx`: replace `Promise.all([getLikeCount(), getVisitCount()])` with a single `getCounter()` call.

## Contact form mutation

- `src/actions/send-email.ts`: unchanged. Keeps returning `{ error }` on validation/send failure or `{ data }` on success (no throw) — this is already a clean discriminated result, and converting it to throw-on-error would just relocate the same branching.
- New `src/hooks/use-send-email.ts` (`"use client"`): `useSendEmailMutation()` — `useMutation({ mutationFn: sendEmail })`.
- `src/components/section/contact-section.tsx`: form switches from `<form action={sendEmail}>` to `<form onSubmit={...}>`. Handler calls `event.preventDefault()`, builds `FormData` from the form element, then calls `mutation.mutate(formData, { onSuccess: (result) => result.error ? toast.error(result.error) : toast.success(...) })`. Toast copy unchanged.
- `src/components/section/contact-submit-button.tsx`: `useFormStatus()` only works inside a `<form action={...}>` boundary, which is being removed. `SubmitBtn` switches to accepting `isPending: boolean` as a prop, supplied from the mutation's `isPending` in `ContactSection`.

## Out of scope

- No changes to the Prisma schema, rate limiting, or email sending logic.
- No global query defaults beyond library defaults (staleTime, retry, etc.) — not requested, and the app's data needs are simple enough that defaults are fine.
- No SSR prefetch/hydration boilerplate (explicitly decided against in favor of `initialData`).
