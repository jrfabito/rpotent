"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconChevronLeft, IconChevronRight, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { PortfolioItem } from "./portfolio-table"

interface DeploymentNavProps {
  currentUopId: string
  deployments: PortfolioItem[]
}

export function DeploymentNav({ currentUopId, deployments }: DeploymentNavProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const currentIndex = deployments.findIndex((d) => d.uopId === currentUopId)
  const current = deployments[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < deployments.length - 1

  function navigate(uopId: string) {
    setOpen(false)
    router.push(`/deployment/${uopId}`)
  }

  return (
    <div className="flex items-center border border-border rounded-md overflow-hidden h-8 text-sm">
      {/* Prev */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        onClick={() => hasPrev && navigate(deployments[currentIndex - 1].uopId)}
        className="rounded-none border-0 border-r border-border h-full px-2.5 gap-1 text-xs shadow-none"
      >
        <IconChevronLeft className="size-3.5" />
        Prev
      </Button>

      {/* Deployment selector dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 px-3 h-full bg-background hover:bg-accent transition-colors border-r border-border max-w-[200px] min-w-0">
            <span className="truncate font-medium">{current?.name ?? "—"}</span>
            <IconChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="p-1 w-72">
          <div className="max-h-72 overflow-y-auto">
            {deployments.map((d) => (
              <button
                key={d.uopId}
                onClick={() => navigate(d.uopId)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors text-left",
                  d.uopId === currentUopId && "bg-accent"
                )}
              >
                <span className="truncate">{d.name}</span>
                <span className="text-muted-foreground text-xs shrink-0 tabular-nums">{d.uopScore}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        onClick={() => hasNext && navigate(deployments[currentIndex + 1].uopId)}
        className="rounded-none border-0 h-full px-2.5 gap-1 text-xs shadow-none"
      >
        Next
        <IconChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}
