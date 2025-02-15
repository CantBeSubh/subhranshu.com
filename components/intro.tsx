"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { FaGithubSquare, FaTwitterSquare } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { SiLinktree } from "react-icons/si";

import { helloMessages } from "@/lib/data";

export default function Intro() {
    const { theme } = useTheme();
    const style = {
        background: theme === "light" ? "white" : "black",
        color: theme === "light" ? "black" : "white",
        border:
            theme === "light"
                ? "1px solid rgba(0, 0, 0, 0.05)"
                : "1px solid rgba(255, 255, 255,0.25)",
    };
    const { ref } = useSectionInView("Home", 0.5);
    const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

    return (
        <section
            ref={ref}
            id="home"
            className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
        >
            <div className="flex items-center justify-center flex-col">
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "tween",
                            duration: 0.2,
                        }}
                    >
                        <Image
                            src="/me.png"
                            alt="Subhranshu portrait"
                            width="250"
                            height="250"
                            quality="100"
                            className="size-24 rounded-lg object-cover border-[0.15rem] border-white shadow-2xl"
                            priority
                        />
                    </motion.div>

                    <motion.span
                        className="absolute bottom-0 right-0 text-4xl cursor-pointer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        whileHover={{ scale: 1.8 }}
                        whileTap={{ scale: 1.2 }}
                        transition={{
                            type: "spring",
                            stiffness: 125,
                            delay: 0.1,
                            duration: 0.7,
                        }}
                        onClick={() => {
                            const helloMessage =
                                helloMessages[
                                    Math.floor(
                                        Math.random() * helloMessages.length
                                    )
                                ];
                            toast(helloMessage.message, {
                                icon: helloMessage.flag,
                                style,
                            });
                        }}
                    >
                        👋
                    </motion.span>
                </div>
                <Sheet>
                    <SheetTrigger>click me leave a message!</SheetTrigger>
                    <SheetContent className="z-[99999]">
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <motion.h1
                className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="font-bold">Hello, I'm Subh.</span>
                <br /> I'm a{" "}
                <span className="font-bold">
                    Fullstack Developer with <br /> focus on Generative AI.
                </span>
                <br />I have{" "}
                <span className="font-extrabold italic">
                    {Number(
                        (new Date().getTime() -
                            new Date(2023, 4, 1).getTime()) /
                            (1000 * 60 * 60 * 24 * 365)
                    ).toFixed(1)}{" "}
                    years
                </span>{" "}
                of experience. <br />
                <br />
                <span className="text-lg uppercase">
                    I am currently building scalable, reliable and maintainable{" "}
                    AI solutions for Nuclear Compliance
                </span>
                .
            </motion.h1>

            <motion.div
                className="flex flex-col items-center justify-center gap-4 px-4 text-lg font-medium sm:flex-row"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                }}
            >
                <Link
                    href="#contact"
                    className="flex items-center gap-2 py-3 text-white transition bg-gray-900 rounded-full outline-none group px-7 focus:scale-110 hover:scale-110 dark:bg-black dark:border-white border hover:bg-gray-950 active:scale-105"
                    onClick={() => {
                        setActiveSection("Contact");
                        setTimeOfLastClick(Date.now());
                    }}
                >
                    Contact me here{" "}
                    <BsArrowRight className="transition opacity-70 group-hover:translate-x-1" />
                </Link>

                <a
                    className="flex items-center gap-2 py-3 transition bg-white rounded-full outline-none cursor-pointer group px-7 focus:scale-110 hover:scale-110 active:scale-105 borderBlack dark:bg-black dark:border-white"
                    href="https://dub.subhranshu.com/Resume"
                    download
                >
                    Download CV{" "}
                    <HiDownload className="transition opacity-60 group-hover:translate-y-1" />
                </a>

                <a
                    className="bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-black dark:border-white dark:text-white"
                    href="https://www.linkedin.com/in/subhranshu-pati/"
                    target="_blank"
                >
                    <BsLinkedin />
                </a>

                <a
                    className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-black dark:border-white dark:text-white"
                    href="https://github.com/CantBeSubh"
                    target="_blank"
                >
                    <FaGithubSquare />
                </a>
                <a
                    className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-black dark:border-white dark:text-white"
                    href="https://twitter.com/CantBeSubh"
                    target="_blank"
                >
                    <FaTwitterSquare />
                </a>
                <a
                    className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-black dark:border-white dark:text-white"
                    href="https://linktr.ee/cantbesubh"
                    target="_blank"
                >
                    <SiLinktree />
                </a>
            </motion.div>
        </section>
    );
}
