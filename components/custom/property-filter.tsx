"use client"

import { useState } from "react"
import { IconChevronDown, IconFilter, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { PortfolioItem } from "./portfolio-table"

export type FilterableProperty =
  | "uopId"
  | "name"
  | "businessUnit"
  | "function"
  | "stage"
  | "vendor"
  | "recommendation"

export type ActiveFilters = Partial<Record<FilterableProperty, string[]>>

const DIMENSIONS: { property: FilterableProperty; label: string }[] = [
  { property: "uopId",          label: "ID" },
  { property: "name",           label: "Deployment" },
  { property: "businessUnit",   label: "Business Unit" },
  { property: "function",       label: "Function" },
  { property: "stage",          label: "Stage" },
  { property: "vendor",         label: "Vendor" },
  { property: "recommendation", label: "Suggested Executive Action" },
]

function getUniqueValues(data: PortfolioItem[], property: FilterableProperty): string[] {
  if (property === "recommendation") return ["Scale", "Hold", "Cut"]
  return Array.from(new Set(data.map((item) => String(item[property as keyof PortfolioItem])))).sort()
}

interface DimensionFilterProps {
  label: string
  property: FilterableProperty
  allValues: string[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

function DimensionFilter({
  label,
  allValues,
  selected,
  onToggle,
  onClear,
}: DimensionFilterProps) {
  const [open, setOpen] = useState(false)
  const isActive = selected.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          className={cn("gap-1.5", isActive && "pr-1.5")}
        >
          <span>{label}</span>
          {isActive ? (
            <>
              <span className="rounded bg-primary-foreground/20 px-1 text-xs tabular-nums">
                {selected.length}
              </span>
              <span
                role="button"
                aria-label={`Clear ${label} filter`}
                className="ml-0.5 rounded p-0.5 hover:bg-primary-foreground/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
              >
                <IconX className="size-3" />
              </span>
            </>
          ) : (
            <IconChevronDown className="size-3.5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-52 p-2">
        <div className="mb-1 flex items-center justify-between px-1">
          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          {isActive && (
            <button
              onClick={onClear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <Separator className="mb-2" />
        <div className="flex flex-col gap-0.5">
          {allValues.map((v) => (
            <label
              key={v}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 hover:bg-accent"
            >
              <Checkbox
                checked={selected.includes(v)}
                onCheckedChange={() => onToggle(v)}
              />
              <span className="text-sm">{v}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface PropertyFilterProps {
  data: PortfolioItem[]
  filters: ActiveFilters
  onChange: (filters: ActiveFilters) => void
}

export function PropertyFilter({ data, filters, onChange }: PropertyFilterProps) {
  const hasAnyFilter = DIMENSIONS.some((d) => (filters[d.property]?.length ?? 0) > 0)

  function toggle(property: FilterableProperty, value: string) {
    const current = filters[property] ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [property]: next.length > 0 ? next : undefined })
  }

  function clear(property: FilterableProperty) {
    const next = { ...filters }
    delete next[property]
    onChange(next)
  }

  function clearAll() {
    onChange({})
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <IconFilter className="size-4" />
        Filter by:
      </span>
      {DIMENSIONS.map(({ property, label }) => (
        <DimensionFilter
          key={property}
          label={label}
          property={property}
          allValues={getUniqueValues(data, property)}
          selected={filters[property] ?? []}
          onToggle={(v) => toggle(property, v)}
          onClear={() => clear(property)}
        />
      ))}

      {hasAnyFilter && (
        <>
          <Separator orientation="vertical" className="h-full" />
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        </>
      )}
    </div>
  )
}
