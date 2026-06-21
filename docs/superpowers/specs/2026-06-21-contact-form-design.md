# Contact Form: Port Working Email Form into Contact Section

## Context

`src/components/section/contact-section.tsx` currently renders a static card
(bordered shell, floating "Contact" pill, `FlickeringGrid` background, heading)
with a paragraph pointing visitors to DM on Twitter — there is no way to
actually send the site owner a message.

The previous site (`../subhranshu.com/components/contact.tsx`) has a working
contact form: a client form posts to a `sendEmail` server action, which
validates input and sends an email via Resend using a React Email template,
with `react-hot-toast` for success/error feedback.

This spec ports that working email-sending behavior into the new site's
existing visual shell, using the new project's conventions (shadcn UI
primitives, `sonner` for toasts, `lucide-react` for icons) instead of
reusing the old site's dependencies verbatim.

`RESEND_API_KEY` already exists in this project's `.env.local` (copied from
the old site), so no environment changes are required.

## Goals

- Visitors can send the site owner an email directly from the Contact
  section.
- The existing visual shell (card, "Contact" pill, `FlickeringGrid`,
  heading) is preserved; the old "DM me on Twitter" paragraph is removed.
- Form primitives and toast notifications match this project's existing
  shadcn conventions rather than the old site's raw styled elements and
  `react-hot-toast`.
- Submit icon uses `lucide-react` (already a project dependency) instead of
  adding `react-icons`.

## Non-Goals

- No changes to the email's visual template design beyond porting it
  as-is into the new project's file layout.
- No automated test suite is being added (none exists in this project
  today); verification is build/lint plus a manual end-to-end send.
- No changes to other sections of the page.

## Design

### 1. Server action — `src/actions/send-email.ts`

`"use server"` action, ported from old `actions/sendEmail.ts`:

- Reads `senderEmail` and `message` from the submitted `FormData`.
- Validates both with a `validateString(value, maxLength)` helper
  (non-empty string under a max length): `senderEmail` ≤ 500 chars,
  `message` ≤ 5000 chars. Returns `{ error: "Invalid sender email" }` or
  `{ error: "Invalid message" }` on failure.
- On valid input, sends via `Resend` (`new Resend(process.env.RESEND_API_KEY)`):
  - `from`: `"Contact Form <onboarding@resend.dev>"`
  - `to`: `DATA.contact.email`
  - `subject`: `"Message from contact form"`
  - `replyTo`: the sender's email
  - `react`: the `ContactFormEmail` template (see below)
- Wraps the `resend.emails.send` call in try/catch; on failure returns
  `{ error: getErrorMessage(error) }`.
- Returns `{ data }` on success.

### 2. Email template — `src/emails/contact-form-email.tsx`

Direct port of old `email/contact-form-email.tsx`: a `Html`/`Head`/`Preview`/
`Tailwind`/`Body`/`Container`/`Section`/`Heading`/`Text`/`Hr` structure from
`@react-email/components` and `@react-email/tailwind`, taking
`{ message, senderEmail }` props and rendering the message body plus the
sender's email.

### 3. Validation/error helpers — `src/lib/utils.ts`

Add two small helpers (ported from old `lib/utils.ts`), alongside the
existing `cn`/`formatDate`:

- `validateString(value: unknown, maxLength: number): boolean` — true if
  `value` is a non-empty string no longer than `maxLength`.
- `getErrorMessage(error: unknown): string` — extracts a readable message
  from a thrown value (string, `Error`, or fallback message).

### 4. UI primitives

Add via shadcn CLI (`bunx shadcn add input textarea sonner`):

- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/sonner.tsx` (wraps the `sonner` package's `Toaster`)

Mount `<Toaster />` once in `src/app/layout.tsx`, alongside the existing
`ThemeProvider`/`TooltipProvider` wrapping.

### 5. Contact section — `src/components/section/contact-section.tsx`

Becomes a `"use client"` component (required for `sonner` toast calls in
the form's submit handler). Keeps the existing outer shell unchanged:
bordered card, floating "Contact" pill, top-half `FlickeringGrid`, and the
`<h2>Get in Touch</h2>` heading.

Replaces the current paragraph (Twitter DM mention) with a form:

- `Input` — `type="email"`, `name="senderEmail"`, `required`,
  `maxLength={500}`, placeholder `"Your email"`.
- `Textarea` — `name="message"`, `required`, `maxLength={5000}`,
  placeholder `"Your message"`.
- A `SubmitBtn` subcomponent, defined in a sibling file
  `src/components/section/contact-submit-button.tsx`, using
  `useFormStatus()` from `react-dom`: shadcn `Button`, showing a `Send`
  icon (lucide) when idle and a spinning `Loader2` icon (lucide) while
  `pending`, disabled while pending.

Form `action`:

```tsx
async (formData: FormData) => {
  const { error } = await sendEmail(formData);
  if (error) {
    toast.error(error);
    return;
  }
  toast.success("Email sent successfully!");
}
```

### Data flow

1. Visitor fills in email + message and submits.
2. Client form action calls the `sendEmail` server action with the
   `FormData`.
3. Server validates, sends the email via Resend with the React Email
   template, returns `{ error }` or `{ data }`.
4. Client shows a `sonner` toast based on the result.

### Error handling

- Same shape as the old site: client-visible errors are surfaced only via
  toast (`"Invalid sender email"`, `"Invalid message"`, or the Resend
  error message via `getErrorMessage`). No inline field-level validation
  UI beyond native HTML `required`/`maxLength`/`type="email"` constraints.

## Dependencies

Added (via `bun add`): `resend`, `@react-email/components`,
`@react-email/tailwind`.

Added (via `bunx shadcn add input textarea sonner`): shadcn `Input`,
`Textarea`, and `Sonner`/`Toaster` components.

No new env vars — `RESEND_API_KEY` is already present in `.env.local`.

## Verification

- `bun run build` and `bun run lint` must pass.
- Manual end-to-end check on `bun run dev`: submit the form with a real
  message and confirm:
  - A success toast appears and an email arrives at
    `work.suhbranshu@gmail.com` (Resend's sandbox sender only delivers to
    the account owner's verified address, which matches `DATA.contact.email`).
  - Submitting with an empty/invalid field shows the appropriate error
    toast and does not send an email.
