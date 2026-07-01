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
import { Celery } from "@/components/ui/svgs/celery";
import { Redis } from "@/components/ui/svgs/redis";

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
    { name: "Redis", icon: Redis },
    { name: "Celery", icon: Celery },
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
        url: "https://dub.subhranshu.com/subh-github",
        icon: Icons.github,
        navbar: true,
      },

      LinkedIn: {
        name: "LinkedIn",
        url: "https://dub.subhranshu.com/subh-linkedin",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://dub.subhranshu.com/subh-x",
        icon: Icons.x,

        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "https://dub.subhranshu.com/subh-youtube",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:work.suhbranshu@gmail.com",
        icon: Icons.email,

        navbar: true,
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
      title: "Product Engineer",
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
      degree: "Master's Degree in Computer Science (OMSCS)",
      logoUrl: "/gtech.png",
      start: "2026",
      end: "Expected 2028",
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
      title: "Wizz AI",
      href: "https://wizz.subhranshu.com",
      dates: "2026",
      active: true,
      description:
        "Your knowledge base. Production ready. Wizz AI manages the documents, URLs, and configuration behind your AI chatbot. Add sources, review logs, and tune responses, all from one dashboard.",
      technologies: ["Next.js", "FastAPI", "Redis", "Celery", "Crawl4AI", "HuggingFace"],
      links: [
        {
          type: "Website",
          href: "https://wizz.subhranshu.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/wizzai.png",
    },
    {
      title: "Smart Home MCP Server",
      href: "https://github.com/CantBeSubh/homelab/tree/main/homelab_mcp",
      dates: "2025",
      active: true,
      description:
        "An MCP server that connects Claude to my homelab, letting it control smart home devices through Home Assistant  built with FastMCP and deployed remotely behind an NGINX proxy.",
      technologies: ["FastMCP", "MCP", "Python", "GenAI", "NGINX"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/CantBeSubh/homelab/tree/main/homelab_mcp",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Demo",
          href: "https://youtu.be/q76U42HhziY?si=gfeHgNsyLeRah9jA",
          icon: <Icons.youtube className="size-3" />,
        },
      ],
      image: "/homelab_mcp.png",
    },
    {
      title: "Sentiment Analyzer",
      href: "https://sentiment.subhranshu.com/",
      dates: "2024",
      active: true,
      description:
        "A sentiment analysis and review management tool that uses Hugging Face's transformers library to analyze the sentiment of given movie reviews.",
      technologies: ["Next.js", "Shadcn UI", "TailwindCSS", "Hugging Face"],
      links: [
        {
          type: "Website",
          href: "https://sentiment.subhranshu.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/analyzer.png",
    },
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
      href: "https://youtu.be/6XJ6II8VIl8",
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
          href: "https://youtu.be/6XJ6II8VIl8",
          icon: <Icons.youtube className="size-3" />,
        },
      ],
      image: "/rudegpt.png",
    },

  ],
  hackathons: [] as any[],
} as const;
