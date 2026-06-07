import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface PortfolioItem {
  uopId: string
  name: string
  businessUnit: string
  function: string
  stage: string
  committedCost: number
  realizedCost: number
  realizedCostPct: number
  peopleCommitted: number
  peopleAugmented: number
  augmentDeltaPct: number
  reskillCommitted: number
  reskillDone: number
  reskillDeltaPct: number
  uopScore: number
  sentimentScore: number
  absorption: number
  alignment: number
  vendor: string
  workforcePath: string
  date: string
}

interface PortfolioTableProps {
  data: PortfolioItem[]
}

function stageBadgeVariant(stage: string) {
  if (stage === "MEA") return "default" as const
  if (stage === "MOD") return "secondary" as const
  return "outline" as const
}

function deltaClass(value: number) {
  if (value > 0) return "text-green-600 dark:text-green-400"
  if (value < 0) return "text-destructive"
  return "text-muted-foreground"
}

function formatDelta(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`
}

export function PortfolioTable({ data }: PortfolioTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap text-right">Unit of Potential (UoP)</TableHead>
            <TableHead className="min-w-[200px] whitespace-nowrap">Deployment Name</TableHead>
            <TableHead className="whitespace-nowrap">Business Unit</TableHead>
            <TableHead className="whitespace-nowrap">Function</TableHead>
            <TableHead className="whitespace-nowrap">Stage</TableHead>
            <TableHead className="whitespace-nowrap text-right">Committed $ (M)</TableHead>
            <TableHead className="whitespace-nowrap text-right">Realized $ (M)</TableHead>
            <TableHead className="whitespace-nowrap text-right">Realized %</TableHead>
            <TableHead className="whitespace-nowrap text-right">People Committed</TableHead>
            <TableHead className="whitespace-nowrap text-right">People Confirmed</TableHead>
            <TableHead className="whitespace-nowrap text-right">Augment Δ%</TableHead>
            <TableHead className="whitespace-nowrap text-right">Reskill Committed</TableHead>
            <TableHead className="whitespace-nowrap text-right">Reskill Done</TableHead>
            <TableHead className="whitespace-nowrap text-right">Reskill Δ%</TableHead>
            <TableHead className="whitespace-nowrap text-right">Absorption</TableHead>
            <TableHead className="whitespace-nowrap text-right">Alignment</TableHead>
            <TableHead className="whitespace-nowrap text-right">Sentiment Score</TableHead>
            <TableHead className="whitespace-nowrap">Vendor</TableHead>
            <TableHead className="whitespace-nowrap">Workforce Path</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.uopId}>
              <TableCell className="text-right tabular-nums font-medium">{row.uopScore}%</TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.businessUnit}</TableCell>
              <TableCell>{row.function}</TableCell>
              <TableCell>
                <Badge variant={stageBadgeVariant(row.stage)}>{row.stage}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                ${row.committedCost.toFixed(1)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                ${row.realizedCost.toFixed(1)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.realizedCostPct}%
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.peopleCommitted}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.peopleAugmented}
              </TableCell>
              <TableCell
                className={cn("text-right tabular-nums", deltaClass(row.augmentDeltaPct))}
              >
                {formatDelta(row.augmentDeltaPct)}
              </TableCell>
              <TableCell className="text-right tabular-nums">{row.reskillCommitted}</TableCell>
              <TableCell className="text-right tabular-nums">{row.reskillDone}</TableCell>
              <TableCell className={cn("text-right tabular-nums", deltaClass(row.reskillDeltaPct))}>
                {formatDelta(row.reskillDeltaPct)}
              </TableCell>
              <TableCell className="text-right tabular-nums">{row.absorption}%</TableCell>
              <TableCell className="text-right tabular-nums">{row.alignment}%</TableCell>
              <TableCell className="text-right tabular-nums">{row.sentimentScore.toFixed(2)}</TableCell>
              <TableCell className="text-xs">{row.vendor}</TableCell>
              <TableCell className="text-xs">{row.workforcePath}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
