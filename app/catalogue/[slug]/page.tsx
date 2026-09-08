import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AbelianCaseStudy from "@/components/AbelianCaseStudy"
import { getCatalogueItems } from "@/lib/catalogue"

type CataloguePageProps = {
  params: Promise<{ slug: string }>
}

async function getCatalogueItem(slug: string) {
  const items = await getCatalogueItems()
  return items.find((item) => item.slug.toLowerCase() === slug.toLowerCase())
}

export async function generateMetadata({ params }: CataloguePageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getCatalogueItem(slug)

  if (!item) return {}

  return {
    title: `${item.companyName} case study | isakii`,
    description: item.tldr || item.shortSummary,
  }
}

export default async function CatalogueCaseStudyPage({ params }: CataloguePageProps) {
  const { slug } = await params
  const item = await getCatalogueItem(slug)

  if (!item) notFound()

  if (item.slug.toLowerCase() === "abelian-community") {
    return <AbelianCaseStudy />
  }

  notFound()
}
