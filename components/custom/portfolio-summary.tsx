"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { PortfolioItem } from "./portfolio-table"

function CardInfoButton({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="ghost" size="icon-xs" aria-label={`About ${title}`} onClick={() => setOpen(true)}>
        <IconInfoCircle className="size-4 text-muted-foreground" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ValueTransitionProps {
  fromValue: string
  fromLabel: string
  fromClassName?: string
  toValue: string
  toLabel: string
  toClassName?: string
  badge: ReactNode
}

function ValueTransition({ fromValue, fromLabel, fromClassName, toValue, toLabel, toClassName, badge }: ValueTransitionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <span className={cn("text-4xl font-semibold tabular-nums", fromClassName)}>{fromValue}</span>
          <span className="text-md text-muted-foreground">{fromLabel}</span>
        </div>
        <IconArrowRight className="size-8 shrink-0 text-muted-foreground" />
        <div className="flex flex-col items-center">
          <span className={cn("text-4xl font-semibold tabular-nums", toClassName)}>{toValue}</span>
          <span className="text-md text-muted-foreground">{toLabel}</span>
        </div>
      </div>
      <div className="flex justify-center">{badge}</div>
    </div>
  )
}

function realizedColorClass(pct: number) {
  if (pct >= 75) return "text-green-600 dark:text-green-400"
  if (pct >= 50) return "text-yellow-600 dark:text-yellow-400"
  return "text-destructive dark:text-destructive-foreground"
}

function sentimentColorClass(score: number) {
  if (score > 4.0) return "text-green-500"
  if (score >= 3.0) return "text-yellow-500"
  return "text-red-500"
}

function SpeedDial({ score, count }: { score: number; count: number }) {
  // Arc spans 240° from 210° (7 o'clock) to -30° (5 o'clock), going clockwise over the top.
  // In SVG: sweep=1 = clockwise on screen.
  const cx = 80, cy = 63, r = 58

  const scoreColor =
    score >= 80 ? "text-green-600 dark:text-green-400" :
    score >= 46 ? "text-yellow-600 dark:text-yellow-400" :
    "text-destructive dark:text-destructive-foreground"

  const toRad = (deg: number) => (deg * Math.PI) / 180

  function ptAt(deg: number): [number, number] {
    return [cx + r * Math.cos(toRad(deg)), cy - r * Math.sin(toRad(deg))]
  }

  // score 0 → 210°, score 100 → -30°  (240° CW span)
  const sAngle = (s: number) => 210 - s * 2.4

  function arcD(s1: number, s2: number): string {
    const [x1, y1] = ptAt(sAngle(s1))
    const [x2, y2] = ptAt(sAngle(s2))
    const large = (s2 - s1) * 2.4 > 180 ? 1 : 0
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
  }

  const needleLen = r * 0.78
  const na = toRad(sAngle(score))
  const nx = (cx + needleLen * Math.cos(na)).toFixed(2)
  const ny = (cy - needleLen * Math.sin(na)).toFixed(2)

  return (
    <div className="flex w-full items-center">
        <svg viewBox="0 0 160 100" className={cn("w-2/5 h-auto shrink-0", scoreColor)}>
        <path d={arcD(0, 45)}   fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" className="text-destructive" />
        <path d={arcD(45, 79)}  fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" className="text-yellow-500" />
        <path d={arcD(79, 100)} fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" className="text-green-500" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="currentColor" />
      </svg>
      <div className="flex flex-col gap-1">
        <span className={cn("text-5xl font-bold tabular-nums", scoreColor)}>
          {score}
        </span>
        <Badge variant="outline" className="text-xs text-muted-foreground tabular-nums">
          Based on {count} Deployment{count !== 1 ? "s" : ""}
        </Badge>
      </div>
    </div>
  )
}

const PREV_SENTIMENT_AVG = 3.8

interface PortfolioSummaryProps {
  data: PortfolioItem[]
}

export function PortfolioSummary({ data }: PortfolioSummaryProps) {
  const n = data.length

  const avgUopScore = n > 0 ? Math.round(data.reduce((s, r) => s + r.uopScore, 0) / n) : 0

  const totalCommitted = data.reduce((s, r) => s + r.committedCost, 0)
  const totalRealized = data.reduce((s, r) => s + r.realizedCost, 0)
  const realizedPct = totalCommitted > 0 ? Math.round((totalRealized / totalCommitted) * 100) : 0

  const totalPeopleCommitted = data.reduce((s, r) => s + r.peopleCommitted, 0)
  const totalPeopleAugmented = data.reduce((s, r) => s + r.peopleAugmented, 0)
  const peoplePct = totalPeopleCommitted > 0 ? (totalPeopleAugmented / totalPeopleCommitted) * 100 : 0

  const peopleAugmentedColor =
    peoplePct >= 75 ? "text-green-400" :
    peoplePct >= 50 ? "text-yellow-400" :
    "text-red-400"

  const peoplePillCls =
    peoplePct >= 75 ? "bg-green-500/20 text-green-400" :
    peoplePct >= 50 ? "bg-yellow-500/20 text-yellow-400" :
    "bg-red-500/20 text-red-400"

  const peoplePillLabel = totalPeopleAugmented > totalPeopleCommitted
    ? `+${(totalPeopleAugmented - totalPeopleCommitted).toLocaleString()} Exceeded`
    : totalPeopleAugmented === totalPeopleCommitted
      ? "Fully Resolved"
      : `${(totalPeopleCommitted - totalPeopleAugmented).toLocaleString()} Awaiting Path`

  const avgSentiment = n > 0
    ? Math.round((data.reduce((s, r) => s + r.sentimentScore, 0) / n) * 10) / 10
    : 0
  const sentimentDelta = Math.round((avgSentiment - PREV_SENTIMENT_AVG) * 10) / 10

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Avg UoP Score */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">
            Average UoP Score
          </CardTitle>
          <CardAction>
            <CardInfoButton
              title="Average UoP Score"
              description="The mean Unit of Potential (UoP) score across all selected deployments. It reflects the overall effectiveness and maturity of the portfolio. Green (80–100) indicates strong performance, amber (46–79) signals moderate progress, and red (0–45) highlights deployments at risk."
            />
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <SpeedDial score={avgUopScore} count={n} />
        </CardContent>
      </Card>

      {/* Cost */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground gap-1">
            Total Cost ($M)
          </CardTitle>
          <CardAction>
            <CardInfoButton
              title="Total Cost ($M)"
              description="Compares the total committed budget against the total realized cost across all selected deployments. The realization rate indicates how much of the committed investment has been spent. Green (≥75%) reflects healthy pacing, amber (50–74%) indicates moderate uptake, and red (<50%) flags significant underutilization."
            />
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <ValueTransition
            fromValue={`$${totalCommitted.toFixed(1)}`}
            fromLabel="Committed"
            toValue={`$${totalRealized.toFixed(1)}`}
            toLabel="Realized"
            toClassName={realizedColorClass(realizedPct)}
            badge={
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                realizedPct >= 75 ? "bg-green-500/20 text-green-400"
                : realizedPct >= 50 ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
              )}>
                {realizedPct}% Realization Rate
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* Redeployment Status */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">
            Total People Committed
          </CardTitle>
          <CardAction>
            <CardInfoButton
              title="People Committed"
              description="Tracks workforce transformation across the selected deployments. Committed is the total number of people planned for augmentation or reskilling. Confirmed is the number who have transitioned into their new roles. People Left Awaiting Path represents the gap — those committed but not yet placed."
            />
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <ValueTransition
            fromValue={totalPeopleCommitted.toLocaleString()}
            fromLabel="Committed"
            toValue={totalPeopleAugmented.toLocaleString()}
            toLabel="Confirmed"
            toClassName={peopleAugmentedColor}
            badge={
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", peoplePillCls)}>
                {peoplePillLabel}
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* Portfolio Sentiment */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">
            Average Worker Voice
          </CardTitle>
          <CardAction>
            <CardInfoButton
              title="Worker Voice"
              description="The mean sentiment score across all selected deployments, rated on a scale of 1–5. It reflects stakeholder and workforce sentiment toward the AI initiatives. The delta compares the current cohort average against the previous period baseline of 3.8."
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className={cn("text-4xl font-semibold tabular-nums", sentimentColorClass(avgSentiment))}>
            {avgSentiment.toFixed(1)}
            <span className="text-lg font-normal text-muted-foreground"> / 5</span>
          </p>
          <span className={cn(
            "mt-1 rounded-full px-2 py-0.5 text-xs tabular-nums",
            sentimentDelta > 0
              ? "bg-green-500/20 text-green-400"
              : sentimentDelta < 0
                ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
          )}>
            {sentimentDelta > 0 ? "↑" : sentimentDelta < 0 ? "↓" : "—"}{" "}
            {Math.abs(sentimentDelta).toFixed(1)} vs Prev Period
          </span>
        </CardContent>
      </Card>

    </div>
  )
}
