"use client"

import { useState } from "react"

import { PropertyFilter, type ActiveFilters } from "./property-filter"
import { type PortfolioItem } from "./portfolio-table"
import { PortfolioList } from "./portfolio-list"
import { PortfolioSummary } from "./portfolio-summary"
import {
  TimeRangeFilter,
  DEFAULT_TIME_RANGE,
  applyTimeRange,
  type TimeRangeValue,
} from "./time-range-filter"

interface PortfolioViewProps {
  data: PortfolioItem[]
}

function getRecommendation(score: number): string {
  if (score > 75) return "Scale"
  if (score >= 50) return "Hold"
  return "Cut"
}

function applyDimensionFilters(data: PortfolioItem[], filters: ActiveFilters): PortfolioItem[] {
  const active = Object.entries(filters).filter(([, values]) => values && values.length > 0)
  if (active.length === 0) return data
  return data.filter((row) =>
    active.every(([property, values]) => {
      if (property === "recommendation") return values!.includes(getRecommendation(row.uopScore))
      return values!.includes(String((row as unknown as Record<string, unknown>)[property]))
    })
  )
}

export function PortfolioView({ data }: PortfolioViewProps) {
  const [filters, setFilters] = useState<ActiveFilters>({})
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(DEFAULT_TIME_RANGE)

  const filtered = applyDimensionFilters(applyTimeRange(data, timeRange), filters)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PropertyFilter data={data} filters={filters} onChange={setFilters} />
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      </div>
      <PortfolioSummary data={filtered} />
      <PortfolioList data={filtered} />
    </div>
  )
}
