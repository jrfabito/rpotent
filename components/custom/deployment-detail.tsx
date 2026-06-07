"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  TimeRangeFilter,
  DEFAULT_TIME_RANGE,
  type TimeRangeValue,
} from "./time-range-filter"
import type { PortfolioItem } from "./portfolio-table"
import { PortfolioList } from "./portfolio-list"
import { DeploymentSummary } from "./deployment-summary"
import { DeploymentTelemetry, type Telemetry } from "./deployment-telemetry"
import { DeploymentNav } from "./deployment-nav"

type DeploymentItem = PortfolioItem & {
  telemetry?: Telemetry | null
}

function getRecommendation(score: number): "Invest" | "Hold" | "Exit" {
  if (score > 75) return "Invest"
  if (score >= 50) return "Hold"
  return "Exit"
}

interface DeploymentDetailProps {
  item: DeploymentItem
  allDeployments: PortfolioItem[]
}

export function DeploymentDetail({ item, allDeployments }: DeploymentDetailProps) {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(DEFAULT_TIME_RANGE)

  const telemetry = item.telemetry
  const awaitingPath = item.peopleCommitted - item.peopleAugmented
  const isCut = getRecommendation(item.uopScore) === "Exit"

  return (
    <div className="flex flex-col gap-6">

      {/* Toolbar */}
      <div className="relative flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.push("/")} className="gap-1.5">
          <IconArrowLeft className="size-4" />
          Return to Portfolio Overview
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2">
          <DeploymentNav currentUopId={item.uopId} deployments={allDeployments} />
        </div>
        <div className="ml-auto">
          <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
        </div>
      </div>
      
      {isCut && (
        <Alert variant="default" className="w-full border-2 border-destructive">
          <AlertCircleIcon />
          <AlertTitle><span className="font-bold">Caution:</span> {item.peopleCommitted.toLocaleString()} people were committed to this deployment.</AlertTitle>
          <AlertDescription className="text-foreground">
            {item.peopleCommitted.toLocaleString()} people were committed to this deployment. {item.peopleAugmented.toLocaleString()} have a confirmed path. {awaitingPath.toLocaleString()} are awaiting a path.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              View paths in Global Labor Graph
            </Button>
          </AlertAction>
        </Alert>
      )}

      {/* Summary row */}
      <PortfolioList data={[item]} variant="detail" />

      <DeploymentSummary item={item} />

      <DeploymentTelemetry telemetry={telemetry} timeRange={timeRange} committedCost={item.committedCost} />

    </div>
  )
}
