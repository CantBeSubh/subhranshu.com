# Migrate Real Project Data into resume.tsx Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 4 placeholder/template projects in `src/data/resume.tsx` (`DATA.projects`) with the 4 real projects (RAG Ollama, RudeGPT, Sentiment Analyzer, GetGud) currently defined in the old portfolio's `lib/data.ts` (`projectsData`), remapped to the new schema, and bring over the preview images those projects need.

**Architecture:** This is a content-migration task, not a behavior change. No new components or logic are introduced — `ProjectCard` (`src/components/project-card.tsx`) and `ProjectsSection` (`src/components/section/projects-section.tsx`) already render whatever is in `DATA.projects` and require no changes. Work is: (1) copy 4 PNG files into `public/`, (2) replace the `projects` array literal in `src/data/resume.tsx`, (3) verify lint/build/visual rendering.

**Tech Stack:** Next.js, TypeScript, the existing `Icons` map in `src/components/icons.tsx` (already exports `globe` and `youtube`, both used below — no new icons needed).

## Global Constraints

- Do not modify `ProjectCard` or `ProjectsSection` — only `src/data/resume.tsx` and `public/*.png` are in scope.
- `image` values must be root-relative public paths (e.g. `"/ragOllama.png"`), matching the existing pattern used by `logoUrl` fields elsewhere in `DATA` (e.g. `"/everstar.svg"`) — `ProjectCard` renders `image` via a plain `<img src>`, not `next/image`, so no static import is needed or wanted.
- Preserve the file's existing 2-space indentation and formatting style (see `work` and `education` arrays in `src/data/resume.tsx`) — do not reformat unrelated parts of the file.
- Obvious spelling typos in the source copy (`achived` → `achieved`, `elagant` → `elegant`) are corrected during migration. The tag `"Garfbase"` is corrected to `"Firebase"` (confirmed by user). Dates are fixed values provided by the user: RAG Ollama `2023`, RudeGPT `2023`, Sentiment Analyzer `2024`, GetGud `2024`.
- The 4 placeholder projects (Chat Collect, Magic UI, llm.report, Automatic Chat) are fully removed — replaced, not appended to (confirmed by user).
- No test framework exists in this repo (`package.json` has no jest/vitest/playwright dependency) — verification is lint + `next build` (type-checks JSX/TS) + manual visual check via `next dev`, not unit tests.

---

### Task 1: Copy project preview images into `public/`

**Files:**
- Create: `public/ragOllama.png` (copied from `/Users/subhr/Documents/github/subhranshu.com/public/ragOllama.png`)
- Create: `public/rudegpt.png` (copied from `/Users/subhr/Documents/github/subhranshu.com/public/rudegpt.png`)
- Create: `public/analyzer.png` (copied from `/Users/subhr/Documents/github/subhranshu.com/public/analyzer.png`)
- Create: `public/getgud.png` (copied from `/Users/subhr/Documents/github/subhranshu.com/public/getgud.png`)

**Interfaces:**
- Produces: four files at root-relative paths `/ragOllama.png`, `/rudegpt.png`, `/analyzer.png`, `/getgud.png`, which Task 2's `image` fields reference directly.

- [ ] **Step 1: Copy the four PNG files**

```bash
cp /Users/subhr/Documents/github/subhranshu.com/public/ragOllama.png /Users/subhr/Documents/github/subhranshu.com.rework_1/public/ragOllama.png
cp /Users/subhr/Documents/github/subhranshu.com/public/rudegpt.png /Users/subhr/Documents/github/subhranshu.com.rework_1/public/rudegpt.png
cp /Users/subhr/Documents/github/subhranshu.com/public/analyzer.png /Users/subhr/Documents/github/subhranshu.com.rework_1/public/analyzer.png
cp /Users/subhr/Documents/github/subhranshu.com/public/getgud.png /Users/subhr/Documents/github/subhranshu.com.rework_1/public/getgud.png
```

- [ ] **Step 2: Verify the files exist and are valid PNGs**

Run: `file public/ragOllama.png public/rudegpt.png public/analyzer.png public/getgud.png`
Expected: each line reports `PNG image data` (no "No such file or directory", no corruption).

- [ ] **Step 3: Commit**

```bash
git add public/ragOllama.png public/rudegpt.png public/analyzer.png public/getgud.png
git commit -m "chore: add project preview images for RAG Ollama, RudeGPT, Sentiment Analyzer, GetGud"
```

---

### Task 2: Replace the `projects` array in `src/data/resume.tsx`

**Files:**
- Modify: `src/data/resume.tsx:130-253` (the entire `projects: [...]` array, which currently holds the 4 placeholder template projects)

**Interfaces:**
- Consumes: `Icons.globe` and `Icons.youtube` from `src/components/icons.tsx` (both already exported — confirmed present, no changes needed there). Consumes the image paths produced by Task 1.
- Produces: `DATA.projects` — a readonly array of 4 objects matching the shape `{ title: string; href: string; dates: string; active: boolean; description: string; technologies: string[]; links: { type: string; href: string; icon: React.ReactNode }[]; image: string }[]`, consumed unchanged by `src/components/section/projects-section.tsx:35-53` and `src/components/project-card.tsx`.

- [ ] **Step 1: Replace the projects array**

In `src/data/resume.tsx`, replace the entire block from the `projects: [` line through its closing `],` (currently lines 130–253, the 4 placeholder projects: Chat Collect, Magic UI, llm.report, Automatic Chat) with:

```tsx
  projects: [
    {
      title: "RAG Ollama",
      href: "https://youtu.be/_lw3qa5kXpY",
      dates: "2023",
      active: true,
      description:
        "An Adaptive RAG app that uses Ollama & LangGraph to retrieve answers to user questions from provided documents or from the internet.",
      technologies: [
        "Next.js",
        "Langchain",
        "LangSmith",
        "LangGraph",
        "ChromaDB",
        "FastAPI",
      ],
      links: [
        {
          type: "Demo",
          href: "https://youtu.be/_lw3qa5kXpY",
          icon: <Icons.youtube className="size-3" />,
        },
      ],
      image: "/ragOllama.png",
    },
    {
      title: "RudeGPT",
      href: "https://youtu.be/6XJ6II8VIl8?si=9pXdpFJqz-afEltb",
      dates: "2023",
      active: true,
      description:
        "An unconventional ChatGPT bootleg with an attitude, achieved by using prompt engineering and a customized prompt engine.",
      technologies: [
        "Next.js",
        "AWS Amplify",
        "AWS Cognito",
        "AWS Appsync",
        "OpenAI",
      ],
      links: [
        {
          type: "Demo",
          href: "https://youtu.be/6XJ6II8VIl8?si=9pXdpFJqz-afEltb",
          icon: <Icons.youtube className="size-3" />,
        },
      ],
      image: "/rudegpt.png",
    },
    {
      title: "Sentiment Analyzer",
      href: "https://sentiment-analyzer.subhranshu.com/",
      dates: "2024",
      active: true,
      description:
        "A sentiment analysis and review management tool that uses Hugging Face's transformers library to analyze the sentiment of given movie reviews.",
      technologies: ["Next.js", "Shadcn UI", "TailwindCSS", "Hugging Face"],
      links: [
        {
          type: "Website",
          href: "https://sentiment-analyzer.subhranshu.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/analyzer.png",
    },
    {
      title: "GetGud",
      href: "https://getgud.subhranshu.com/",
      dates: "2024",
      active: true,
      description:
        "A todos and habits tracker with sleek and elegant UI and UX, built with custom styling and animations.",
      technologies: ["Next.js", "Firebase", "SCSS"],
      links: [
        {
          type: "Website",
          href: "https://getgud.subhranshu.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/getgud.png",
    },
  ],
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors reported for `src/data/resume.tsx`.

- [ ] **Step 3: Run a production build to type-check**

Run: `npm run build`
Expected: build completes successfully (`Compiled successfully`), confirming the new array satisfies the `DATA` const's inferred type and the JSX `icon` fields type-check.

- [ ] **Step 4: Commit**

```bash
git add src/data/resume.tsx
git commit -m "feat: replace placeholder projects with real project data"
```

---

### Task 3: Visually verify the Projects section

**Files:**
- None (manual verification only).

**Interfaces:**
- Consumes: the running app at `http://localhost:3000`, specifically the `#projects` section rendered by `src/components/section/projects-section.tsx`.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server starts and logs a local URL (typically `http://localhost:3000`).

- [ ] **Step 2: Open the Projects section in a browser and confirm**

Navigate to `http://localhost:3000/#projects` and confirm:
- Exactly 4 project cards render: RAG Ollama, RudeGPT, Sentiment Analyzer, GetGud (no Chat Collect / Magic UI / llm.report / Automatic Chat remaining).
- Each card shows its PNG thumbnail (not a blank gray placeholder, which would indicate a broken image path).
- RAG Ollama and RudeGPT show a "Demo" badge linking to the YouTube URLs; Sentiment Analyzer and GetGud show a "Website" badge linking to their live URLs.
- Dates render as "2023" / "2023" / "2024" / "2024" respectively.
- Technology badges include "Firebase" (not "Garfbase") under GetGud.

- [ ] **Step 3: Stop the dev server**

Stop the `npm run dev` process (Ctrl+C).
