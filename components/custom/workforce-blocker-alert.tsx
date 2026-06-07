"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PortfolioItem } from "./portfolio-table"
import type { Telemetry } from "./deployment-telemetry"

function getRecommendation(score: number): "Scale" | "Hold" | "Cut" {
  if (score > 75) return "Scale"
  if (score >= 50) return "Hold"
  return "Cut"
}

interface WorkforceBlockerAlertProps {
  item: PortfolioItem
  telemetry?: Telemetry | null
}

export function WorkforceBlockerAlert({ item, telemetry }: WorkforceBlockerAlertProps) {
  const [open, setOpen] = useState(false)

  if (getRecommendation(item.uopScore) !== "Cut") return null

  const confirmedPaths = telemetry
    ? telemetry.redeploymentConfirmed[telemetry.redeploymentConfirmed.length - 1]
    : item.peopleAugmented
  const unresolved = item.peopleCommitted - confirmedPaths

  return (
    <>
      <Alert variant="destructive">
        <AlertTitle>Before actioning this recommendation</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-3">
            <p>
              {item.peopleCommitted.toLocaleString()} people were told their roles would change
              under this deployment. {confirmedPaths.toLocaleString()} have a confirmed path.{" "}
              {unresolved.toLocaleString()} do not.
            </p>
            <p className="font-semibold">
              A cut decision requires a workforce plan for those {unresolved.toLocaleString()} people
              before proceeding.
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Owner: Priya Nair — CHRO</span>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Explore Redeployment Paths in Labor Graph →
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Global Labor Graph</DialogTitle>
            <DialogDescription>
              This is a placeholder for the Global Labor Graph integration. Redeployment path
              exploration for affected workers will be available here.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
