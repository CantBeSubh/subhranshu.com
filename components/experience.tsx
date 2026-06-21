"use client"

import { experiencesData } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { useTheme } from "next-themes"
import Image, { StaticImageData } from "next/image"
import React from "react"
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import SectionHeading from "./section-heading"

const generateIcon = (
  icon: StaticImageData & React.ReactNode
): React.ReactNode => {
  if (icon?.src) {
    return (
      <Image
        src={icon}
        alt="icon"
        className="p-2 dark:invert min-[1170px]:p-4"
      />
    )
  }
  return icon
}

export default function Experience() {
  const { ref } = useSectionInView("Experience", 0.5)
  const { theme } = useTheme()

  return (
    <section id="experience" ref={ref} className="mb-28 scroll-mt-28 sm:mb-40">
      <SectionHeading>My experience</SectionHeading>
      <VerticalTimeline lineColor="">
        {experiencesData.map((item, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              contentStyle={{
                background: theme === "light" ? "#f3f4f6" : "rgba(0,0,0)",
                boxShadow: "none",
                border:
                  theme === "light"
                    ? "1px solid rgba(0, 0, 0, 0.05)"
                    : "1px solid rgba(255, 255, 255,0.25)",
                textAlign: "left",
                padding: "1.3rem 2rem"
              }}
              contentArrowStyle={{
                borderRight:
                  theme === "light"
                    ? "0.4rem solid #9ca3af"
                    : "0.4rem solid rgba(255, 255, 255,0.5)"
              }}
              date={item.date}
              icon={generateIcon(item.icon)}
              iconStyle={{
                background: theme === "light" ? "white" : "rgba(0, 0, 0, 1)",
                fontSize: "1.5rem"
              }}
              dateClassName="min-[1170px]:mx-4"
            >
              <h3 className="font-semibold capitalize">{item.title}</h3>
              <p className="!mt-0 font-normal">{item.location}</p>
              <p className="!mt-1 !font-normal text-gray-700 dark:text-white/75">
                {item.description}
              </p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  )
}
