"use client"

import { useMemo, useState } from "react"
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
  ResponsiveContainer,
} from "recharts"
import { IconInfoCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type TimeRangeValue } from "./time-range-filter"

function ChartInfoButton({ title, description }: { title: string; description: string }) {
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

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Telemetry {
  tokensPerDay: number[]
  toolCallsPerDay: number[]
  hrsSavedPerFTE: number[]
  realizedCumulative: number[]
  sentiment: number[]
  redeploymentConfirmed: number[]
  redeploymentCommitted: number
}

// ── Date label helpers ────────────────────────────────────────────────────────

function resolveRange(timeRange: TimeRangeValue): { start: Date; end: Date } {
  const now = new Date()
  switch (timeRange.option) {
    case "24h": return { start: startOfDay(subDays(now, 1)), end: endOfDay(now) }
    case "7d":  return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) }
    case "1m":  return { start: startOfDay(subMonths(now, 1)), end: endOfDay(now) }
    case "custom": return {
      start: startOfDay(timeRange.customStart),
      end: endOfDay(timeRange.customEnd),
    }
  }
}

function generateLabels(timeRange: TimeRangeValue, count = 11): string[] {
  const { start, end } = resolveRange(timeRange)
  const totalMs = end.getTime() - start.getTime()
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(start.getTime() + (totalMs * i) / (count - 1))
    return format(date, "MMM d")
  })
}

// ── Chart data helpers ────────────────────────────────────────────────────────

function toChartData(values: number[], labels: string[]) {
  return values.map((value, i) => ({ date: labels[i], value }))
}

function calcAvg(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100
}

function yTicks(values: number[]): [number, number, number] {
  const max = Math.max(...values)
  const mid = Math.round((max / 2) * 10) / 10
  return [0, mid, max]
}

function tooltipStyle() {
  return {
    contentStyle: {
      backgroundColor: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      padding: "8px",
      fontSize: "12px",
    },
    labelStyle: { color: "var(--muted-foreground)" },
    itemStyle: { color: "var(--foreground)" },
  }
}

const axisTickStyle = { fontSize: 11, fill: "currentColor", className: "text-muted-foreground" }
const refLabelStyle = { fontSize: 12, fill: "currentColor", opacity: 0.9, className: "text-muted-foreground" }

// ── Single chart card ─────────────────────────────────────────────────────────

interface ChartCardProps {
  title: string
  subtitle: string
  description: string
  data: { date: string; value: number }[]
  stroke: string
  unit?: string
  showAvg?: boolean
  committedValue?: number
}

function ChartCard({ title, subtitle, description, data, stroke, unit = "", showAvg = true, committedValue }: ChartCardProps) {
  const values = data.map(d => d.value)
  const ticks = committedValue !== undefined ? yTicks([...values, committedValue]) : yTicks(values)
  const avg = calcAvg(values)
  const { contentStyle, labelStyle } = tooltipStyle()
  const gradientId = `grad-${stroke.replace(/[^a-zA-Z0-9-]/g, "")}`

  const chartData = committedValue !== undefined
    ? data.map(d => ({ ...d, gap: Math.max(0, committedValue - d.value), committed: committedValue }))
    : data

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
        <CardAction>
          <ChartInfoButton title={title} description={description} />
        </CardAction>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 4, right: 52, bottom: 0, left: -8 }}>
            {committedValue === undefined && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
            )}
            <CartesianGrid stroke="currentColor" opacity={0.15} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={axisTickStyle} axisLine={false} tickLine={false} />
            <YAxis ticks={ticks} tick={axisTickStyle} axisLine={false} tickLine={false} domain={committedValue !== undefined ? [0, committedValue] : undefined} />
            <Tooltip
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              itemStyle={{ fontSize: 12 }}
              formatter={(value, name) =>
                name === "gap" ? null : [value, String(name)]
              }
            />
            {showAvg && (
              <ReferenceLine y={avg} stroke="currentColor" opacity={0.7} strokeDasharray="4 4" strokeWidth={2}>
                <Label value={`${avg}${unit}`} position="right" style={refLabelStyle} />
              </ReferenceLine>
            )}
            {committedValue !== undefined ? (
              <>
                <Area type="monotone" dataKey="value" stackId="1" stroke={stroke} strokeWidth={2} fillOpacity={0} dot={false} name="Realized" />
                <Area type="monotone" dataKey="gap" stackId="1" stroke="none" strokeWidth={0} fill="#F59E0B" fillOpacity={0.25} dot={false} name="gap" legendType="none" />
                <Area type="monotone" dataKey="committed" stroke="#F59E0B" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 4" name="Committed" />
              </>
            ) : (
              <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} fill={`url(#${gradientId})`} fillOpacity={1} dot={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>
        {committedValue !== undefined && (
          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-0.5 w-4 rounded" style={{ backgroundColor: stroke }} />
              Realized
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-0.5 w-4 rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 4px, transparent 4px, transparent 8px)", backgroundColor: "transparent" }} />
              Committed
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Redeployment chart (two series) ──────────────────────────────────────────

interface RedeploymentCardProps {
  confirmed: number[]
  committed: number
  labels: string[]
}

function RedeploymentCard({ confirmed, committed, labels }: RedeploymentCardProps) {
  const data = confirmed.map((value, i) => ({
    date: labels[i],
    confirmed: value,
    gap: Math.max(0, committed - value),
    committed,
  }))
  const ticks = yTicks([...confirmed, committed])
  const { contentStyle, labelStyle } = tooltipStyle()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">Upskill Done</CardTitle>
        <CardAction>
          <ChartInfoButton
            title="Upskill Done"
            description="Tracks the number of workers done upskilling against the total committed headcount. The orange solid line shows confirmed placements over time; the amber dashed line shows the committed target."
          />
        </CardAction>
        <p className="text-xs text-muted-foreground">Upskill Done vs Committed headcount</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 52, bottom: 0, left: -8 }}>
            <CartesianGrid stroke="currentColor" opacity={0.15} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={axisTickStyle} axisLine={false} tickLine={false} />
            <YAxis ticks={ticks} tick={axisTickStyle} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              itemStyle={{ fontSize: 12 }}
              formatter={(value, name) =>
                name === "gap" ? null : [Number(value).toLocaleString(), String(name)]
              }
            />
            {/* confirmed is the transparent stack base — its fill anchors the gap area above it */}
            <Area type="monotone" dataKey="confirmed" stackId="1" stroke="oklch(0.553 0.195 38.402)" strokeWidth={2} fillOpacity={0} dot={false} name="Confirmed" />
            {/* gap sits on top of confirmed, filling only the space between the two lines */}
            <Area type="monotone" dataKey="gap" stackId="1" stroke="none" strokeWidth={0} fill="#F59E0B" fillOpacity={0.25} dot={false} name="gap" legendType="none" />
            {/* committed renders as a flat dashed line with no fill */}
            <Area type="monotone" dataKey="committed" stroke="#F59E0B" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 4" name="Committed" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-0.5 w-4 rounded" style={{ backgroundColor: "oklch(0.553 0.195 38.402)" }} />
            Confirmed
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-0.5 w-4 rounded bg-[#F59E0B] opacity-70" style={{ backgroundImage: "repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 4px, transparent 4px, transparent 8px)", backgroundColor: "transparent" }} />
            Committed
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface DeploymentTelemetryProps {
  telemetry: Telemetry | null | undefined
  timeRange: TimeRangeValue
  committedCost?: number
}

export function DeploymentTelemetry({ telemetry, timeRange, committedCost }: DeploymentTelemetryProps) {
  const labels = useMemo(() => generateLabels(timeRange), [timeRange])

  if (!telemetry) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Live telemetry not yet available for this deployment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <SectionLabel label="AI Tool Usage" />
        <div className="grid grid-cols-2 gap-4">
          <ChartCard
            title="Tokens per Day"
            subtitle="Thousands of tokens consumed daily"
            description="The number of tokens consumed by this AI deployment per day, measured in thousands. Tokens represent the units of text processed by the model. Higher values indicate greater usage volume."
            data={toChartData(telemetry.tokensPerDay, labels)}
            stroke="oklch(0.553 0.195 38.402)"
            unit="k"
          />
          <ChartCard
            title="Tool Calls per Day"
            subtitle="Number of tool invocations per day"
            description="The number of individual tool or function calls made by this AI deployment per day. Tool calls represent interactions with external systems, APIs, or capabilities beyond the base model."
            data={toChartData(telemetry.toolCallsPerDay, labels)}
            stroke="oklch(0.553 0.195 38.402)"
          />
        </div>
      </div>

      <div>
        <SectionLabel label="Business Results" />
        <div className="grid grid-cols-2 gap-4">
          <ChartCard
            title="Hours Saved per FTE"
            subtitle="Hours saved per full-time employee per week"
            description="The estimated number of hours saved per full-time employee per week as a result of this AI deployment. This metric reflects productivity gains from automation and AI-assisted workflows."
            data={toChartData(telemetry.hrsSavedPerFTE, labels)}
            stroke="oklch(0.553 0.195 38.402)"
            unit="h"
          />
          <ChartCard
            title="Cost Realized"
            subtitle="Cumulative Cost Realized vs Committed in $M"
            description="The cumulative dollar value realized from this AI deployment over time, measured in millions. This tracks the total business value captured since deployment began and grows monotonically as value is confirmed."
            data={toChartData(telemetry.realizedCumulative, labels)}
            stroke="oklch(0.553 0.195 38.402)"
            unit="M"
            showAvg={false}
            committedValue={committedCost}
          />
        </div>
      </div>

      <div>
        <SectionLabel label="Employee Feedback" />
        <div className="grid grid-cols-2 gap-4">
          <ChartCard
            title="Worker Voice"
            subtitle="Sentiment Score score out of 5"
            description="The worker voice sentiment score for this deployment, rated on a scale of 1 to 5. This reflects how employees feel about the AI initiative based on survey responses collected over the selected period."
            data={toChartData(telemetry.sentiment, labels)}
            stroke="oklch(0.553 0.195 38.402)"
          />
          <RedeploymentCard
            confirmed={telemetry.redeploymentConfirmed}
            committed={telemetry.redeploymentCommitted}
            labels={labels}
          />
        </div>
      </div>

    </div>
  )
}
