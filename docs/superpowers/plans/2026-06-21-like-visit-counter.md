# Like/Visit Counter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `getLikeCount`/`getVisitCount`/`incrementLikeCount`/`incrementVisitCount` from `../subhranshu.com/actions/count.ts` into this project, and recreate the wave-button + counter-text UI from `../subhranshu.com/components/intro.tsx`, restyled into this project's existing hero on `src/app/page.tsx`.

**Architecture:** `src/app/page.tsx` becomes an `async` Server Component that fetches both counts up front and wraps the hero row in a new client module (`src/components/hero-stats.tsx`) exporting `HeroStatsProvider` (holds the shared optimistic like-count state via React Context) plus two consumers — `LikeBadge` (wave-emoji button, positioned on the avatar's corner) and `VisitLikeCounter` (stats text line, positioned below the name/description). The actions themselves (`src/actions/count.ts`) are a near-verbatim port backed by a new `src/lib/db.ts` Prisma client and the existing Upstash Redis credentials.

**Tech Stack:** Next.js 16 (App Router, async Server Components, server actions), TypeScript, React 19 (`useOptimistic`, `useTransition`, Context), Prisma (`@prisma/client`, `prisma`), `@upstash/ratelimit`, `@upstash/redis`, `dayjs`, `sonner` (already installed), `bun` as package manager/runner.

## Global Constraints

- Use `bun` for all installs and verification commands (`bun add`, `bun run build`, `bun run lint`) — this repo has `bun.lock`, not `package-lock.json` or `pnpm-lock.yaml`.
- `DATABASE_URL`, `DIRECT_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_REDIS_REST_URL` already exist in `.env.local` and point at the **same production Supabase Postgres and Upstash Redis instance the live site uses**. The `Counter` row (`id=1`) already exists there with real data.
- Do not run any Prisma command that connects to or mutates that database's schema: no `prisma migrate dev`, `prisma db push`, `prisma db pull`, `prisma studio`. Only `prisma generate` (schema-only, no DB connection) is used in this plan.
- Do not change the rate-limit policy (`Ratelimit.slidingWindow(5, "5 s")`) or the `96` fallback default — this is a functional port, not a redesign.
- Match existing code style in `src/`: double-quoted strings, semicolons (see `src/actions/send-email.ts`, `src/lib/utils.ts`, `src/app/page.tsx`) — the old project's source (no semicolons) is a reference for *logic*, not for *style*.
- Do not commit `docs/superpowers/**` files — write them to disk only.
- No test framework exists in this repo — verification is `bun run lint`, `bun run build`, and a manual `bun run dev` pass.

---

### Task 1: Bootstrap Prisma against the existing `Counter` table

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Modify: `package.json` (scripts), `bun.lock` (via `bun add`)

**Interfaces:**
- Produces: `db` (a `PrismaClient` instance), exported from `src/lib/db.ts` — consumed by Task 2's server actions.

- [ ] **Step 1: Install Prisma**

```bash
bun add @prisma/client
bun add -d prisma
```

Expected: `package.json` `dependencies` gains `@prisma/client`; `devDependencies` gains `prisma`; `bun.lock` updated.

- [ ] **Step 2: Write `prisma/schema.prisma`**

Create `prisma/schema.prisma` at the repo root:

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

This mirrors the existing production table exactly — it is never pushed or migrated, only used to generate a typed client.

- [ ] **Step 3: Write `src/lib/db.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const globalForPrisma = global as unknown as { prisma: typeof db };

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export { db };
```

- [ ] **Step 4: Wire `prisma generate` into install/build**

In `package.json`, change the `"build"` script and add a `"postinstall"` script, so a fresh `bun install` or deploy always has a generated client without ever touching the live database:

```json
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "postinstall": "prisma generate"
  },
```

- [ ] **Step 5: Generate the Prisma client**

```bash
bunx prisma generate
```

Expected: `✔ Generated Prisma Client ... in ./node_modules/@prisma/client` (this only reads the schema file — no network call, no DB connection is attempted).

- [ ] **Step 6: Lint**

Run: `bun run lint`
Expected: no errors in `src/lib/db.ts`.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock prisma/schema.prisma src/lib/db.ts
git commit -m "feat: add Prisma client for existing Counter table"
```

---

### Task 2: Port the count server actions

**Files:**
- Create: `src/actions/count.ts`
- Modify: `package.json`, `bun.lock` (via `bun add`)

**Interfaces:**
- Consumes: `db` from `src/lib/db.ts` (Task 1).
- Produces: `getLikeCount(): Promise<number>`, `getVisitCount(): Promise<number>`, `incrementLikeCount(): Promise<void>`, `incrementVisitCount(): Promise<void>`, all exported from `src/actions/count.ts` — consumed by Task 3 (`incrementLikeCount`, `incrementVisitCount`) and Task 4 (`getLikeCount`, `getVisitCount`).

- [ ] **Step 1: Install dependencies**

```bash
bun add @upstash/ratelimit @upstash/redis dayjs
```

Expected: `package.json` `dependencies` gains `@upstash/ratelimit`, `@upstash/redis`, `dayjs`.

- [ ] **Step 2: Write `src/actions/count.ts`**

```ts
"use server";

import { db } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables are required."
  );
}

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "5 s"),
});

export const getLikeCount = async () => {
  try {
    const count = await db.counter.findFirst({
      where: {
        id: 1,
      },
    });

    return count?.likeCount ?? 96;
  } catch (error) {
    console.error("Error getting like count:", error);
    return 96;
  }
};

export const getVisitCount = async () => {
  try {
    const count = await db.counter.findFirst({
      where: {
        id: 1,
      },
    });

    return count?.visitCount ?? 96;
  } catch (error) {
    console.error("Error getting visit count:", error);
    return 96;
  }
};

export const incrementLikeCount = async () => {
  try {
    const headerStore = await headers();
    const clientIp = headerStore.get("x-forwarded-for") ?? "127.0.0.1";

    const result = await ratelimit.limit(clientIp);
    if (!result.success) {
      throw new Error(
        `Rate limit exceeded. Retry in ${dayjs(result.reset).format("ss")} seconds.`
      );
    }
    await db.counter.update({
      where: {
        id: 1,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
    revalidatePath("/", "page");
  } catch (error) {
    console.error("Error incrementing like count:", error);
    throw error;
  }
};

export const incrementVisitCount = async () => {
  try {
    const cookieStore = await cookies();
    const hasVisited = cookieStore.get("hasVisited");

    if (!hasVisited) {
      await db.counter.update({
        where: {
          id: 1,
        },
        data: {
          visitCount: {
            increment: 1,
          },
        },
      });
      cookieStore.set("hasVisited", "true", {
        expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
      });
    }
  } catch (error) {
    console.error("Error incrementing visit count:", error);
  }
};
```

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: no errors in `src/actions/count.ts`.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock src/actions/count.ts
git commit -m "feat: port count server actions (like/visit tracking)"
```

---

### Task 3: Hero stats client component

**Files:**
- Create: `src/components/hero-stats.tsx`

**Interfaces:**
- Consumes: `incrementLikeCount`, `incrementVisitCount` from `src/actions/count.ts` (Task 2).
- Produces: `HeroStatsProvider({ initialLikeCount: number; initialVisitCount: number; children: ReactNode })`, `LikeBadge()`, `VisitLikeCounter()` — all consumed by Task 4's `src/app/page.tsx`.

- [ ] **Step 1: Write `src/components/hero-stats.tsx`**

```tsx
"use client";

import { incrementLikeCount, incrementVisitCount } from "@/actions/count";
import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useTransition,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type HeroStatsContextValue = {
  likeCount: number;
  visitCount: number;
  isPending: boolean;
  like: () => void;
};

const HeroStatsContext = createContext<HeroStatsContextValue | null>(null);

function useHeroStats() {
  const context = useContext(HeroStatsContext);
  if (!context) {
    throw new Error("useHeroStats must be used within a HeroStatsProvider");
  }
  return context;
}

export function HeroStatsProvider({
  initialLikeCount,
  initialVisitCount,
  children,
}: {
  initialLikeCount: number;
  initialVisitCount: number;
  children: ReactNode;
}) {
  const [likeCount, setOptimisticLikeCount] = useOptimistic(
    initialLikeCount,
    (_current: number, optimisticValue: number) => optimisticValue
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    incrementVisitCount();
  }, []);

  const like = () => {
    startTransition(async () => {
      setOptimisticLikeCount(likeCount + 1);
      toast.promise(incrementLikeCount(), {
        loading: "Incrementing...",
        success: "Thanks for the wave!",
        error: "Rate limit exceeded. Retry again soon.",
      });
    });
  };

  return (
    <HeroStatsContext.Provider
      value={{ likeCount, visitCount: initialVisitCount, isPending, like }}
    >
      {children}
    </HeroStatsContext.Provider>
  );
}

export function LikeBadge() {
  const { isPending, like } = useHeroStats();

  return (
    <button
      type="button"
      aria-label="Send a wave"
      onClick={like}
      className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border bg-background text-lg shadow-md ring-2 ring-background transition-transform hover:scale-110 active:scale-90"
    >
      {isPending ? "🙌" : "👋"}
    </button>
  );
}

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function VisitLikeCounter() {
  const { likeCount, visitCount } = useHeroStats();

  return (
    <p className="text-sm text-muted-foreground">
      total_visits = {formatCompact(visitCount)} | likes ={" "}
      {formatCompact(likeCount)}
    </p>
  );
}
```

`LikeBadge` is designed to be rendered as a **sibling** of the avatar's `Dialog`, inside a shared `relative` wrapper (see Task 4) — never nested inside `DialogTrigger` — so clicking it can never also open the zoom dialog; no `stopPropagation` is needed.

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: no errors in `src/components/hero-stats.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero-stats.tsx
git commit -m "feat: add hero-stats provider, like badge, and visit counter"
```

---

### Task 4: Wire hero stats into `src/app/page.tsx`

**Files:**
- Modify: `src/app/page.tsx:1-64`

**Interfaces:**
- Consumes: `getLikeCount`, `getVisitCount` from `src/actions/count.ts` (Task 2); `HeroStatsProvider`, `LikeBadge`, `VisitLikeCounter` from `src/components/hero-stats.tsx` (Task 3).

- [ ] **Step 1: Replace lines 1–64 of `src/app/page.tsx`**

Replace from the top of the file through the end of the `<section id="hero">` block (the line `</section>` immediately before `<section id="about">`) with:

```tsx
/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight } from "lucide-react";
import { getLikeCount, getVisitCount } from "@/actions/count";
import {
  HeroStatsProvider,
  LikeBadge,
  VisitLikeCounter,
} from "@/components/hero-stats";

const BLUR_FADE_DELAY = 0.04;

export default async function Page() {
  const [likeCount, visitCount] = await Promise.all([
    getLikeCount(),
    getVisitCount(),
  ]);

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <section id="hero">
        <HeroStatsProvider
          initialLikeCount={likeCount}
          initialVisitCount={visitCount}
        >
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
              <div className="gap-2 flex flex-col order-2 md:order-1">
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                  yOffset={8}
                  text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
                />
                <BlurFadeText
                  className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                  delay={BLUR_FADE_DELAY}
                  text={DATA.description}
                />
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                  <VisitLikeCounter />
                </BlurFade>
              </div>
              <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
                <div className="relative">
                  <Dialog>
                    <DialogTrigger className="cursor-pointer transition-transform hover:scale-105">
                      <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                        <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                        <AvatarFallback>{DATA.initials}</AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                    <DialogContent className="aspect-square border-none bg-transparent p-0 shadow-none [&>button]:hidden">
                      <DialogTitle className="sr-only">{DATA.name}</DialogTitle>
                      <DialogClose asChild>
                        <img
                          src={DATA.avatarUrl}
                          alt={DATA.name}
                          className="size-full cursor-pointer rounded-2xl object-cover"
                        />
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <LikeBadge />
                </div>
              </BlurFade>
            </div>
          </div>
        </HeroStatsProvider>
      </section>
```

Everything from `<section id="about">` onward (originally line 65 through the end of the file) is unchanged.

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `bun run build`
Expected: build succeeds. The `prisma generate && next build` script means the Prisma client regenerates first. `getLikeCount`/`getVisitCount` will attempt a real (read-only) query against the production database during the build's prerender of `/` — this is expected and harmless; if the build sandbox has no network access, the try/catch falls back to `96` and logs the error instead of failing the build.

- [ ] **Step 4: Manual end-to-end test**

Run: `bun run dev`, open the site, and confirm:
1. The "👋" badge appears on the bottom-right corner of the avatar, and a `total_visits = … | likes = …` line appears below the name/description.
2. Clicking the avatar still opens the zoom dialog; clicking the badge does **not** open it.
3. Clicking the badge bumps the displayed like count immediately (optimistic) and shows a "Thanks for the wave!" toast; reloading the page shows the persisted count.
4. Clicking the badge more than 5 times within 5 seconds shows the "Rate limit exceeded. Retry again soon." error toast.
5. Reloading within 10 minutes of the first load does not increment the visit count again (check the `hasVisited` cookie in devtools, or compare the displayed count across two quick reloads).

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire like/visit counter into hero"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers spec §1 (Prisma bootstrap, safety constraint of `generate`-only); Task 2 covers spec §2 (server actions, verbatim port); Task 3 covers spec §3 (`HeroStatsProvider`/`LikeBadge`/`VisitLikeCounter`, sibling-of-Dialog placement, `sonner` toast); Task 4 covers spec §4 (hero wiring) and the Data Flow / Error Handling sections. Verification steps cover the spec's manual checklist (visit-cookie gating, optimistic like, rate limit).
- **Type consistency:** `HeroStatsProvider` props (`initialLikeCount`, `initialVisitCount`, `children`) in Task 3 match the call site `<HeroStatsProvider initialLikeCount={likeCount} initialVisitCount={visitCount}>` in Task 4. `getLikeCount`/`getVisitCount`/`incrementLikeCount`/`incrementVisitCount` names and `Promise<number>`/`Promise<void>` shapes in Task 2 match their imports/usages in Tasks 3 and 4.
