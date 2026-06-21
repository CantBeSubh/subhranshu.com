"use client"

import { incrementLikeCount, incrementVisitCount } from "@/actions/count"
import { useActiveSectionContext } from "@/context/active-section-context"
import { likeMessages } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useOptimistic, useTransition } from "react"
import toast from "react-hot-toast"
import { BsArrowRight, BsLinkedin } from "react-icons/bs"
import { FaGithubSquare, FaTwitterSquare } from "react-icons/fa"
import { HiDownload } from "react-icons/hi"
import { SiLinktree } from "react-icons/si"
import Counter from "./counter"
import { SparklesCore } from "./ui/sparkles"

export default function Intro({
  likeCount,
  visitCount
}: {
  likeCount: number
  visitCount: number
}) {
  useEffect(() => {
    incrementVisitCount()
  }, [])
  const [isIncrementing, startIncrementing] = useTransition()

  const [optimisticLikeCount, incrementOptimisticLikeCount] = useOptimistic(
    likeCount,
    (currentState, optimisticValue: number) => optimisticValue
  )

  const memoSparkles = useMemo(
    () => (
      <SparklesCore
        background="transparent"
        particleDensity={10}
        className="absolute -left-[50%] top-0 z-[-1] h-full w-screen"
      />
    ),
    []
  )

  const { theme } = useTheme()
  const style = {
    background: theme === "light" ? "white" : "black",
    color: theme === "light" ? "black" : "white",
    border:
      theme === "light"
        ? "1px solid rgba(0, 0, 0, 0.05)"
        : "1px solid rgba(255, 255, 255,0.25)"
  }
  const { ref } = useSectionInView("Home", 0.5)
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext()

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] scroll-mt-[100rem] text-center sm:mb-0"
    >
      {memoSparkles}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="relative select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2
            }}
          >
            <Image
              src="/me_clean.png"
              alt="Subhranshu portrait"
              width="400"
              height="400"
              quality="100"
              className="size-40 rounded-lg border-[0.15rem] border-black object-cover shadow-2xl"
              priority
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-0 cursor-pointer text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.5 }}
            whileHover={{ scale: 1.8 }}
            whileTap={{ scale: 1.2 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7
            }}
            onClick={async () => {
              try {
                const likeMsg =
                  likeMessages[Math.floor(Math.random() * likeMessages.length)]

                startIncrementing(async () => {
                  try {
                    incrementOptimisticLikeCount(optimisticLikeCount + 1)
                    toast.promise(
                      incrementLikeCount(),
                      {
                        loading: "Incrementing...",
                        success: () => `${likeMsg.message}!`,
                        error: () => "Rate limit exceeded. Retry again soon."
                      },
                      {
                        style,
                        success: {
                          icon: likeMsg.flag,
                          style
                        }
                      }
                    )
                  } catch (error) {
                    console.error("Error incrementing count:", error)
                  }
                })
              } catch (error) {
                console.error("Error in click handler:", error)
                toast.error("Something went wrong")
              }
            }}
          >
            {isIncrementing ? "🙌" : "👋"}
          </motion.span>
        </div>
        <motion.div
          className="font-extralight"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "tween",
            duration: 1,
            ease: "easeInOut",
            delay: 0.25
          }}
        >
          <Counter likeCount={optimisticLikeCount} visitCount={visitCount} />
        </motion.div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-normal sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="bg-gradient-to-r from-emerald-500 to-indigo-500 bg-clip-text font-bold text-transparent">
          Hello, I'm Subh.
        </span>
        <br /> I'm a{" "}
        <span className="font-bold">
          Fullstack Developer with <br /> focus on Generative AI.
        </span>
        <br />I have{" "}
        <span className="bg-yellow-200 font-extrabold italic dark:bg-yellow-600/50">
          {Number(
            (new Date().getTime() - new Date(2024, 4, 1).getTime()) /
              (1000 * 60 * 60 * 24 * 365)
          ).toFixed(1)}{" "}
          years
        </span>{" "}
        of experience. <br />
        <br />
        <span className="text-lg uppercase">
          I am currently building scalable, reliable and maintainable <br />
          AI solutions for Nuclear Compliance
        </span>
        .
      </motion.h1>

      <motion.div
        className="flex flex-col items-center justify-center gap-4 px-4 text-lg font-medium sm:flex-row"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1
        }}
      >
        <Link
          href="#contact"
          className="group flex items-center gap-2 rounded-full border bg-gray-900 px-7 py-3 text-white outline-none transition hover:scale-110 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:border-white dark:bg-black"
          onClick={() => {
            setActiveSection("Contact")
            setTimeOfLastClick(Date.now())
          }}
        >
          Contact me here{" "}
          <BsArrowRight className="opacity-70 transition group-hover:translate-x-1" />
        </Link>

        <a
          target="_blank"
          className="borderBlack group flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3 outline-none transition hover:scale-110 focus:scale-110 active:scale-105 dark:border-white dark:bg-black"
          href="https://dub.subhranshu.com/Resume"
          download
        >
          Download CV{" "}
          <HiDownload className="opacity-60 transition group-hover:translate-y-1" />
        </a>

        <a
          className="borderBlack flex cursor-pointer items-center gap-2 rounded-full bg-white p-4 text-gray-700 transition hover:scale-[1.15] hover:text-gray-950 focus:scale-[1.15] active:scale-105 dark:border-white dark:bg-black dark:text-white"
          href="https://www.linkedin.com/in/subhranshu-pati/"
          target="_blank"
        >
          <BsLinkedin />
        </a>

        <a
          className="borderBlack flex cursor-pointer items-center gap-2 rounded-full bg-white p-4 text-[1.35rem] text-gray-700 transition hover:scale-[1.15] hover:text-gray-950 focus:scale-[1.15] active:scale-105 dark:border-white dark:bg-black dark:text-white"
          href="https://github.com/CantBeSubh"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
        <a
          className="borderBlack flex cursor-pointer items-center gap-2 rounded-full bg-white p-4 text-[1.35rem] text-gray-700 transition hover:scale-[1.15] hover:text-gray-950 focus:scale-[1.15] active:scale-105 dark:border-white dark:bg-black dark:text-white"
          href="https://twitter.com/CantBeSubh"
          target="_blank"
        >
          <FaTwitterSquare />
        </a>
        <a
          className="borderBlack flex cursor-pointer items-center gap-2 rounded-full bg-white p-4 text-[1.35rem] text-gray-700 transition hover:scale-[1.15] hover:text-gray-950 focus:scale-[1.15] active:scale-105 dark:border-white dark:bg-black dark:text-white"
          href="https://linktr.ee/cantbesubh"
          target="_blank"
        >
          <SiLinktree />
        </a>
      </motion.div>
    </section>
  )
}
