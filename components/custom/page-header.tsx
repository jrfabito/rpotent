"use client"

import React from "react"
import { IconHome } from "@tabler/icons-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface PageHeaderCrumb {
  label: string
  href?: string
}

export interface PageHeaderProps {
  siteName: string
  breadcrumbs?: PageHeaderCrumb[]
  fixed?: boolean
  className?: string
}

export function PageHeader({
  siteName,
  breadcrumbs,
  fixed = true,
  className,
}: PageHeaderProps) {
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0

  return (
    <header
      className={cn(
        "top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm",
        fixed ? "fixed" : "static",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center px-4 sm:px-6">
        <span className="text-lg font-semibold tracking-wide">{siteName}</span>
      </div>

      {hasBreadcrumbs && (
        <div className="border-t border-border/50">
          <div className="mx-auto max-w-[1440px] px-4 py-2 sm:px-6">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink
                          href={crumb.href}
                          className={cn("inline-flex items-center gap-2", i === 0 ? "font-medium" : "")}
                        >
                          {i === 0 && <IconHome className="h-4 w-4" />}
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage
                          className={cn("inline-flex items-center gap-2", i === 0 ? "font-medium" : "")}
                        >
                          {i === 0 && <IconHome className="h-4 w-4" />}
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}
    </header>
  )
}
