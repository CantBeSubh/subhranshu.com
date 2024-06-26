"use client";

import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        While studying for my degree in{" "}
        <span className="font-medium">Computer Science</span>, I decided to pursue my
        passion for web development. I started freelancing and made {" "}
        <span className="font-medium">full-stack web development projects</span>.{" "}
        I am currently learning<span className="font-extrabold text-lg text-red-500"> Generative AI Technologies</span>{" "}
        to solve modern problems with modern solutions. I <span className="underline">love</span> the
        feeling of finally figuring out a solution to a problem. My core stack
        is {" "}
        <span className="font-medium text-lg text-green-500">
          Next.js, Supabase, Vercel, Langchain, FastAPI, OpenAI/Ollama, AWS, Docker
        </span>
        . I am also familiar with TypeScript and Prisma. I am always looking to
        learn new technologies. I am currently looking for a{" "}
        <span className="font-medium underline">full-time position</span> as a software
        developer.
      </p>

      <p>
        <span className="italic">When I'm not coding</span>, I enjoy playing
        video games, watching movies, and spend time with my family. I also enjoy{" "}
        <span className="font-medium">learning new things</span>. I am currently
        learning about{" "}
        <span className="font-medium">psycology</span>. I'm also
        learning how to play the guitar.
      </p>
    </motion.section>
  );
}
