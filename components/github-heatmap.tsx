"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import SectionHeading from "./section-heading"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

interface ApiContribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: {
    [year: string]: number
  }
  contributions: ApiContribution[]
}

interface Contribution {
  colorCode: string
  contributions: number
  date: string
}

interface Statistics {
  active_days: number
  average_daily_contributions: number
  inactive_days: number
  max_contributions_day: Contribution
  median_daily_contributions: number
  streak: {
    end_date: string
    length: number
  }
  total_contributions: number
}

interface TransformedData {
  contributions: Contribution[]
  statistics: Statistics
}

const levelToColor = (level: 0 | 1 | 2 | 3 | 4): string => {
  const colorMap = {
    0: "#ebedf0",
    1: "#9be9a8",
    2: "#40c463",
    3: "#30a14e",
    4: "#216e39"
  }
  return colorMap[level]
}

const calculateStatistics = (
  contributions: ApiContribution[]
): Statistics => {
  const activeDays = contributions.filter(c => c.count > 0).length
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0)
  const inactiveDays = contributions.length - activeDays

  const maxDay = contributions.reduce((max, c) =>
    c.count > max.count ? c : max
  )

  const average =
    activeDays > 0 ? Math.round(totalContributions / activeDays) : 0

  const sortedCounts = contributions
    .map(c => c.count)
    .filter(c => c > 0)
    .sort((a, b) => a - b)
  const median =
    sortedCounts.length > 0
      ? sortedCounts[Math.floor(sortedCounts.length / 2)]
      : 0

  let currentStreak = 0
  let maxStreak = 0
  let streakEnd = ""

  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      currentStreak++
      if (i === contributions.length - 1) {
        streakEnd = contributions[i].date
      }
    } else if (currentStreak > 0) {
      break
    }
  }
  maxStreak = currentStreak

  return {
    active_days: activeDays,
    average_daily_contributions: average,
    inactive_days: inactiveDays,
    max_contributions_day: {
      colorCode: levelToColor(maxDay.level),
      contributions: maxDay.count,
      date: maxDay.date
    },
    median_daily_contributions: median,
    streak: {
      end_date: streakEnd,
      length: maxStreak
    },
    total_contributions: totalContributions
  }
}

const transformApiResponse = (apiData: ApiResponse): TransformedData => {
  const contributions = apiData.contributions.map(c => ({
    colorCode: levelToColor(c.level),
    contributions: c.count,
    date: c.date
  }))

  const statistics = calculateStatistics(apiData.contributions)

  return {
    contributions,
    statistics
  }
}

export const GithubHeatMap = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [data, setData] = useState<TransformedData | null>(null)
  const username = "CantBeSubh"

  const availableYears = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => (currentYear - i).toString()
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://github-contributions-api-one.vercel.app/v4/${username}?y=${selectedYear}`
        )
        if (!response.ok) throw new Error("Failed to fetch data")
        const result: ApiResponse = await response.json()
        const transformedData = transformApiResponse(result)
        setData(transformedData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [selectedYear, username])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
    >
      <div className="rounded-lg p-4">
        <SectionHeading>GitHub Contributions</SectionHeading>
        <div className="flex flex-col md:flex-row items-center justify-center w-full mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">
              {data?.statistics.total_contributions || 0} contributions in{" "}
              {selectedYear}
            </span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 max-w-[45rem] mx-auto">
          <div className="space-y-1 text-center">
            <div className="text-muted-foreground">Active Days</div>
            <div className="text-4xl font-bold">
              {data?.statistics.active_days}
            </div>
          </div>
          <div className="space-y-1 text-center">
            <div className="text-muted-foreground">Current Streak</div>
            <div className="text-4xl font-bold">
              {data?.statistics.streak.length}
            </div>
          </div>
          <div className="space-y-1 text-center">
            <div className="text-muted-foreground">Average Daily</div>
            <div className="text-4xl font-bold">
              {data?.statistics.average_daily_contributions}
            </div>
          </div>
          <div className="space-y-1 text-center">
            <div className="text-muted-foreground">Best Day</div>
            <div className="text-4xl font-bold">
              {data?.statistics.max_contributions_day.contributions}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-full md:max-w-4xl rounded-lg bg-secondary/5 p-4">
            <div className="flex gap-1 items-center justify-center">
              <TooltipProvider>
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                  <div
                    key={crypto.randomUUID()}
                    className="grid grid-rows-7 gap-1"
                  >
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const contributionIndex = weekIndex * 7 + dayIndex
                      const contribution =
                        data?.contributions[contributionIndex]

                      return contribution ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <motion.div
                              key={contribution.date}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: contributionIndex * 0.001 }}
                              className="w-[11px] aspect-square rounded-sm cursor-pointer transition-all duration-200 hover:scale-125"
                              style={{
                                backgroundColor: contribution.colorCode
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {`${contribution.contributions} contribution${contribution.contributions !== 1 ? "s" : ""} on ${new Date(contribution.date).toLocaleDateString()}`}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div
                          key={`empty-${weekIndex}-${dayIndex}`}
                          className="w-[11px] aspect-square rounded-sm bg-[#ebedf0]"
                        />
                      )
                    })}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              {Object.values({
                0: "#ebedf0",
                1: "#9be9a8",
                2: "#40c463",
                3: "#30a14e",
                4: "#216e39"
              }).map(color => (
                <motion.div
                  key={color}
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
