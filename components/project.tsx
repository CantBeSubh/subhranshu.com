"use client"

import { projectsData } from "@/lib/data"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

type ProjectProps = (typeof projectsData)[number]

const StatusDot = ({ status }: { status?: boolean }) => {
  const dotStyles = {
    background: "rgba(255,255,255,1)",
    boxShadow: status
      ? "inset 0px 0px 10px 2px rgba(0,255,182,0.5), 0px 0px 10px 2px rgba(0,255,135,1)"
      : "inset 0px 0px 10px 2px rgba(255,0,122,0.5), 0px 0px 10px 2px rgba(255,0,95,1)",
    borderRadius: "50%",
    width: "0.5rem",
    height: "0.5rem",
    display: "inline-block",
    marginLeft: "0.4rem",
    marginBottom: "0.25rem"
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger>
          <span className="animate-pulse" style={dotStyles} />
        </TooltipTrigger>
        <TooltipContent className="border-none bg-white font-mono text-xs uppercase text-black dark:bg-black dark:text-white">
          {status ? "Project is up and running" : "Project is not deployed"}
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
  status,
  link
}: ProjectProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"]
  })
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1])

  return (
    <motion.a
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess
      }}
      className="group mb-3 block last:mb-0 sm:mb-8"
      href={link}
    >
      <section
        className="relative max-w-2xl overflow-hidden rounded-lg border border-black/5 bg-gray-100 transition-all duration-200 hover:bg-gray-200 dark:border-white/20  dark:bg-black dark:text-white dark:hover:bg-gray-900 sm:h-80 sm:pr-8"
        // href={link}
      >
        <div className="flex h-full flex-col px-5 pb-7 pt-4 sm:max-w-[50%] sm:pl-10 sm:pr-2 sm:pt-10 ">
          <h3 className="text-2xl font-semibold">
            {" "}
            {title} <StatusDot status={status} />{" "}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="rounded-full border bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white dark:border-white/50 dark:text-white/70"
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
          className="absolute -right-40 top-8 hidden h-full w-[28.25rem] rounded-t-lg object-cover 
          object-left shadow-2xl transition
          group-hover:-translate-x-3 
          group-hover:translate-y-3
          group-hover:-rotate-2
          group-hover:scale-[1.04]
          sm:block
        "
        />
      </section>
    </motion.a>
  )
}
