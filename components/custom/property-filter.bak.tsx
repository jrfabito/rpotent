"use client"

import { useState } from "react"
import { IconPlus, IconX, IconChevronLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type { PortfolioItem } from "./portfolio-table"

export type FilterableProperty =
  | "businessUnit"
  | "function"
  | "stage"
  | "vendor"
  | "workforcePath"

export interface ActiveFilter {
  property: FilterableProperty
  values: string[]
}

const PROPERTY_LABELS: Record<FilterableProperty, string> = {
  businessUnit: "Business Unit",
  function: "Function",
  stage: "Stage",
  vendor: "Vendor",
  workforcePath: "Workforce Path",
}

const FILTERABLE_PROPERTIES: FilterableProperty[] = [
  "businessUnit",
  "function",
  "stage",
  "vendor",
  "workforcePath",
]

function getUniqueValues(data: PortfolioItem[], property: FilterableProperty): string[] {
  return Array.from(new Set(data.map((item) => String(item[property])))).sort()
}

function FilterChip({
  filter,
  data,
  onRemove,
  onUpdate,
}: {
  filter: ActiveFilter
  data: PortfolioItem[]
  onRemove: () => void
  onUpdate: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const allValues = getUniqueValues(data, filter.property)

  function toggleValue(v: string) {
    const next = filter.values.includes(v)
      ? filter.values.filter((x) => x !== v)
      : [...filter.values, v]
    if (next.length === 0) onRemove()
    else onUpdate(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center">
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-l-md border border-border bg-muted px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent">
            <span className="text-muted-foreground">
              {PROPERTY_LABELS[filter.property]}:
            </span>
            <span>{filter.values.join(", ")}</span>
          </button>
        </PopoverTrigger>
        <button
          onClick={onRemove}
          aria-label={`Remove ${PROPERTY_LABELS[filter.property]} filter`}
          className="flex items-center rounded-r-md border border-l-0 border-border bg-muted px-1.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <IconX className="size-3" />
        </button>
      </div>

      <PopoverContent align="start" className="w-52 p-2">
        <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
          {PROPERTY_LABELS[filter.property]}
        </p>
        <div className="flex flex-col gap-0.5">
          {allValues.map((v) => (
            <label
              key={v}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-accent"
            >
              <Checkbox
                checked={filter.values.includes(v)}
                onCheckedChange={() => toggleValue(v)}
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
  filters: ActiveFilter[]
  onChange: (filters: ActiveFilter[]) => void
}

export function PropertyFilter({ data, filters, onChange }: PropertyFilterProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"property" | "values">("property")
  const [pendingProperty, setPendingProperty] = useState<FilterableProperty | null>(null)
  const [pendingValues, setPendingValues] = useState<string[]>([])

  const activeProperties = new Set(filters.map((f) => f.property))
  const availableProperties = FILTERABLE_PROPERTIES.filter((p) => !activeProperties.has(p))

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setStep("property")
      setPendingProperty(null)
      setPendingValues([])
    }
  }

  function selectProperty(property: FilterableProperty) {
    setPendingProperty(property)
    setPendingValues([])
    setStep("values")
  }

  function togglePendingValue(v: string) {
    setPendingValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  function applyFilter() {
    if (!pendingProperty || pendingValues.length === 0) return
    onChange([...filters, { property: pendingProperty, values: pendingValues }])
    handleOpenChange(false)
  }

  function removeFilter(property: FilterableProperty) {
    onChange(filters.filter((f) => f.property !== property))
  }

  function updateFilter(property: FilterableProperty, values: string[]) {
    onChange(filters.map((f) => (f.property === property ? { ...f, values } : f)))
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <FilterChip
          key={filter.property}
          filter={filter}
          data={data}
          onRemove={() => removeFilter(filter.property)}
          onUpdate={(values) => updateFilter(filter.property, values)}
        />
      ))}

      {availableProperties.length > 0 && (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="xs">
              <IconPlus data-icon="inline-start" />
              Add filter
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-52 p-2">
            {step === "property" ? (
              <>
                <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
                  Filter by
                </p>
                <div className="flex flex-col gap-0.5">
                  {availableProperties.map((p) => (
                    <button
                      key={p}
                      onClick={() => selectProperty(p)}
                      className="rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                    >
                      {PROPERTY_LABELS[p]}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-1">
                  <button
                    onClick={() => setStep("property")}
                    className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <IconChevronLeft className="size-3.5" />
                  </button>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {pendingProperty ? PROPERTY_LABELS[pendingProperty] : ""}
                  </p>
                </div>

                <div className="mb-2 flex flex-col gap-0.5">
                  {pendingProperty &&
                    getUniqueValues(data, pendingProperty).map((v) => (
                      <label
                        key={v}
                        className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-accent"
                      >
                        <Checkbox
                          checked={pendingValues.includes(v)}
                          onCheckedChange={() => togglePendingValue(v)}
                        />
                        <span className="text-sm">{v}</span>
                      </label>
                    ))}
                </div>

                <Separator className="mb-2" />
                <Button
                  size="xs"
                  className="w-full"
                  disabled={pendingValues.length === 0}
                  onClick={applyFilter}
                >
                  Apply
                </Button>
              </>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
