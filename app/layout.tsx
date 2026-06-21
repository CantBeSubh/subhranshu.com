import Metrics from "@/app/metrics"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ThemeSwitch from "@/components/theme-switch"
import ActiveSectionContextProvider from "@/context/active-section-context"
import { ThemeProvider } from "@/context/theme-context"
import { Montserrat } from "next/font/google"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const inter = Montserrat({ subsets: ["latin"] })

export const metadata = {
  title: "Subh",
  description: "Subhranshu hates CSS"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head> */}
      <body
        className={`${inter.className} relative bg-gray-50 pt-28 text-gray-950 dark:bg-black dark:text-gray-50 dark:text-opacity-90 sm:pt-36`}
      >
        <Metrics />
        <div className="absolute -top-24 right-44 -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-[#fbe2e3] blur-[10rem] dark:bg-[#946263] sm:w-[68.75rem]"></div>
        <div className="absolute -top-4 left-[-35rem] -z-10 h-[31.25rem] w-[50rem] rounded-full bg-[#dbd7fb] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:-left-60 2xl:-left-20"></div>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ActiveSectionContextProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-right" />
            <ThemeSwitch />
          </ActiveSectionContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
