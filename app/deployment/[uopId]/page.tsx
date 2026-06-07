import { notFound } from "next/navigation"
import { PageHeader } from "@/components/custom/page-header"
import { DeploymentDetail } from "@/components/custom/deployment-detail"
import portfolioData from "@/data/portfolio_data.json"

export function generateStaticParams() {
  return portfolioData.map((d) => ({ uopId: d.uopId }))
}

interface Props {
  params: Promise<{ uopId: string }>
}

export default async function DeploymentPage({ params }: Props) {
  const { uopId } = await params
  const item = portfolioData.find((d) => d.uopId === uopId)

  if (!item) notFound()

  return (
    <>
      <PageHeader
        siteName="Meridian AI Deployments"
        breadcrumbs={[
          { label: "Portfolio Overview", href: "/" },
          { label: item.name },
        ]}
      />
      <main className="mx-auto max-w-[1440px] px-4 pt-28 pb-12 sm:px-6">
        <DeploymentDetail item={item} />
      </main>
    </>
  )
}
