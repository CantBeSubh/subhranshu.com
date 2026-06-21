# Avatar Click-to-Zoom — Design

## Goal
Clicking the profile picture in the hero section opens a larger view of the same image in a centered lightbox.

## Components
1. **`src/components/ui/dialog.tsx`** — standard shadcn Dialog primitive, built on `@radix-ui/react-dialog` (new dependency). Generic/reusable, not avatar-specific.
2. **`src/app/page.tsx`** — wrap the existing `Avatar` in `Dialog` / `DialogTrigger asChild`. `DialogContent` renders a larger `<img src={DATA.avatarUrl}>`.

## Interaction
- Click avatar → dialog opens, backdrop dimmed, image capped at `min(80vh, 600px)` square, centered.
- Entrance/exit: fade + scale via `tw-animate-css` (already a project dependency), matching shadcn's default `data-[state=open]:animate-in` / `data-[state=closed]:animate-out` pattern.
- Dismiss: click backdrop, click image again, or `Escape` — handled by Radix Dialog out of the box.
- Avatar gets a hover affordance (cursor-pointer, slight scale) signaling it's clickable.

## Scope
Only the hero avatar. No other images get this treatment. No new image asset needed — `/me.png` is already 1122×1122, sharp enough to zoom.
