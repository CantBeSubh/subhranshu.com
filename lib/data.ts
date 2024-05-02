import getgud from "@/public/getgud.png";
import heyEthica from "@/public/heyEthica.png";
import rudegpt from "@/public/rudegpt.png";
import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

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
    title: "Product Engineer",
    location: "Tustin, CA (Remote)",
    description:
      "I got promoted to Product Engineer after 4 months of internship. I futher worked on the same project",
    icon: React.createElement(FaReact),
    date: "Jan, 2024 - April,2024",
  },
  {
    title: "Product Engineer Intern",
    location: "Tustin, CA (Remote)",
    description:
      "I worked as a Product Engineer intern for 4 month. I worked on a startup project to improve the user experience of a mobile app.",
    icon: React.createElement(FaReact),
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
    description:
      "I worked as a fullstack freelancer for 2 months",
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
  }
] as const;

export const projectsData = [
  {
    title: "HeyEthica",
    description:
      "I worked as a Product Engineer on this startup project for 1 year. Simplified the process of house buying and selling by using AI.",
    tags: ["Next.js", "Supabase", "Tailwind", "Prisma", "OpenAI"],
    imageUrl: heyEthica,
    status: true,
  },
  {
    title: "RudeGPT",
    description:
      "An unconventional ChatGPT bootleg with an attitude, achived by using prompt engineering and a customized prompt engine.",
    tags: ["Next.js", "AWS Amplify", "AWS Cognito", "AWS Appsync", "OpenAI"],
    imageUrl: rudegpt,
    status: false,
  },
  {
    title: "GetGud",
    description:
      "A todos and habits tracker with sleek and elagant UI and UX, built with custom styling and animations.",
    tags: ["Next.js", "Garfbase", "SCSS"],
    imageUrl: getgud,
    status: false
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Nuxt.js",
  "Node.js",
  "Git",
  "Turborepo",
  "OpenAI",
  "Peplexity",
  "Anthropic",
  "TogetherAI",
  "Replicate",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "Redux",
  "Zustand",
  "Jotai",
  "Zod",
  "tRPC",
  "NextAuth",
  "Supabase",
  "Vercel",
  "AWS",
  "GraphQL",
  "Apollo",
  "Express",
  "PostgreSQL",
  "Docker",
  "Python",
  "Django",
  "Framer Motion",
  "GSAP",
  "Figma",
] as const;
