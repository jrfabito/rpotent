"use client"

import { useState } from "react"
import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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

const PREV_SENTIMENT_BASELINE = 3.8

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

function sentimentColorClass(score: number) {
  if (score > 4.0) return "text-green-600 dark:text-green-400"
  if (score >= 3.0) return "text-yellow-600 dark:text-yellow-400"
  return "text-destructive"
}

function resolvedLabel(done: number, committed: number) {
  if (done > committed) return `+${(done - committed).toLocaleString()} Exceeded`
  if (done === committed) return "Fully Resolved"
  return `${(committed - done).toLocaleString()} Awaiting Path`
}


interface ValueTransitionProps {
  fromValue: string
  fromLabel: string
  toValue: string
  toLabel: string
  toClassName?: string
  badge: React.ReactNode
  deltaBadge?: React.ReactNode
}

function ValueTransition({ fromValue, fromLabel, toValue, toLabel, toClassName, badge, deltaBadge }: ValueTransitionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-semibold tabular-nums">{fromValue}</span>
          <span className="text-sm text-muted-foreground">{fromLabel}</span>
        </div>
        <IconArrowRight className="size-8 shrink-0 text-muted-foreground" />
        <div className="flex flex-col items-center">
          <span className={cn("text-4xl font-semibold tabular-nums", toClassName)}>{toValue}</span>
          <span className="text-sm text-muted-foreground">{toLabel}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {badge}
        {deltaBadge}
      </div>
    </div>
  )
}

interface DeploymentSummaryProps {
  item: PortfolioItem
}

export function DeploymentSummary({ item }: DeploymentSummaryProps) {
  const peoplePct = item.peopleCommitted > 0 ? (item.peopleAugmented / item.peopleCommitted) * 100 : 0
  const reskillPct = item.reskillCommitted > 0 ? (item.reskillDone / item.reskillCommitted) * 100 : 0
  const sentimentDelta = Math.round((item.sentimentScore - PREV_SENTIMENT_BASELINE) * 10) / 10

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

      {/* Cost */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">Cost ($M)</CardTitle>
          <CardAction>
            <CardInfoButton
              title="Cost ($M)"
              description="Compares the committed budget against the realized cost for this deployment. The realization rate indicates how much of the committed investment has been spent. Green (≥75%) reflects healthy pacing, amber (50–74%) indicates moderate uptake, and red (<50%) flags significant underutilization."
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ValueTransition
            fromValue={`$${item.committedCost.toFixed(1)}`}
            fromLabel="Committed"
            toValue={`$${item.realizedCost.toFixed(1)}`}
            toLabel="Realized"
            toClassName={pctColorClass(item.realizedCostPct)}
            badge={
              <span className={cn("rounded-full px-2 py-0.5 text-xs tabular-nums", pctPillClass(item.realizedCostPct))}>
                {item.realizedCostPct}% Realization Rate
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* People Committed */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">People Committed</CardTitle>
          <CardAction>
            <CardInfoButton
              title="People Committed"
              description="Tracks workforce transformation for this deployment. Committed is the total number of people planned for augmentation. Confirmed is the number who have transitioned into their new roles."
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ValueTransition
            fromValue={item.peopleCommitted.toLocaleString()}
            fromLabel="Committed"
            toValue={item.peopleAugmented.toLocaleString()}
            toLabel="Augmented"
            toClassName={pctColorClass(peoplePct)}
            badge={
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", pctPillClass(peoplePct))}>
                {resolvedLabel(item.peopleAugmented, item.peopleCommitted)}
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* Reskill */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">Upskill Commitment</CardTitle>
          <CardAction>
            <CardInfoButton
              title="Upskill Commitment"
              description="Tracks upskilling progress for this deployment. Committed is the number of people planned for upskilling. Done is the number who have completed their upskilling program."
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ValueTransition
            fromValue={item.reskillCommitted.toLocaleString()}
            fromLabel="Committed"
            toValue={item.reskillDone.toLocaleString()}
            toLabel="Done"
            toClassName={pctColorClass(reskillPct)}
            badge={
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", pctPillClass(reskillPct))}>
                {resolvedLabel(item.reskillDone, item.reskillCommitted)}
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* Worker Voice */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">Worker Voice</CardTitle>
          <CardAction>
            <CardInfoButton
              title="Worker Voice"
              description="The sentiment score for this deployment, rated on a scale of 1–5. It reflects stakeholder and workforce sentiment toward the AI initiative. The delta compares the current score against the previous period baseline of 3.8. Green (>4.0) indicates strong sentiment, amber (3.0–4.0) signals moderate engagement, and red (<3.0) highlights concern."
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-1.5">
          <p className={cn("text-4xl font-semibold tabular-nums", sentimentColorClass(item.sentimentScore))}>
            {item.sentimentScore.toFixed(1)}
            <span className="text-lg font-normal text-muted-foreground"> / 5</span>
          </p>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-xs tabular-nums",
            sentimentDelta > 0 ? "bg-green-500/20 text-green-400"
            : sentimentDelta < 0 ? "bg-red-500/20 text-red-400"
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
