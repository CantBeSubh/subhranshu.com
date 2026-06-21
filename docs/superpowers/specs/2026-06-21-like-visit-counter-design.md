# Like/Visit Counter: Migrate count.ts and Its Usage

## Context

The previous site (`../subhranshu.com/actions/count.ts`) tracks two numbers
in a single-row Postgres `Counter` table: a visit count (incremented once
per visitor via a cookie-gated effect) and a like count (incremented by
clicking a "👋" wave emoji, rate-limited via Upstash Redis). The old
`components/intro.tsx` wires this up: it fetches both counts server-side
in `app/page.tsx`, increments visit count on mount, and renders an
optimistic-update wave button plus a `total_visits | likes` text line via
a `Counter` component.

This project's `.env.local` already has `DATABASE_URL`, `DIRECT_URL`,
`UPSTASH_REDIS_REST_TOKEN`, and `UPSTASH_REDIS_REST_URL` — copied from the
old site, pointing at the **same production Supabase Postgres and Upstash
Redis instance**. The `Counter` row (id=1) already exists there with real
data. This project has no Prisma setup at all yet (no `prisma/` folder, no
`@prisma/client`, no `src/lib/db.ts`).

The redesigned hero (`src/app/page.tsx`) has no equivalent UI today — it's
a `BlurFadeText` name/description block next to an `Avatar` with a
click-to-zoom `Dialog` (see `2026-06-21-avatar-zoom-design.md`).

## Goals

- Port `getLikeCount`, `getVisitCount`, `incrementLikeCount`,
  `incrementVisitCount` into this project, functionally unchanged.
- Recreate the wave-button + counter-text UI, restyled to match this
  project's design language, integrated into the existing hero layout.
- Bootstrap Prisma in this project against the **existing** production
  `Counter` table without running any migration against it.

## Non-Goals

- No schema changes to the `Counter` table.
- No changes to the rate-limit policy (stays 5 requests / 5s per IP).
- No automated tests (none exist in this project today); verification is
  manual.
- No changes to other hero elements (name/description text, avatar zoom
  dialog) beyond adding the new pieces alongside them.

## Design

### 1. Prisma bootstrap — `prisma/schema.prisma`, `src/lib/db.ts`

Hand-author `prisma/schema.prisma` at the repo root, copied from the old
project's schema (not introspected — the shape is already known and
introspection would mean running a command against prod before anything
is reviewed):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Counter {
  id         Int @id @default(autoincrement())
  likeCount  Int @default(0) @map("like_count")
  visitCount Int @default(0) @map("visit_count")
}
```

`src/lib/db.ts` — Prisma client singleton, same dev-global pattern as the
old `lib/db.ts`.

**Safety constraint:** only `bunx prisma generate` is run (generates the
TS client locally from the schema). No `prisma migrate dev`, no
`prisma db push`, no `prisma db pull` — the live table is not touched.

### 2. Server actions — `src/actions/count.ts`

Ported verbatim from `../subhranshu.com/actions/count.ts`: same 4 exports,
same Upstash `Ratelimit.slidingWindow(5, "5 s")` keyed on
`x-forwarded-for`, same `db.counter.findFirst`/`update` calls on `id: 1`,
same fallback default of `96` on read failure, same
`revalidatePath("/", "page")` after a successful like increment, same
10-minute `hasVisited` cookie gating the visit increment. Only the import
path changes (`@/lib/db`, matching this repo's existing alias).

### 3. Hero stats UI — `src/components/hero-stats.tsx`

One client module (`"use client"`) exporting:

- **`HeroStatsProvider`** — takes `initialLikeCount`/`initialVisitCount`
  props. Holds `useOptimistic` like-count state and an `isPending`
  transition, calls `incrementVisitCount()` once in a mount effect, and
  exposes `{ likeCount, isPending, like() }` via context to children.
- **`LikeBadge`** — consumes the context; renders the "👋"/"🙌" emoji
  button. Clicking calls `like()`, which optimistically bumps the count
  and runs `toast.promise(incrementLikeCount(), { loading, success,
  error })` via `sonner` (no manual light/dark `style` object needed —
  this project's `Toaster` is already theme-aware through `next-themes`).
- **`VisitLikeCounter`** — consumes the context; renders the
  `total_visits = … | likes = …` text line using
  `Intl.NumberFormat(..., { notation: "compact" })`, same as the old
  `Counter` component, restyled with `text-muted-foreground text-sm`.

### 4. Hero wiring — `src/app/page.tsx`

`Page` becomes `async`, awaits `getVisitCount()`/`getLikeCount()` up
front, and wraps the existing hero row in
`<HeroStatsProvider initialLikeCount={likeCount} initialVisitCount={visitCount}>`:

- The avatar block gets a `relative` wrapper containing the existing
  `Dialog`/`DialogTrigger`/`Avatar` **and**, as a sibling (not nested
  inside `DialogTrigger`), a `LikeBadge` absolutely positioned on the
  avatar's bottom-right corner. Because it's a sibling rather than a
  descendant of `DialogTrigger`, clicking it cannot also open the zoom
  dialog — no `stopPropagation` needed.
- The text block gets a `VisitLikeCounter` added below the description,
  wrapped in `BlurFade` for entrance-animation consistency with the rest
  of the hero.

### Data flow

1. `Page` (server) fetches both counts, renders `HeroStatsProvider`
   wrapping the hero row.
2. On mount, the provider fires `incrementVisitCount()` (server, cookie-
   gated — no-ops if `hasVisited` cookie is present).
3. Clicking `LikeBadge` optimistically bumps the shared count and calls
   `incrementLikeCount()` (server, rate-limited); `VisitLikeCounter`
   reflects the bump immediately since both read from the same context.
4. `incrementLikeCount` revalidates `/` on success so the next full load
   reflects the persisted count.

### Error handling

Same as the source: rate-limit errors surface through `toast.promise`'s
error branch ("Rate limit exceeded. Retry again soon."); `getLikeCount`/
`getVisitCount` failures are logged server-side and fall back to `96`;
`incrementVisitCount` failures are swallowed (best-effort, non-critical).

## Dependencies

Added (via `bun add`): `@prisma/client`, `@upstash/ratelimit`,
`@upstash/redis`, `dayjs`.
Added (via `bun add -d`): `prisma`.

No new env vars — `DATABASE_URL`, `DIRECT_URL`, `UPSTASH_REDIS_REST_TOKEN`,
`UPSTASH_REDIS_REST_URL` are already present in `.env.local`.

## Verification

- `bun run build` and `bun run lint` must pass.
- Manual check on `bun run dev`:
  - First load increments visit count once; refreshing within 10 minutes
    does not increment it again (cookie gate).
  - Clicking the wave badge bumps the displayed like count immediately
    and persists after a reload.
  - Clicking it more than 5 times within 5 seconds shows the rate-limit
    error toast.
  - Confirm in the database (or via `getLikeCount`/`getVisitCount`) that
    the persisted values match what the live site shows, since this is
    the same production row.
