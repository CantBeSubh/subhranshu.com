"use client";

import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";

const fadeInAnimationVariants = {
    initial: {
        opacity: 0,
        y: 100,
    },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.05 * index,
        },
    }),
};

export default function Skills() {
    const { ref } = useSectionInView("Skills");

    return (
        <section
            id="skills"
            ref={ref}
            className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
        >
            <SectionHeading>My skills</SectionHeading>
            <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
                {skillsData.map((skill, index) => {
                    const { name, icon } = skill;
                    return (
                        <motion.li
                            className="bg-white borderBlack rounded-xl px-5 py-3 dark:bg-black dark:border-white/10 dark:border dark:text-white/80 flex items-center justify-center gap-2"
                            key={index}
                            variants={fadeInAnimationVariants}
                            initial="initial"
                            whileInView="animate"
                            viewport={{
                                once: true,
                            }}
                            custom={index}
                        >
                            {icon}
                            {name}
                        </motion.li>
                    );
                })}
            </ul>
        </section>
    );
}
