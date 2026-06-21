import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Airflow } from "@/components/ui/svgs/airflow";
import { Fastapi } from "@/components/ui/svgs/fastapi";
import { Mongodb } from "@/components/ui/svgs/mongodb";
import { Opensearch } from "@/components/ui/svgs/opensearch";

export const DATA = {
  name: "Subhranshu Pati",
  initials: "SP",
  url: "https://subhranshu.com",
  location: "Delhi, IN",
  locationLink: "https://www.google.com/maps/place/delhi",
  description:
    "Generative AI Engineer. From idea to production, building software that scales with both users and ambition.",
  summary:
    "Currently building AI-powered compliance software at [Everstar](https://www.everstar.ai) while pursuing a Master's in Computer Science (AI) through [Georgia Tech's OMSCS program](https://omscs.gatech.edu). I enjoy solving hard technical problems across agents, retrieval systems, AI infrastructure, and large-scale knowledge systems.",
  avatarUrl: "/me.png",
  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "Python", icon: Python },
    { name: "Airflow", icon: Airflow },
    { name: "FastAPI", icon: Fastapi },
    { name: "MongoDB", icon: Mongodb },
    { name: "Opensearch", icon: Opensearch },
    { name: "Postgres", icon: Postgresql },
    { name: "Docker", icon: Docker },
    { name: "Kubernetes", icon: Kubernetes },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "work.suhbranshu@gmail.com",
    tel: "+919289059666",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://dub.sh/dillion-github",
        icon: Icons.github,
        navbar: true,
      },

      LinkedIn: {
        name: "LinkedIn",
        url: "https://dub.sh/dillion-linkedin",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://dub.sh/dillion-twitter",
        icon: Icons.x,

        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https://dub.sh/dillion-youtube",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Everstar",
      href: "https://everstar.ai",
      badges: [],
      location: "Remote",
      title: "Founding Software Engineer",
      logoUrl: "/everstar.svg",
      start: "May 2024",
      end: "June, 2026",
      description:
        "Designed and deployed AI infrastructure on GCP using Kubernetes, Airflow, FastAPI, MongoDB, and OpenSearch. Built large-scale retrieval systems over 3M+ regulatory documents powering semantic search, citations, and knowledge discovery. Developed agentic AI workflows, document ingestion pipelines, and automated document generation systems capable of producing and revising thousand-page regulatory submissions. Shipped production-grade AI experiences including streaming chat, search, and compliance-focused drafting tools.",
    },
    {
      company: "Ethica",
      badges: [],
      href: "https://www.heyethica.com",
      location: "Remote",
      title: "Software Engineer",
      logoUrl: "/ethica.png",
      start: "September, 2023",
      end: "April 2024",
      description:
        "Built a Generative AI-powered real estate search platform that transformed spoken lifestyle preferences into personalized property recommendations. Developed end-to-end workflows combining speech transcription, LLM-based information extraction, and intelligent ranking across thousands of property listings. Shipped production features using Next.js, Supabase, Prisma, OpenAI, Anthropic, AssemblyAI, and Mapbox, improving house search efficiency by 1.5×",
    }
  ],
  education: [
    {
      school: "Georgia Institute of Technology",
      href: "https://omscs.gatech.edu",
      degree: "Master's Degree of Computer Science (OMSCS)",
      logoUrl: "/gt.png",
      start: "2026",
      end: "2028",
    },
    {
      school: "Vellore Institute of Technology",
      href: "https://vit.ac.in",
      degree: "Bachelor of Technology in Computer Science and Engineering (B.Tech)",
      logoUrl: "/vit.png",
      start: "2020",
      end: "2024",
    },
  ],
  projects: [
    {
      title: "Chat Collect",
      href: "https://chatcollect.com",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://chatcollect.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
    },
    {
      title: "Magic UI",
      href: "https://magicui.design",
      dates: "June 2023 - Present",
      active: true,
      description:
        "Designed, developed and sold animated UI components for developers.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://magicui.design",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/magicuidesign/magicui",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    },
    {
      title: "llm.report",
      href: "https://llm.report",
      dates: "April 2023 - September 2023",
      active: true,
      description:
        "Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://llm.report",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/dillionverma/llm.report",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.llm.report/openai-demo.mp4",
    },
    {
      title: "Automatic Chat",
      href: "https://automatic.chat",
      dates: "April 2023 - March 2024",
      active: true,
      description:
        "Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://automatic.chat",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
    },
  ],
  hackathons: [],
} as const;
