"use client";

import { projectsData } from "@/lib/data";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type ProjectProps = (typeof projectsData)[number];



const StatusDot = ({ status }: { status?: boolean }) => {
  if (status) return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger>
          <span
            // className="animate-pulse"
            data-tooltip-target="tooltip-default"
            style={{
              background: `rgba(255,255,255,1)`,
              boxShadow: `inset 0px 0px 10px 2px rgba(0,255,182,0.5),
                            0px 0px 10px 2px rgba(0,255,135,1)`,
              borderRadius: "50%",
              width: "0.5rem",
              height: "0.5rem",
              display: "inline-block",
              marginLeft: "0.4rem",
              marginBottom: "0.25rem",
            }}
          />
        </TooltipTrigger>
        <TooltipContent className="font-mono text-xs text-black uppercase bg-white border-none dark:bg-black dark:text-white">
          Project is up and running
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger>
          <span
            // className="animate-pulse"
            data-tooltip-target="tooltip-default"
            style={{
              background: `rgba(255,255,255,1)`,
              boxShadow: `inset 0px 0px 10px 2px rgba(255,0,122,0.5),
                            0px 0px 10px 2px rgba(255,0,95,1)`,
              borderRadius: "50%",
              width: "0.5rem",
              height: "0.5rem",
              display: "inline-block",
              marginLeft: "0.4rem",
              marginBottom: "0.25rem",
            }}
          />
        </TooltipTrigger>
        <TooltipContent className="font-mono text-xs text-black uppercase bg-white border-none dark:bg-black dark:text-white">
          Project is down
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  status
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      className="mb-3 group sm:mb-8 last:mb-0"
    >
      <section className="bg-gray-100 max-w-[42rem] border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative sm:h-[20rem] hover:bg-gray-200 transition  dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full ">
          <h3 className="text-2xl font-semibold"> {title} <StatusDot status={status} /> </h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          <ul className="flex flex-wrap gap-2 mt-4 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <Image
          src={imageUrl}
          alt="Project I worked on"
          quality={95}
          className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl 
          h-full object-cover object-left
          transition 
          group-hover:scale-[1.04]
          group-hover:-translate-x-3
          group-hover:translate-y-3
          group-hover:-rotate-2
        "
        />
      </section>
    </motion.div>
  );
}
