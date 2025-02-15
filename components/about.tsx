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
                Hi, I'm Subh, a{" "}
                <span className="font-medium">
                    Software Engineer at Everstar
                </span>
                . I studied{" "}
                <span className="font-medium">
                    Computer Science with AI and Robotics
                </span>
                . I've been tinkering with{" "}
                <span className="font-extrabold text-lg text-teal-500">
                    Generative AI
                </span>{" "}
                since my sophomore year and I am excited to lead the frontier
                for{" "}
                <span className="font-medium">
                    AI-enabled Nuclear Compliance
                </span>
                . At Everstar, we are crafting{" "}
                <span className="font-medium text-lg text-violet-500">
                    intelligent systems designed to supercharge the end-to-end
                    workflows for nuclear innovators
                </span>
                , accelerating the deployment of nuclear energy.
            </p>

            <p>
                <span className="italic">When I'm not coding</span>, I enjoy
                playing video games, watching movies, and spend time with my
                family. I also enjoy{" "}
                <span className="font-medium">learning new things</span>. I am
                currently learning about{" "}
                <span className="font-medium">home automation</span>.
            </p>
        </motion.section>
    );
}
