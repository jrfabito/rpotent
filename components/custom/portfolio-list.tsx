"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { IconChevronRight, IconArrowUp, IconArrowDown, IconArrowsSort } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { PortfolioItem } from "./portfolio-table"

function WorkbenchButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="default" size="sm" onClick={() => setOpen(true)}>
        View history in Workbench
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workbench</DialogTitle>
            <DialogDescription>Placeholder link to Workbench</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Recommendation ────────────────────────────────────────────────────────────

type Recommendation = "Invest" | "Hold" | "Exit"

function getRecommendation(score: number): Recommendation {
  if (score > 75) return "Invest"
  if (score >= 50) return "Hold"
  return "Exit"
}

const REC: Record<Recommendation, { border: string; score: string; badge: string }> = {
  Invest: {
    border: "border-l-green-500",
    score: "text-green-600 dark:text-green-400",
    badge: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-400",
  },
  Hold: {
    border: "border-l-amber-500",
    score: "text-yellow-600 dark:text-yellow-400",
    badge: "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-400",
  },
  Exit: {
    border: "border-l-destructive",
    score: "text-destructive",
    badge: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400",
  },
}

// ── Color helpers ─────────────────────────────────────────────────────────────

function pctColorClass(pct: number) {
  if (pct >= 75) return "text-green-600 dark:text-green-400"
  if (pct >= 50) return "text-yellow-600 dark:text-yellow-400"
  return "text-destructive"
}

function pctPillClass(pct: number) {
  if (pct >= 75) return "bg-green-500/20 text-green-400"
  if (pct >= 50) return "bg-yellow-500/20 text-yellow-400"
  return "bg-red-500/20 text-red-400"
}

// ── Sort ──────────────────────────────────────────────────────────────────────

type SortCol = "uopId" | "name" | "uopScore"
type SortDir = "asc" | "desc"
interface SortState { col: SortCol; dir: SortDir }

const DEFAULT_SORT: SortState = { col: "uopScore", dir: "asc" }

function nextSort(current: SortState, col: SortCol): SortState {
  if (current.col !== col) return { col, dir: "asc" }
  if (current.dir === "asc") return { col, dir: "desc" }
  return DEFAULT_SORT
}

function compareItems(a: PortfolioItem, b: PortfolioItem, col: SortCol, dir: SortDir): number {
  const av = a[col], bv = b[col]
  const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number)
  return dir === "asc" ? cmp : -cmp
}

function SortHeader({
  label, col, sort, onSort,
}: {
  label: string
  col: SortCol
  sort: SortState
  onSort: (col: SortCol) => void
}) {
  const isActive = sort.col === col
  return (
    <button
      onClick={() => onSort(col)}
      className={cn(
        "flex items-center gap-0.5 text-xs font-medium transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
      )}
    >
      {label}
      {isActive
        ? sort.dir === "asc"
          ? <IconArrowUp className="size-5 text-primary" />
          : <IconArrowDown className="size-5 text-primary" />
        : <IconArrowsSort className="size-5 opacity-40" />
      }
    </button>
  )
}

function StaticHeader({ label }: { label: string }) {
  return <span className="text-xs font-medium text-muted-foreground">{label}</span>
}

// ── Redeployment bar ──────────────────────────────────────────────────────────

function redeployFillClass(pct: number) {
  if (pct > 75) return "bg-green-500"
  if (pct >= 50) return "bg-yellow-500"
  return "bg-destructive/80"
}

function RedeploymentBar({ augmented, committed }: { augmented: number; committed: number }) {
  const pct = committed > 0 ? (augmented / committed) * 100 : 0

  const pillCls = pctPillClass(pct)
  const pillLabel = augmented > committed
    ? `+${(augmented - committed).toLocaleString()} Exceeded`
    : augmented === committed
      ? "Fully Resolved"
      : `${(committed - augmented).toLocaleString()} Awaiting Path`

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className={cn("absolute inset-y-0 left-0 rounded-l-full", redeployFillClass(pct))} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="flex justify-between text-xs tabular-nums">
        <span className={pctColorClass(pct)}>{augmented.toLocaleString()} Confirmed</span>
        <span className="text-muted-foreground">{committed.toLocaleString()} Committed</span>
      </div>
      <div className="flex justify-center">
        <span className={cn("self-start rounded-full px-2 py-0.5 text-xs", pillCls)}>
          {pillLabel}
        </span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface PortfolioListProps {
  data: PortfolioItem[]
  variant?: "overview" | "detail"
}

export function PortfolioList({ data, variant = "overview" }: PortfolioListProps) {
  const isDetail = variant === "detail"
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT)

  const handleSort = (col: SortCol) => setSort(s => nextSort(s, col))

  const sorted = useMemo(() => {
    const arr = [...data]
    arr.sort((a, b) => compareItems(a, b, sort.col, sort.dir))
    return arr
  }, [data, sort])

  if (sorted.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-border">
        <p className="text-sm text-muted-foreground">No deployments match the current filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">

      {/* Header row */}
      <div className="flex items-center gap-6 border-b border-border border-l-4 border-l-transparent bg-muted/30 px-6 py-2">
        <div className="flex w-20 shrink-0 items-center">
          {isDetail
            ? <StaticHeader label="UoP Score" />
            : <SortHeader label="UoP Score" col="uopScore" sort={sort} onSort={handleSort} />}
        </div>
        <div className="min-w-[280px] flex-1">
          {isDetail
            ? <StaticHeader label="Deployment" />
            : <SortHeader label="Deployment" col="name" sort={sort} onSort={handleSort} />}
        </div>
        <div className="flex flex-1 items-center">
          <StaticHeader label="Recommendation" />
        </div>
        {isDetail && (
          <div className="flex flex-col gap-0.5 w-36">
            <StaticHeader label="Absorption / Alignment" />
          </div>
        )}
        {!isDetail && (
          <>
            <div className="flex flex-col gap-0.5 w-36">
              <StaticHeader label="Cost" />
            </div>
            <div className="flex flex-1 items-center">
              <StaticHeader label="People Committed" />
            </div>
          </>
        )}
        {isDetail && (
          <>
            <div className="flex flex-1 items-center">
              <StaticHeader label="Workforce Path" />
            </div>
            <div className="shrink-0" aria-hidden>
              <Button variant="default" size="sm" className="invisible pointer-events-none">View history in Workbench</Button>
            </div>
          </>
        )}
        {!isDetail && <div className="size-6 shrink-0" />}
      </div>

      {/* Data rows */}
      <div className="divide-y divide-border">
        {sorted.map((item) => {
          const rec = getRecommendation(item.uopScore)
          const cfg = REC[rec]

          const rowContent = (
            <>
              {/* UoP score */}
              <div className={cn("flex w-20 shrink-0 items-center text-3xl font-bold tabular-nums", cfg.score)}>
                {item.uopScore}
              </div>

              {/* Deployment name + subtitle */}
              <div className="flex min-w-[280px] flex-1 flex-col">
                <p className="text-lg font-medium leading-tight">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.uopId} · {item.businessUnit} · {item.vendor} · {item.stage}
                </p>
              </div>

              {/* Suggested Executive Action badge */}
              <div className="flex flex-1 items-center">
                <Badge
                  variant="outline"
                  className={cn(cfg.badge, "px-3 py-3 text-md")}
                >
                  {rec}
                </Badge>
              </div>

              {/* Absorption / Alignment — detail only */}
              {isDetail && (
                <div className="flex flex-col gap-0.5 w-36">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Absorption</span>
                    <span className={cn("tabular-nums", pctColorClass(item.absorption))}>{item.absorption}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Alignment</span>
                    <span className={cn("tabular-nums", pctColorClass(item.alignment))}>{item.alignment}</span>
                  </div>
                </div>
              )}

              {/* Cost + People Committed — overview only */}
              {!isDetail && (
                <>
                  <div className="flex flex-col gap-0.5 w-36">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">Committed</span>
                      <span className="tabular-nums">${item.committedCost.toFixed(1)}M</span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">Realized</span>
                      <span className={cn("tabular-nums", pctColorClass(item.realizedCostPct))}>
                        ${item.realizedCost.toFixed(1)}M
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={cn("rounded-full px-2 py-1 text-xs font-medium mt-2 tabular-nums", pctPillClass(item.realizedCostPct))}>
                        {item.realizedCostPct}% Realization Rate
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center">
                    <RedeploymentBar augmented={item.peopleAugmented} committed={item.peopleCommitted} />
                  </div>
                </>
              )}

              {/* Workforce Path — detail only */}
              {isDetail && (
                <div className="flex flex-1 items-center">
                  <span className="text-sm">{item.workforcePath}</span>
                </div>
              )}

              {/* Workbench action — detail only */}
              {isDetail && (
                <div className="shrink-0">
                  <WorkbenchButton />
                </div>
              )}

              {/* Chevron — overview only */}
              {!isDetail && (
                <div className="shrink-0 text-muted-foreground">
                  <IconChevronRight className="size-6" />
                </div>
              )}
            </>
          )

          return isDetail ? (
            <div
              key={item.uopId}
              className={cn("flex items-center gap-6 border-l-4 px-6 py-4", cfg.border)}
            >
              {rowContent}
            </div>
          ) : (
            <Link
              key={item.uopId}
              href={`/deployment/${item.uopId}`}
              className={cn("flex items-center gap-6 border-l-4 px-6 py-4 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted", cfg.border)}
            >
              {rowContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
