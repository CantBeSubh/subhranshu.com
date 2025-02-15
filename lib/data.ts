import EthicaLogo from "@/public/Logos/EthicaLogo.png";
import EverstarLogo from "@/public/Logos/Everstar.svg";
import analyzer from "@/public/analyzer.png";
import getgud from "@/public/getgud.png";
import heyEthica from "@/public/heyEthica.png";
import omnic from "@/public/omnicoutlet.png";
import ragOllama from "@/public/ragOllama.png";
import rudegpt from "@/public/rudegpt.png";
import React from "react";
import { BiLogoTailwindCss, BiLogoTypescript } from "react-icons/bi";
import { CgWorkAlt } from "react-icons/cg";
import {
    FaAws,
    FaDocker,
    FaJenkins,
    FaNodeJs,
    FaPython,
    FaReact,
} from "react-icons/fa";
import { FaFigma } from "react-icons/fa6";
import {
    IoLogoFirebase,
    IoLogoJavascript,
    IoLogoVercel,
} from "react-icons/io5";
import { LuGraduationCap } from "react-icons/lu";
import { RiNetflixFill, RiOpenaiFill, RiSupabaseFill } from "react-icons/ri";
import {
    SiExpress,
    SiFastapi,
    SiGrafana,
    SiKubernetes,
    SiMongodb,
    SiPostgresql,
    SiPrisma,
    SiPrometheus,
    SiRedux,
    SiTurborepo,
    SiZod,
} from "react-icons/si";
import { TbBrandFramerMotion, TbBrandThreejs } from "react-icons/tb";
import { VscGithubInverted } from "react-icons/vsc";

export const links = [
    {
        name: "Home",
        hash: "#home",
    },
    {
        name: "About",
        hash: "#about",
    },
    {
        name: "Projects",
        hash: "#projects",
    },
    {
        name: "Skills",
        hash: "#skills",
    },
    {
        name: "Experience",
        hash: "#experience",
    },
    {
        name: "Contact",
        hash: "#contact",
    },
] as const;

export const experiencesData = [
    {
        title: "Software Engineer",
        location: "New York, NY (Remote)",
        description:
            "I am currently working as a Software Engineer at Everstar, building AI products to supercharge nuclear compliance.",
        icon: EverstarLogo,
        date: "May, 2024 - Present",
    },
    {
        title: "Product Engineer",
        location: "Tustin, CA (Remote)",
        description:
            "I got promoted to Product Engineer after 4 months of internship. I futher worked on the same project.",
        icon: EthicaLogo,
        date: "Jan, 2024 - April,2024",
    },
    {
        title: "Product Engineer Intern",
        location: "Tustin, CA (Remote)",
        description:
            "I worked as a Product Engineer intern for 4 month. I worked on a startup project to improve the user experience of a mobile app.",
        icon: EthicaLogo,
        date: "Sept,2023-Jan,2024",
    },
    {
        title: "Front-End Developer Intern",
        location: "Chennai, IN",
        description:
            "I worked as a front-end developer intern for 3 months in. I also upskilled to the full stack.",
        icon: React.createElement(CgWorkAlt),
        date: "June,2023 - Aug,2023",
    },
    {
        title: "Freelancer",
        location: "Remote",
        description: "I worked as a fullstack freelancer for 2 months",
        icon: React.createElement(CgWorkAlt),
        date: "Aug,2023-Sep,2023",
    },
    {
        title: "Graduated Bachelor's degree",
        location: "Chennai, IN",
        description:
            "I did my Bachelor's degree in Computer Science from the VIT, Chennai. I was the first in my batch to get a full-time remote job.",
        icon: React.createElement(LuGraduationCap),
        date: "Aug, 2024",
    },
] as const;

export const projectsData = [
    {
        title: "RAG Ollama",
        description:
            "An Adaptive RAG app that uses Ollama & LangGraph to retrieve answer to user questions from provided documents or from the internet.",
        tags: [
            "Next.js",
            "Langchain",
            "LangSmith",
            "LangGraph",
            "ChromaDB",
            "FastAPI",
        ],
        imageUrl: ragOllama,
        status: false,
        link: "https://youtu.be/_lw3qa5kXpY",
    },
    {
        title: "HeyEthica",
        description:
            "I worked as a Product Engineer on this startup project for 1 year. Simplified the process of house buying and selling by using AI.",
        tags: ["Next.js", "Supabase", "Tailwind", "Prisma", "OpenAI"],
        imageUrl: heyEthica,
        status: true,
        link: "https://heyethica.com/",
    },
    {
        title: "RudeGPT",
        description:
            "An unconventional ChatGPT bootleg with an attitude, achived by using prompt engineering and a customized prompt engine.",
        tags: [
            "Next.js",
            "AWS Amplify",
            "AWS Cognito",
            "AWS Appsync",
            "OpenAI",
        ],
        imageUrl: rudegpt,
        status: false,
        link: "https://youtu.be/6XJ6II8VIl8?si=9pXdpFJqz-afEltb",
    },
    {
        title: "Sentiment Analyzer",
        description:
            "A sentiment analysis and review management tool that uses Hugging Face's transformers library to analyze the sentiment of given movie reviews.",
        imageUrl: analyzer,
        tags: ["Next.js", "Shadcn UI", "TailwindCSS", "Hugging Face"],
        status: true,
        link: "https://sentiment-analyzer.subhranshu.com/",
    },
    {
        title: "Omnic Outlet",
        description:
            "A modern e-commerce platform for online shopping, built around the theme of popular video game Overwatch.",
        tags: ["Next.js", "Supabase", "Tailwind", "Prisma", "OpenAI"],
        imageUrl: omnic,
        status: false,
        link: "https://omnic-outlet.subhranshu.com/",
    },
    {
        title: "GetGud",
        description:
            "A todos and habits tracker with sleek and elagant UI and UX, built with custom styling and animations.",
        tags: ["Next.js", "Garfbase", "SCSS"],
        imageUrl: getgud,
        status: false,
        link: "https://getgud.subhranshu.com/",
    },
] as const;

export const skillsData = [
    {
        name: "JavaScript",
        icon: React.createElement(IoLogoJavascript),
    },
    {
        name: "TypeScript",
        icon: React.createElement(BiLogoTypescript),
    },
    {
        name: "React",
        icon: React.createElement(FaReact),
    },
    {
        name: "Next.js",
        icon: React.createElement(RiNetflixFill),
    },
    {
        name: "Node.js",
        icon: React.createElement(FaNodeJs),
    },
    {
        name: "Git",
        icon: React.createElement(VscGithubInverted),
    },
    {
        name: "Turborepo",
        icon: React.createElement(SiTurborepo),
    },
    {
        name: "OpenAI",
        icon: React.createElement(RiOpenaiFill),
    },
    {
        name: "Tailwind",
        icon: React.createElement(BiLogoTailwindCss),
    },
    {
        name: "Three.js",
        icon: React.createElement(TbBrandThreejs),
    },
    {
        name: "React Three Fiber",
        icon: React.createElement(CgWorkAlt),
    },
    {
        name: "Prisma",
        icon: React.createElement(SiPrisma),
    },
    {
        name: "MongoDB",
        icon: React.createElement(SiMongodb),
    },
    {
        name: "Firebase",
        icon: React.createElement(IoLogoFirebase),
    },
    {
        name: "Redux",
        icon: React.createElement(SiRedux),
    },
    {
        name: "Zustand",
        icon: React.createElement(CgWorkAlt),
    },
    {
        name: "Jotai",
        icon: React.createElement(CgWorkAlt),
    },
    {
        name: "Zod",
        icon: React.createElement(SiZod),
    },
    {
        name: "Supabase",
        icon: React.createElement(RiSupabaseFill),
    },
    {
        name: "Vercel",
        icon: React.createElement(IoLogoVercel),
    },
    {
        name: "AWS",
        icon: React.createElement(FaAws),
    },
    {
        name: "Express",
        icon: React.createElement(SiExpress),
    },
    {
        name: "PostgreSQL",
        icon: React.createElement(SiPostgresql),
    },
    {
        name: "Docker",
        icon: React.createElement(FaDocker),
    },
    {
        name: "Grafana",
        icon: React.createElement(SiGrafana),
    },
    {
        name: "Kubernetes",
        icon: React.createElement(SiKubernetes),
    },
    {
        name: "Prometheus",
        icon: React.createElement(SiPrometheus),
    },
    {
        name: "Jenkins",
        icon: React.createElement(FaJenkins),
    },
    {
        name: "Python",
        icon: React.createElement(FaPython),
    },
    {
        name: "FastAPI",
        icon: React.createElement(SiFastapi),
    },
    {
        name: "Framer Motion",
        icon: React.createElement(TbBrandFramerMotion),
    },
    {
        name: "GSAP",
        icon: React.createElement(CgWorkAlt),
    },
    {
        name: "Figma",
        icon: React.createElement(FaFigma),
    },
] as const;
