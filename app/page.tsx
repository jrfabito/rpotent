import { PageHeader } from "@/components/custom/page-header"
import { PortfolioView } from "@/components/custom/portfolio-view"
import portfolioData from "@/data/portfolio_data.json"

export default function Page() {
  return (
    <>
      <PageHeader
        siteName="Meridian AI Deployments"
        breadcrumbs={[
          { label: "Portfolio Overview", href: "/" }
        ]}
      />
      <main className="mx-auto max-w-[1440px] px-4 pt-28 pb-12 sm:px-6">
        <PortfolioView data={portfolioData} />
      </main>
    </>
  )
}
