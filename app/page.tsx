"use server"

import { getLikeCount, getVisitCount } from "@/actions/count"
import About from "@/components/about"
import Contact from "@/components/contact"
import Experience from "@/components/experience"
import { GithubHeatMap } from "@/components/github-heatmap"
import Intro from "@/components/intro"
import Projects from "@/components/projects"
import SectionDivider from "@/components/section-divider"
import Skills from "@/components/skills"
import { TracingBeam } from "@/components/ui/tracing-beam"

export default async function Home() {
  const visitCount = await getVisitCount()
  const likeCount = await getLikeCount()

  return (
    <>
      <TracingBeam>
        <main className="flex flex-col items-center px-4">
          <Intro likeCount={likeCount} visitCount={visitCount} />
          <SectionDivider />
          <About />
          <GithubHeatMap />
          <Projects />
          <Skills />
          <Experience />
        </main>
      </TracingBeam>
      <div className="flex items-center justify-center w-full">
        <Contact />
      </div>
    </>
  )
}
