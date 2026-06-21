# TanStack Query for Server Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce TanStack Query as the data layer for all five server actions (`getCounter` (merged from `getLikeCount`/`getVisitCount`), `incrementLikeCount`, `incrementVisitCount`, `sendEmail`), replacing the hand-rolled `useOptimistic`/`useTransition` state in `hero-stats.tsx` and the manual `<form action>` + `useFormStatus` flow in the contact form.

**Architecture:** A single `QueryClientProvider` wraps the app in `layout.tsx`. Server Components keep fetching initial data directly (no dehydrate/hydrate boilerplate) and pass it into `useQuery`'s `initialData`. Each server action gets a thin `"use client"` hook wrapper in a new `src/hooks/` directory; existing component public APIs (`HeroStatsProvider`, `useHeroStats`, `LikeBadge`, `VisitLikeCounter`) are preserved so call sites outside the refactored files don't change.

**Tech Stack:** Next.js 16 (App Router), React 19, TanStack Query v5, Bun (package manager and script runner — this repo uses `bun.lock`, not npm/yarn).

## Global Constraints

- Package manager is Bun. Use `bun install`, `bun run <script>`, `bun x <bin>` — never `npm`/`npx`/`yarn`.
- No automated test framework exists in this repo (no Jest/Vitest, no `*.test.*` files). Do not introduce one — out of scope per the design spec. Each task's verification gate is: `bun x tsc --noEmit` (type-check), `bun run lint` (ESLint), `bun run build` (production build, which also runs `prisma generate`), plus a manual check against the dev server (`bun run dev`) for behavior that only shows up at runtime.
- Query key for the counter resource is always `["counter"]` — defined once in `src/hooks/use-counter.ts` as `counterQueryKey` and imported anywhere else it's needed. Don't hand-write `["counter"]` elsewhere.
- `QueryClient` instances must be created with `useState(() => new QueryClient())` inside a `"use client"` component — never at module scope — so concurrent SSR requests don't share state.
- `ReactQueryDevtools` renders only when `process.env.NODE_ENV !== "production"`.
- Preserve existing toast copy exactly: `"Incrementing..."` / `"Thanks for the wave!"` / `"Rate limit exceeded. Retry again soon."` for likes, `"Email sent successfully!"` for the contact form.
- Preserve the `HeroStatsProvider` / `useHeroStats` / `LikeBadge` / `VisitLikeCounter` export names and prop signatures from `src/components/hero-stats.tsx` exactly — no other file should need to change because of this refactor.
- `src/actions/send-email.ts` is NOT modified — it keeps returning `{ error: string }` or `{ data: ... }` (no throw). This already type-checks today (verified via `bun x tsc --noEmit` against the current `const { error } = await sendEmail(formData)` call site).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `package.json` / `bun.lock` | Modify | Add `@tanstack/react-query`, `@tanstack/react-query-devtools` |
| `src/components/providers/query-provider.tsx` | Create | Owns the `QueryClient` instance, renders `QueryClientProvider` + dev-only `ReactQueryDevtools` |
| `src/app/layout.tsx` | Modify | Wrap children in `QueryProvider` |
| `src/actions/count.ts` | Modify | Replace `getLikeCount`/`getVisitCount` with one `getCounter()`, export `Counter` type |
| `src/hooks/use-counter.ts` | Create | `useCounterQuery`, `useLikeMutation`, `useVisitMutation`, `counterQueryKey` |
| `src/components/hero-stats.tsx` | Modify | Internals swapped to the new hooks; public API unchanged |
| `src/app/page.tsx` | Modify | Call `getCounter()` instead of `getLikeCount()`/`getVisitCount()` |
| `src/hooks/use-send-email.ts` | Create | `useSendEmailMutation` |
| `src/components/section/contact-section.tsx` | Modify | `onSubmit` + `mutate` instead of `<form action>` |
| `src/components/section/contact-submit-button.tsx` | Modify | Accept `isPending` prop instead of `useFormStatus()` |

---

## Task 1: QueryClientProvider setup

**Files:**
- Modify: `package.json`, `bun.lock` (via `bun add`)
- Create: `src/components/providers/query-provider.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `QueryProvider` component (default export is named export `QueryProvider`, takes `{ children: ReactNode }`), used by Task 2 and Task 3's consumers indirectly (they just need a `QueryClientProvider` somewhere above them in the tree, which this task provides at the root).

- [ ] **Step 1: Install dependencies**

```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

- [ ] **Step 2: Create the provider**

Create `src/components/providers/query-provider.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

- [ ] **Step 3: Wire the provider into the root layout**

In `src/app/layout.tsx`, add the import alongside the other provider imports:

```tsx
import { QueryProvider } from "@/components/providers/query-provider";
```

Then wrap the existing `<ThemeProvider>` tree in it. Change:

```tsx
        <Metrics />
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
```

to:

```tsx
        <Metrics />
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <TooltipProvider delayDuration={0}>
```

And close it at the matching end. Change:

```tsx
          </TooltipProvider>
        </ThemeProvider>
      </body>
```

to:

```tsx
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
```

(Re-indent the lines between the new wrapping tags by two spaces to match — `Navbar`, `Toaster`, the flickering grid `div`, and the content `div`.)

- [ ] **Step 4: Verify**

```bash
bun x tsc --noEmit
bun run lint
bun run build
```

Expected: all three exit with status 0, no errors.

Then run `bun run dev`, open `http://localhost:3000` in a browser, and confirm:
- The page renders with no console errors.
- A floating TanStack Query devtools icon appears in a corner of the page.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock src/components/providers/query-provider.tsx src/app/layout.tsx
git commit -m "feat: add TanStack Query provider"
```

---

## Task 2: Counter feature (likes + visits)

**Files:**
- Modify: `src/actions/count.ts`
- Create: `src/hooks/use-counter.ts`
- Modify: `src/components/hero-stats.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `QueryProvider` from Task 1 (must be mounted above these components in the tree — already true via root layout).
- Produces: `Counter` type and `getCounter(): Promise<Counter>` from `src/actions/count.ts`. `counterQueryKey`, `useCounterQuery(initialData: Counter)`, `useLikeMutation()`, `useVisitMutation()` from `src/hooks/use-counter.ts`. These are consumed only within this task's own files — no other task depends on them.

- [ ] **Step 1: Replace `getLikeCount`/`getVisitCount` with `getCounter` in `src/actions/count.ts`**

Replace the two functions (currently lines 29-57) with:

```ts
export type Counter = {
  likeCount: number;
  visitCount: number;
};

export const getCounter = async (): Promise<Counter> => {
  try {
    const counter = await db.counter.findFirst({
      where: {
        id: 1,
      },
    });

    return {
      likeCount: counter?.likeCount ?? 96,
      visitCount: counter?.visitCount ?? 96,
    };
  } catch (error) {
    console.error("Error getting counter:", error);
    return { likeCount: 96, visitCount: 96 };
  }
};
```

`incrementLikeCount` and `incrementVisitCount` (currently lines 59-110) stay exactly as they are — leave them untouched below the new `getCounter`.

- [ ] **Step 2: Create `src/hooks/use-counter.ts`**

```ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCounter,
  incrementLikeCount,
  incrementVisitCount,
  type Counter,
} from "@/actions/count";

export const counterQueryKey = ["counter"] as const;

export function useCounterQuery(initialData: Counter) {
  return useQuery({
    queryKey: counterQueryKey,
    queryFn: getCounter,
    initialData,
  });
}

export function useLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementLikeCount,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: counterQueryKey });
      const previous = queryClient.getQueryData<Counter>(counterQueryKey);
      if (previous) {
        queryClient.setQueryData<Counter>(counterQueryKey, {
          ...previous,
          likeCount: previous.likeCount + 1,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(counterQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: counterQueryKey });
    },
  });
}

export function useVisitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementVisitCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counterQueryKey });
    },
  });
}
```

- [ ] **Step 3: Refactor `src/components/hero-stats.tsx` internals**

Replace the entire file with:

```tsx
"use client";

import {
  useCounterQuery,
  useLikeMutation,
  useVisitMutation,
} from "@/hooks/use-counter";
import { createContext, useContext, useEffect, type ReactNode } from "react";
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
  const { data } = useCounterQuery({
    likeCount: initialLikeCount,
    visitCount: initialVisitCount,
  });
  const likeMutation = useLikeMutation();
  const visitMutation = useVisitMutation();

  useEffect(() => {
    visitMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const like = () => {
    toast.promise(likeMutation.mutateAsync(), {
      loading: "Incrementing...",
      success: "Thanks for the wave!",
      error: "Rate limit exceeded. Retry again soon.",
    });
  };

  return (
    <HeroStatsContext.Provider
      value={{
        likeCount: data.likeCount,
        visitCount: data.visitCount,
        isPending: likeMutation.isPending,
        like,
      }}
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
      disabled={isPending}
      className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border bg-background text-lg shadow-md ring-2 ring-background transition-transform hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-70"
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

- [ ] **Step 4: Update `src/app/page.tsx` to use `getCounter`**

Change the import (currently line 20):

```tsx
import { getLikeCount, getVisitCount } from "@/actions/count";
```

to:

```tsx
import { getCounter } from "@/actions/count";
```

Change the data fetch (currently lines 30-33):

```tsx
  const [likeCount, visitCount] = await Promise.all([
    getLikeCount(),
    getVisitCount(),
  ]);
```

to:

```tsx
  const { likeCount, visitCount } = await getCounter();
```

The JSX below (`<HeroStatsProvider initialLikeCount={likeCount} initialVisitCount={visitCount}>`) does not need to change — the destructured variable names stay the same.

- [ ] **Step 5: Verify**

```bash
bun x tsc --noEmit
bun run lint
bun run build
```

Expected: all three exit with status 0, no errors.

Then run `bun run dev`, open `http://localhost:3000`, and confirm:
- The hero shows the like and visit counts (matching what was in the DB before this change).
- Clicking the wave button (👋) immediately bumps the like count by 1, shows the "Incrementing..." then "Thanks for the wave!" toast, and the button briefly shows 🙌 while disabled.
- Reloading the page in a fresh private/incognito window (so the `hasVisited` cookie isn't set) shows the visit count one higher than before, without a full page reload required to see it tick up (it should update live once `incrementVisitCount` resolves).
- In the React Query devtools panel, a `["counter"]` query is listed with the current data.

- [ ] **Step 6: Commit**

```bash
git add src/actions/count.ts src/hooks/use-counter.ts src/components/hero-stats.tsx src/app/page.tsx
git commit -m "feat: move counter likes/visits onto TanStack Query"
```

---

## Task 3: Contact form mutation

**Files:**
- Create: `src/hooks/use-send-email.ts`
- Modify: `src/components/section/contact-section.tsx`
- Modify: `src/components/section/contact-submit-button.tsx`

**Interfaces:**
- Consumes: `QueryProvider` from Task 1. `sendEmail` from `src/actions/send-email.ts` (unchanged, returns `Promise<{ error: string } | { data: unknown }>`).
- Produces: `useSendEmailMutation()` from `src/hooks/use-send-email.ts`, consumed only by `contact-section.tsx` in this task. `SubmitBtn` now requires an `isPending: boolean` prop — this is a breaking change to `SubmitBtn`'s signature, but it has exactly one call site (`contact-section.tsx`), updated in the same task.

- [ ] **Step 1: Create `src/hooks/use-send-email.ts`**

```ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { sendEmail } from "@/actions/send-email";

export function useSendEmailMutation() {
  return useMutation({
    mutationFn: sendEmail,
  });
}
```

- [ ] **Step 2: Update `src/components/section/contact-section.tsx`**

Replace the entire file with:

```tsx
"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendEmailMutation } from "@/hooks/use-send-email";
import SubmitBtn from "./contact-submit-button";
import { toast } from "sonner";
import type { FormEvent } from "react";

export default function ContactSection() {
  const mutation = useSendEmailMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutation.mutate(formData, {
      onSuccess: (result) => {
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Email sent successfully!");
      },
    });
  };

  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in Touch
        </h2>
        <form
          className="mt-4 flex w-full max-w-md flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            name="senderEmail"
            type="email"
            required
            maxLength={500}
            placeholder="Your email"
          />
          <Textarea
            name="message"
            required
            maxLength={5000}
            placeholder="Your message"
            className="min-h-32"
          />
          <SubmitBtn isPending={mutation.isPending} />
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update `src/components/section/contact-submit-button.tsx`**

Replace the entire file with:

```tsx
"use client";

import { Loader2Icon, SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SubmitBtn({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="h-11 w-32 rounded-full">
      {isPending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <>
          Send
          <SendIcon className="size-3.5" />
        </>
      )}
    </Button>
  );
}
```

- [ ] **Step 4: Verify**

```bash
bun x tsc --noEmit
bun run lint
bun run build
```

Expected: all three exit with status 0, no errors.

Then run `bun run dev`, open `http://localhost:3000`, scroll to the Contact section, and confirm:
- Submitting with an empty/invalid email shows the browser's native validation (unchanged, still using `required`/`type="email"`).
- Submitting a valid email + message shows the submit button switch to a spinner, then either an error toast (if `RESEND_API_KEY` test-mode restrictions reject the send) or "Email sent successfully!" — matching pre-refactor behavior.
- No console warnings about `useFormStatus` being used outside a form action (confirms the prop-based pending state is wired correctly).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-send-email.ts src/components/section/contact-section.tsx src/components/section/contact-submit-button.tsx
git commit -m "feat: move contact form send onto TanStack Query"
```

---

## Self-Review Notes

- **Spec coverage:** Architecture/setup → Task 1. Counter feature (merged `getCounter`, optimistic like mutation, visit-count cache invalidation, unchanged `HeroStatsProvider` public API, `page.tsx` update) → Task 2. Contact form mutation (`onSubmit` + `mutate`, `SubmitBtn` prop change) → Task 3. All spec sections covered.
- **Placeholder scan:** No TBDs; every step has complete, runnable code or exact commands.
- **Type consistency:** `Counter` type defined once in `src/actions/count.ts`, imported by `src/hooks/use-counter.ts` — not redefined. `counterQueryKey` defined once, imported wherever needed. `SubmitBtn`'s `isPending` prop name matches what `contact-section.tsx` passes (`mutation.isPending`).
