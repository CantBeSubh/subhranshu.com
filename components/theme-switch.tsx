"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { BsMoon, BsSun } from "react-icons/bs"

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.button
      className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-white border-opacity-40 bg-white bg-opacity-80 shadow-2xl backdrop-blur-[0.5rem] transition-all hover:scale-[1.15] active:scale-105 dark:bg-gray-950"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 1.05 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
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
  )
}
