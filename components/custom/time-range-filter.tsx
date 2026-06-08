"use client"

import { useState } from "react"
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns"
import { IconChevronDown } from "@tabler/icons-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export type TimeRangeOption = "24h" | "7d" | "1m" | "3m" | "custom"

export interface TimeRangeValue {
  option: TimeRangeOption
  customStart: Date
  customEnd: Date
}

const DATA_START = new Date("2026-05-26")
const DATA_END = new Date("2026-06-05")

export const DEFAULT_TIME_RANGE: TimeRangeValue = {
  option: "3m",
  customStart: DATA_START,
  customEnd: DATA_END,
}

export function applyTimeRange<T extends { date: string }>(
  data: T[],
  timeRange: TimeRangeValue
): T[] {
  const now = new Date()
  let start: Date
  let end: Date

  switch (timeRange.option) {
    case "24h":
      start = startOfDay(subDays(now, 1))
      end = endOfDay(now)
      break
    case "7d":
      start = startOfDay(subDays(now, 7))
      end = endOfDay(now)
      break
    case "1m":
      start = startOfDay(subMonths(now, 1))
      end = endOfDay(now)
      break
    case "3m":
      start = startOfDay(subMonths(now, 3))
      end = endOfDay(now)
      break
    case "custom":
      start = startOfDay(timeRange.customStart)
      end = endOfDay(timeRange.customEnd)
      break
  }

  return data.filter((row) => {
    const d = new Date(row.date)
    return d >= start && d <= end
  })
}

const PRESET_LABELS: Record<Exclude<TimeRangeOption, "custom">, string> = {
  "24h": "Last 24 Hours",
  "7d": "Last 7 Days",
  "1m": "Last Month",
  "3m": "Last 3 Months",
}

function getTriggerLabel(value: TimeRangeValue): string {
  if (value.option === "custom") {
    return `${format(value.customStart, "MMM d")} – ${format(value.customEnd, "MMM d")}`
  }
  return PRESET_LABELS[value.option]
}

interface TimeRangeFilterProps {
  value: TimeRangeValue
  onChange: (value: TimeRangeValue) => void
}

export function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<DateRange>({
    from: value.customStart,
    to: value.customEnd,
  })

  function selectPreset(option: Exclude<TimeRangeOption, "custom">) {
    onChange({ ...value, option })
    setOpen(false)
  }

  function applyCustom() {
    if (!pending.from || !pending.to) return
    onChange({ option: "custom", customStart: pending.from, customEnd: pending.to })
    setOpen(false)
  }

  function handleOpenChange(next: boolean) {
    if (next) setPending({ from: value.customStart, to: value.customEnd })
    setOpen(next)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Date Range:</span>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            {getTriggerLabel(value)}
            <IconChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-3">
          <ButtonGroup className="w-full">
            {(["24h", "7d", "1m", "3m"] as const).map((option) => (
              <Button
                key={option}
                variant={value.option === option ? "default" : "outline"}
                size="sm"
                onClick={() => selectPreset(option)}
              >
                {PRESET_LABELS[option]}
              </Button>
            ))}
          </ButtonGroup>
          <Separator className="my-3" />
          <Calendar
            mode="range"
            selected={pending}
            onSelect={(range) => setPending(range ?? { from: undefined, to: undefined })}
            numberOfMonths={2}
            defaultMonth={DATA_START}
          />
          <Separator className="my-2" />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!pending.from || !pending.to}
              onClick={applyCustom}
            >
              Apply custom range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
