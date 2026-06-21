# Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static "DM me on Twitter" card in `src/components/section/contact-section.tsx` with a working contact form that emails the site owner via Resend, ported from the old site's `actions/sendEmail.ts` / `components/contact.tsx`.

**Architecture:** A `"use client"` form in `ContactSection` calls a new server action (`src/actions/send-email.ts`) which validates input and sends a React-Email-templated message via Resend. Client-side feedback uses `sonner` toasts. `Input`/`Textarea`/`Toaster` UI primitives are added as hand-written files matching this project's existing `forwardRef`-based shadcn component style (see `src/components/ui/button.tsx`, `card.tsx`, `tooltip.tsx` — none use `data-slot` attributes), rather than via the `shadcn` CLI, to avoid pulling in a newer/inconsistent component style and to keep the plan deterministic (no network-dependent codegen step).

**Tech Stack:** Next.js (App Router, server actions), TypeScript, Tailwind v4 (CSS-variable theme in `src/app/globals.css`, no `tailwind.config.ts`), `resend`, `@react-email/components`, `@react-email/tailwind`, `sonner`, `lucide-react` (already installed), `bun` as package manager/runner.

## Global Constraints

- Use `bun` for all installs and verification commands (`bun add`, `bun run build`, `bun run lint`) — this repo has `bun.lock`, not `package-lock.json`.
- `RESEND_API_KEY` already exists in `.env.local` — do not add or modify env vars.
- Match existing code style: `forwardRef`-based UI components (no `data-slot`), double quotes are NOT used — this project uses double quotes per existing files shown (`"use client";` etc. — copy exact quote/semicolon style from the file you're editing).
- Do not commit `docs/superpowers/**` files — write them to disk only.
- The outer shell of `ContactSection` (bordered card, floating "Contact" pill, `FlickeringGrid`, `<h2>Get in Touch</h2>`) must remain unchanged; only the paragraph below the heading is replaced.
- No test framework exists in this repo — verification is `bun run lint`, `bun run build`, and a manual `bun run dev` pass.

---

### Task 1: Add validation/error helpers to `src/lib/utils.ts`

**Files:**
- Modify: `src/lib/utils.ts`

**Interfaces:**
- Produces: `validateString(value: unknown, maxLength: number): boolean`, `getErrorMessage(error: unknown): string` — consumed by Task 2's server action.

- [ ] **Step 1: Add the two helper functions**

Append to `src/lib/utils.ts` (after the existing `formatDate` function):

```ts
export const validateString = (value: unknown, maxLength: number): boolean => {
  if (!value || typeof value !== "string" || value.length > maxLength) {
    return false;
  }
  return true;
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }
  return message;
};
```

- [ ] **Step 2: Type-check**

Run: `bun run lint`
Expected: no new errors reported for `src/lib/utils.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add validateString and getErrorMessage helpers"
```

---

### Task 2: Add `resend`, `@react-email/components`, `@react-email/tailwind` and write the email template + server action

**Files:**
- Create: `src/emails/contact-form-email.tsx`
- Create: `src/actions/send-email.ts`
- Modify: `package.json` / `bun.lock` (via `bun add`)

**Interfaces:**
- Consumes: `validateString`, `getErrorMessage` from `src/lib/utils.ts` (Task 1); `DATA.contact.email` from `src/data/resume.tsx`.
- Produces: `sendEmail(formData: FormData): Promise<{ error: string } | { data: unknown }>`, exported from `src/actions/send-email.ts` — consumed by Task 4's form.

- [ ] **Step 1: Install dependencies**

```bash
bun add resend @react-email/components @react-email/tailwind
```

Expected: `package.json` `dependencies` gains `resend`, `@react-email/components`, `@react-email/tailwind`; `bun.lock` is updated.

- [ ] **Step 2: Write the email template**

Create `src/emails/contact-form-email.tsx`:

```tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
};

export default function ContactFormEmail({
  message,
  senderEmail,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from your portfolio site</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-black">
          <Container>
            <Section className="my-10 rounded-md border border-solid border-gray-300 bg-white px-10 py-4">
              <Heading className="leading-tight">
                You received the following message from the contact form
              </Heading>
              <Text>{message}</Text>
              <Hr />
              <Text>The sender&apos;s email is: {senderEmail}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
```

- [ ] **Step 3: Write the server action**

Create `src/actions/send-email.ts`:

```ts
"use server";

import ContactFormEmail from "@/emails/contact-form-email";
import { DATA } from "@/data/resume";
import { getErrorMessage, validateString } from "@/lib/utils";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  let data;
  try {
    data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: DATA.contact.email,
      subject: "Message from contact form",
      replyTo: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
  };
};
```

- [ ] **Step 4: Type-check and lint**

Run: `bun run lint`
Expected: no errors in `src/emails/contact-form-email.tsx` or `src/actions/send-email.ts`.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock src/emails/contact-form-email.tsx src/actions/send-email.ts
git commit -m "feat: add contact form email template and send-email server action"
```

---

### Task 3: Add `Input`, `Textarea` UI primitives and `sonner` toaster

**Files:**
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/sonner.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `package.json` / `bun.lock` (via `bun add sonner`)

**Interfaces:**
- Produces: `Input` (from `input.tsx`), `Textarea` (from `textarea.tsx`) — consumed by Task 4's form. `Toaster` (from `sonner.tsx`), mounted once in `layout.tsx` — required for `toast.success`/`toast.error` calls in Task 4 to render anything.

- [ ] **Step 1: Install `sonner`**

```bash
bun add sonner
```

Expected: `package.json` `dependencies` gains `sonner`.

- [ ] **Step 2: Write `src/components/ui/input.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

- [ ] **Step 3: Write `src/components/ui/textarea.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
```

- [ ] **Step 4: Write `src/components/ui/sonner.tsx`**

```tsx
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
```

- [ ] **Step 5: Mount `<Toaster />` in `src/app/layout.tsx`**

Add the import alongside the other UI imports near the top of `src/app/layout.tsx`:

```tsx
import { Toaster } from "@/components/ui/sonner";
```

Then add `<Toaster />` as a sibling of `<Navbar />`, inside `<TooltipProvider>`, just before the closing `</TooltipProvider>` tag:

```tsx
            <Navbar />
            <Toaster />
          </TooltipProvider>
```

(replacing the current `<Navbar />\n          </TooltipProvider>` lines).

- [ ] **Step 6: Type-check and lint**

Run: `bun run lint`
Expected: no errors in the three new `ui/` files or `layout.tsx`.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock src/components/ui/input.tsx src/components/ui/textarea.tsx src/components/ui/sonner.tsx src/app/layout.tsx
git commit -m "feat: add Input, Textarea, and sonner Toaster UI primitives"
```

---

### Task 4: Add the submit button and wire the form into `ContactSection`

**Files:**
- Create: `src/components/section/contact-submit-button.tsx`
- Modify: `src/components/section/contact-section.tsx`

**Interfaces:**
- Consumes: `sendEmail` from `src/actions/send-email.ts` (Task 2); `Input`, `Textarea` from `src/components/ui/input.tsx` / `textarea.tsx` (Task 3); `Button` from `src/components/ui/button.tsx` (existing).
- Produces: default-exported `SubmitBtn` component from `contact-submit-button.tsx`, used only by `contact-section.tsx`.

- [ ] **Step 1: Write `src/components/section/contact-submit-button.tsx`**

```tsx
"use client";

import { Loader2Icon, SendIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-32 rounded-full"
    >
      {pending ? (
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

- [ ] **Step 2: Rewrite `src/components/section/contact-section.tsx`**

Replace the full file contents with:

```tsx
"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/actions/send-email";
import SubmitBtn from "./contact-submit-button";
import { toast } from "sonner";

export default function ContactSection() {
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
          action={async (formData: FormData) => {
            const { error } = await sendEmail(formData);

            if (error) {
              toast.error(error);
              return;
            }

            toast.success("Email sent successfully!");
          }}
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
          <SubmitBtn />
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 4: Build**

Run: `bun run build`
Expected: build succeeds with no type errors.

- [ ] **Step 5: Manual end-to-end test**

Run: `bun run dev`, open the site, scroll to the Contact section, and:
1. Submit with an empty email field — browser's native `required` validation should block submission (no toast).
2. Submit with a valid email and message — expect a "Email sent successfully!" toast, and an email arriving at `work.suhbranshu@gmail.com` (check inbox) with the submitted message and the sender's email as the reply-to address.

- [ ] **Step 6: Commit**

```bash
git add src/components/section/contact-submit-button.tsx src/components/section/contact-section.tsx
git commit -m "feat: wire working contact form into ContactSection"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers spec §3 (helpers); Task 2 covers spec §1–2 (server action, email template) and the `resend`/`@react-email/*` dependency; Task 3 covers spec §4 (UI primitives, sonner) — implemented as hand-written files instead of the `shadcn` CLI for the reason stated in Architecture above; Task 4 covers spec §5 (form wiring, submit button, data flow, error handling via toasts). Verification steps cover the spec's `bun run build`/`lint`/manual-send checklist.
- **Type consistency:** `sendEmail(formData: FormData)` signature in Task 2 matches the call site `sendEmail(formData)` in Task 4. `SubmitBtn` default export in Task 4 Step 1 matches the `import SubmitBtn from "./contact-submit-button"` in Step 2.
