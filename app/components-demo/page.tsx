"use client"

import React, { useState } from "react"
import { toast } from "sonner"

import {
  IconSearch, IconSettings, IconPlus, IconTrash, IconEdit, IconEye,
  IconDownload, IconFilter, IconRefresh, IconAlertCircle, IconInfoCircle,
  IconGridDots, IconList, IconMap, IconBold, IconItalic, IconUnderline,
  IconAlignLeft, IconAlignCenter, IconAlignRight, IconChevronDown,
  IconBell, IconStar, IconUser, IconMail, IconCheck, IconFileInvoice,
} from "@tabler/icons-react"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogAction, AlertDialogCancel, AlertDialogMedia,
} from "@/components/ui/alert-dialog"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import {
  Field, FieldLabel, FieldDescription, FieldError, FieldGroup,
  FieldLegend, FieldSet,
} from "@/components/ui/field"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import {
  Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator,
  ItemTitle, ItemDescription,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "@/components/ui/native-select"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Popover, PopoverTrigger, PopoverContent, PopoverHeader,
  PopoverTitle, PopoverDescription,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectGroup,
  SelectLabel, SelectItem, SelectSeparator,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableHeader, TableBody, TableFooter, TableHead,
  TableRow, TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const CUSTOMERS = [
  { name: "Acme Corp", email: "billing@acme.com", plan: "Enterprise", status: "Active", mrr: "$2,400", initials: "AC" },
  { name: "Globex Inc", email: "admin@globex.io", plan: "Pro", status: "Trial", mrr: "$0", initials: "GI" },
  { name: "Initech", email: "ops@initech.com", plan: "Starter", status: "Active", mrr: "$49", initials: "IN" },
  { name: "Umbrella LLC", email: "finance@umbrella.co", plan: "Pro", status: "Suspended", mrr: "$199", initials: "UL" },
  { name: "Soylent Corp", email: "hello@soylent.co", plan: "Enterprise", status: "Active", mrr: "$4,800", initials: "SC" },
]

const INVOICES = [
  { id: "INV-1042", amount: "$1,200" }, { id: "INV-1041", amount: "$480" },
  { id: "INV-1040", amount: "$2,400" }, { id: "INV-1039", amount: "$360" },
  { id: "INV-1038", amount: "$800" }, { id: "INV-1037", amount: "$640" },
  { id: "INV-1036", amount: "$280" }, { id: "INV-1035", amount: "$1,200" },
  { id: "INV-1034", amount: "$450" }, { id: "INV-1033", amount: "$90" },
  { id: "INV-1032", amount: "$720" }, { id: "INV-1031", amount: "$380" },
]

const TEAM = [
  { name: "Grace Hopper", role: "Engineering Lead", initials: "GH" },
  { name: "Alan Turing", role: "Backend Engineer", initials: "AT" },
  { name: "Ada Lovelace", role: "Frontend Developer", initials: "AL" },
]

function statusVariant(status: string) {
  if (status === "Active") return "default" as const
  if (status === "Trial") return "secondary" as const
  return "destructive" as const
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{title}</h2>
        <Separator className="mt-2" />
      </div>
      {children}
    </section>
  )
}

function Sub({ label, children, wrap = true }: { label: string; children: React.ReactNode; wrap?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className={wrap ? "flex flex-wrap items-center gap-3" : ""}>{children}</div>
    </div>
  )
}

export default function Page() {
  const [sliderValue, setSliderValue] = useState([45])
  const [radioValue, setRadioValue] = useState("monthly")

  return (
    <div className="mx-auto max-w-4xl p-8 flex flex-col gap-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-wider uppercase">Component Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All installed shadcn/ui components with common variants and states.
        </p>
      </div>

      {/* ── BUTTONS & ACTIONS ──────────────────────────────────── */}
      <Section title="Buttons & Actions">
        <Sub label="Variants">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="secondary">Export</Button>
          <Button variant="ghost">Dismiss</Button>
          <Button variant="destructive">Delete Account</Button>
          <Button variant="link">View details</Button>
        </Sub>

        <Sub label="Sizes">
          <Button size="lg">Large</Button>
          <Button>Default</Button>
          <Button size="sm">Small</Button>
          <Button size="xs">Extra Small</Button>
        </Sub>

        <Sub label="Icon buttons">
          <Button size="icon"><IconPlus /></Button>
          <Button size="icon-sm" variant="outline"><IconEdit /></Button>
          <Button size="icon-xs" variant="ghost"><IconTrash /></Button>
          <Button size="icon" variant="secondary"><IconDownload /></Button>
        </Sub>

        <Sub label="With icons">
          <Button><IconPlus data-icon="inline-start" />New Invoice</Button>
          <Button variant="outline"><IconDownload data-icon="inline-start" />Export CSV</Button>
          <Button variant="destructive"><IconTrash data-icon="inline-start" />Delete</Button>
          <Button variant="ghost"><IconRefresh data-icon="inline-start" />Sync</Button>
        </Sub>

        <Sub label="Disabled states">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </Sub>

        <Sub label="Button group">
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="icon-sm"><IconGridDots /></Button>
            <Button variant="outline" size="icon-sm"><IconList /></Button>
            <Button variant="outline" size="icon-sm"><IconMap /></Button>
          </ButtonGroup>
        </Sub>

        <Sub label="Toggle">
          <Toggle aria-label="Bold"><IconBold /></Toggle>
          <Toggle aria-label="Italic" variant="outline"><IconItalic /></Toggle>
          <Toggle aria-label="Notifications" pressed><IconBell />Notifications</Toggle>
          <Toggle aria-label="Favorite" variant="outline" disabled><IconStar />Favorite</Toggle>
        </Sub>

        <Sub label="Toggle group">
          <ToggleGroup type="single" defaultValue="center" variant="outline">
            <ToggleGroupItem value="left"><IconAlignLeft /></ToggleGroupItem>
            <ToggleGroupItem value="center"><IconAlignCenter /></ToggleGroupItem>
            <ToggleGroupItem value="right"><IconAlignRight /></ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline">
            <ToggleGroupItem value="bold"><IconBold /></ToggleGroupItem>
            <ToggleGroupItem value="italic"><IconItalic /></ToggleGroupItem>
            <ToggleGroupItem value="underline"><IconUnderline /></ToggleGroupItem>
          </ToggleGroup>
        </Sub>
      </Section>

      {/* ── FORM CONTROLS ─────────────────────────────────────── */}
      <Section title="Form Controls">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input id="email" type="email" placeholder="grace@acme.com" />
          </Field>

          <Field>
            <FieldLabel htmlFor="search">Search Customers</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start"><IconSearch /></InputGroupAddon>
              <InputGroupInput id="search" placeholder="Company name or email…" />
              <InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="notes">Internal Notes</FieldLabel>
            <Textarea id="notes" placeholder="Add any context about this account, escalations, or special agreements…" />
            <FieldDescription>Only visible to your team.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <Select>
              <SelectTrigger className="w-full" id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>North America</SelectLabel>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="mx">Mexico</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="plan">Plan</FieldLabel>
            <NativeSelect id="plan">
              <NativeSelectOption value="">Select a plan</NativeSelectOption>
              <NativeSelectOptGroup label="Self-serve">
                <NativeSelectOption value="starter">Starter — $49/mo</NativeSelectOption>
                <NativeSelectOption value="pro">Pro — $199/mo</NativeSelectOption>
              </NativeSelectOptGroup>
              <NativeSelectOptGroup label="Sales-led">
                <NativeSelectOption value="enterprise">Enterprise — custom</NativeSelectOption>
              </NativeSelectOptGroup>
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel>Volume Discount</FieldLabel>
            <div className="py-3">
              <Slider defaultValue={sliderValue} max={100} step={5} onValueChange={setSliderValue} />
            </div>
            <FieldDescription>{sliderValue[0]}% off for orders over $500</FieldDescription>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FieldSet>
            <FieldLegend>Notifications</FieldLegend>
            <div className="flex flex-col gap-3">
              {[
                { id: "notif-email", label: "Email summaries" },
                { id: "notif-sms", label: "SMS alerts" },
                { id: "notif-push", label: "Push notifications", defaultChecked: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox id={item.id} defaultChecked={item.defaultChecked} />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </div>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Billing Cycle</FieldLegend>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              {[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "annual", label: "Annual — save 20%" },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-2">
                  <RadioGroupItem value={item.value} id={`radio-${item.value}`} />
                  <Label htmlFor={`radio-${item.value}`}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Security</FieldLegend>
            <div className="flex flex-col gap-4">
              {[
                { id: "sw-2fa", label: "Two-factor auth", defaultChecked: true },
                { id: "sw-api", label: "API access" },
                { id: "sw-audit", label: "Audit logging", defaultChecked: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <Label htmlFor={item.id} className="font-normal normal-case tracking-normal text-sm">{item.label}</Label>
                  <Switch id={item.id} defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </div>
          </FieldSet>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email-err">Email Address</FieldLabel>
            <Input id="email-err" type="email" defaultValue="grace@" aria-invalid="true" />
            <FieldError>Please enter a valid email address.</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="amount-err">Invoice Amount</FieldLabel>
            <Input id="amount-err" defaultValue="-50" aria-invalid="true" />
            <FieldError>Amount must be greater than zero.</FieldError>
          </Field>
        </div>
      </Section>

      {/* ── FEEDBACK & STATUS ─────────────────────────────────── */}
      <Section title="Feedback & Status">
        <Sub label="Badges">
          <Badge>Active</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="destructive">Overdue</Badge>
          <Badge variant="outline">New</Badge>
          <Badge variant="ghost">Archived</Badge>
          <Badge variant="link">View report →</Badge>
        </Sub>

        <Sub label="Alerts" wrap={false}>
          <div className="flex flex-col gap-3">
            <Alert>
              <IconInfoCircle />
              <AlertTitle>Scheduled maintenance</AlertTitle>
              <AlertDescription>
                The platform will be unavailable on Sunday, June 8 from 2:00–4:00 AM UTC for routine infrastructure maintenance.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <IconAlertCircle />
              <AlertTitle>Payment method declined</AlertTitle>
              <AlertDescription>
                Your card ending in 4242 was declined. Please update your billing details to avoid service interruption.
              </AlertDescription>
              <AlertAction>
                <Button size="xs" variant="outline">Update billing</Button>
              </AlertAction>
            </Alert>
          </div>
        </Sub>

        <Sub label="Progress" wrap={false}>
          <div className="flex flex-col gap-4 max-w-sm">
            {[
              { label: "Storage used", value: 68 },
              { label: "Onboarding complete", value: 60 },
              { label: "API quota", value: 92 },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </div>
        </Sub>

        <Sub label="Spinner">
          <Spinner className="size-3" />
          <Spinner className="size-4" />
          <Spinner className="size-5" />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
        </Sub>

        <Sub label="Skeleton" wrap={false}>
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </Sub>

        <Sub label="Sonner toast">
          <Button variant="outline" onClick={() => toast.success("Invoice sent", { description: "INV-1042 was emailed to billing@acme.com." })}>
            Success toast
          </Button>
          <Button variant="outline" onClick={() => toast.error("Payment failed", { description: "Card ending in 4242 was declined." })}>
            Error toast
          </Button>
          <Button variant="outline" onClick={() => toast.info("Sync in progress", { description: "Importing 1,204 records from Salesforce." })}>
            Info toast
          </Button>
          <Button variant="outline" onClick={() => toast.warning("Trial expiring soon", { description: "Acme Corp's trial ends in 3 days." })}>
            Warning toast
          </Button>
        </Sub>
      </Section>

      {/* ── DATA DISPLAY ──────────────────────────────────────── */}
      <Section title="Data Display">
        <Sub label="Table" wrap={false}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CUSTOMERS.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{row.name}</span>
                      <span className="text-xs text-muted-foreground">{row.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.plan}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{row.mrr}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon-xs" variant="ghost"><IconEye /></Button>
                      <Button size="icon-xs" variant="ghost"><IconEdit /></Button>
                      <Button size="icon-xs" variant="ghost"><IconTrash /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>{CUSTOMERS.length} customers</TableCell>
                <TableCell>$7,448</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </Sub>

        <Sub label="Cards" wrap={false}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>All active subscriptions this month</CardDescription>
                <CardAction><Badge>+12%</Badge></CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">$48,290</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">vs. $43,120 last month</p>
              </CardFooter>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Logged in within the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">1,847</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">124 new this week</p>
              </CardFooter>
            </Card>
          </div>
        </Sub>

        <Sub label="Avatar">
          <div className="flex items-end gap-3">
            <Avatar size="sm"><AvatarFallback>SC</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
            <Avatar size="lg"><AvatarFallback>MK</AvatarFallback></Avatar>
          </div>
          <div className="flex items-center gap-3">
            <Avatar><AvatarFallback>GH</AvatarFallback><AvatarBadge /></Avatar>
            <Avatar size="lg"><AvatarFallback>AL</AvatarFallback><AvatarBadge /></Avatar>
          </div>
          <AvatarGroup>
            {["TK", "SR", "BP"].map((i) => (
              <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>
            ))}
            <AvatarGroupCount>+8</AvatarGroupCount>
          </AvatarGroup>
        </Sub>

        <Sub label="Item list" wrap={false}>
          <ItemGroup className="max-w-md">
            {TEAM.map((person, i) => (
              <React.Fragment key={person.name}>
                {i > 0 && <ItemSeparator />}
                <Item variant="outline">
                  <ItemMedia>
                    <Avatar><AvatarFallback>{person.initials}</AvatarFallback></Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{person.name}</ItemTitle>
                    <ItemDescription>{person.role}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="icon-xs" variant="ghost"><IconEdit /></Button>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </Sub>
      </Section>

      {/* ── NAVIGATION ────────────────────────────────────────── */}
      <Section title="Navigation">
        <Sub label="Breadcrumb" wrap={false}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Customers</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Acme Corp</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Sub>

        <Sub label="Tabs — default" wrap={false}>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <p className="text-sm text-muted-foreground">14 active subscriptions · $2,400 MRR · last login 2 hours ago.</p>
            </TabsContent>
            <TabsContent value="invoices" className="mt-4">
              <p className="text-sm text-muted-foreground">3 open invoices totaling $6,240. Next due date: June 15.</p>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <p className="text-sm text-muted-foreground">Last activity: Grace Hopper updated billing address on May 28.</p>
            </TabsContent>
          </Tabs>
        </Sub>

        <Sub label="Tabs — line variant" wrap={false}>
          <Tabs defaultValue="monthly">
            <TabsList variant="line">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="mt-4">
              <p className="text-sm text-muted-foreground">$12,040 revenue this week, up 8% from last week.</p>
            </TabsContent>
            <TabsContent value="monthly" className="mt-4">
              <p className="text-sm text-muted-foreground">$48,290 revenue this month, up 12% from last month.</p>
            </TabsContent>
            <TabsContent value="quarterly" className="mt-4">
              <p className="text-sm text-muted-foreground">$138,770 revenue this quarter, on track for a record high.</p>
            </TabsContent>
            <TabsContent value="annual" className="mt-4">
              <p className="text-sm text-muted-foreground">$520,100 revenue year-to-date, 94% of annual target.</p>
            </TabsContent>
          </Tabs>
        </Sub>

        <Sub label="Accordion" wrap={false}>
          <Accordion type="single" collapsible className="max-w-lg" defaultValue="billing">
            <AccordionItem value="billing">
              <AccordionTrigger>How does billing work?</AccordionTrigger>
              <AccordionContent>
                You are billed monthly based on active seats. Charges occur on the same calendar day each month. You can
                upgrade, downgrade, or cancel at any time from your account settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancel">
              <AccordionTrigger>Can I cancel at any time?</AccordionTrigger>
              <AccordionContent>
                Yes. Cancel anytime from your account settings. Access continues until the end of the current billing
                period with no prorated refunds.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="trial">
              <AccordionTrigger>Is there a free trial?</AccordionTrigger>
              <AccordionContent>
                All new accounts include a 14-day free trial with full feature access. No credit card required to start.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Sub>

        <Sub label="Pagination" wrap={false}>
          <Pagination className="justify-start">
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationLink href="#">14</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </Sub>
      </Section>

      {/* ── OVERLAYS ──────────────────────────────────────────── */}
      <Section title="Overlays">
        <Sub label="Dialog, AlertDialog, Tooltip, HoverCard, Popover">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation link to a new team member. They will receive an email with instructions to join your workspace.
                </DialogDescription>
              </DialogHeader>
              <Field>
                <FieldLabel htmlFor="inv-email">Email Address</FieldLabel>
                <Input id="inv-email" type="email" placeholder="colleague@company.com" />
              </Field>
              <Field>
                <FieldLabel htmlFor="inv-role">Role</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full" id="inv-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <DialogFooter showCloseButton>
                <Button>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Customer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia><IconTrash /></AlertDialogMedia>
                <AlertDialogTitle>Delete Acme Corp?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all data for Acme Corp including invoices, contacts, and activity history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon"><IconSettings /></Button>
              </TooltipTrigger>
              <TooltipContent>
                Account settings <Kbd>⌘,</Kbd>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@grace_hopper</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex gap-3">
                <Avatar size="lg"><AvatarFallback>GH</AvatarFallback></Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Grace Hopper</p>
                  <p className="text-xs text-muted-foreground">Engineering Lead · Acme Corp</p>
                  <p className="mt-1 text-xs text-muted-foreground">Member since March 2023 · 48 invoices</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline"><IconFilter data-icon="inline-start" />Filters</Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>Filter Customers</PopoverTitle>
                <PopoverDescription>Narrow results by status, plan, or date range.</PopoverDescription>
              </PopoverHeader>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">Clear</Button>
                <Button size="sm">Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
        </Sub>
      </Section>

      {/* ── LAYOUT & UTILITIES ────────────────────────────────── */}
      <Section title="Layout & Utilities">
        <Sub label="Separator" wrap={false}>
          <div className="flex flex-col gap-4">
            <Separator />
            <div className="flex h-5 items-center gap-4 text-sm">
              <span>Dashboard</span>
              <Separator orientation="vertical" />
              <span>Customers</span>
              <Separator orientation="vertical" />
              <span>Reports</span>
              <Separator orientation="vertical" />
              <span>Settings</span>
            </div>
          </div>
        </Sub>

        <Sub label="Keyboard shortcuts">
          <span className="flex items-center gap-2 text-sm">Search <Kbd>⌘K</Kbd></span>
          <span className="flex items-center gap-2 text-sm">New invoice <KbdGroup><Kbd>⌘</Kbd><Kbd>N</Kbd></KbdGroup></span>
          <span className="flex items-center gap-2 text-sm">Settings <Kbd>⌘,</Kbd></span>
          <span className="flex items-center gap-2 text-sm">Undo <KbdGroup><Kbd>⌘</Kbd><Kbd>Z</Kbd></KbdGroup></span>
        </Sub>

        <Sub label="Scroll area" wrap={false}>
          <ScrollArea className="h-40 w-full max-w-xs border border-border p-4">
            <div className="flex flex-col gap-3">
              {INVOICES.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs">{inv.id}</span>
                  <span className="text-muted-foreground">{inv.amount}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Sub>

        <Sub label="Collapsible" wrap={false}>
          <Collapsible className="max-w-sm">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Advanced Settings
                <IconChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 flex flex-col gap-3 border border-border p-4">
                {[
                  { id: "col-rate", label: "Rate limiting", defaultChecked: true },
                  { id: "col-ip", label: "IP allowlist" },
                  { id: "col-audit", label: "Audit logging", defaultChecked: true },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <Switch id={item.id} defaultChecked={item.defaultChecked} size="sm" />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Sub>

        <Sub label="Empty state" wrap={false}>
          <div className="max-w-md border border-border">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon"><IconFileInvoice /></EmptyMedia>
                <EmptyTitle>No invoices found</EmptyTitle>
                <EmptyDescription>
                  No invoices matched your current filters. Try adjusting your date range or clearing the status filter.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline"><IconRefresh data-icon="inline-start" />Clear filters</Button>
                <Button><IconPlus data-icon="inline-start" />Create invoice</Button>
              </EmptyContent>
            </Empty>
          </div>
        </Sub>
      </Section>
    </div>
  )
}
