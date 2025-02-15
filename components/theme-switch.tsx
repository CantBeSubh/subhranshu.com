"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();

    return (
        <motion.button
            className="fixed bottom-5 right-5 bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 1.05 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
            }}
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === "light" ? 0 : 360 }}
                transition={{ duration: 0.3 }}
            >
                {theme === "light" ? <BsSun /> : <BsMoon />}
            </motion.div>
        </motion.button>
    );
}
