import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import AlgorandCaseStudy from "@/components/AlgorandCaseStudy"
import AlgorandGame from "@/components/AlgorandGame"
import AbelianCaseStudy from "@/components/AbelianCaseStudy"
import VipEventCaseStudy from "@/components/VipEventCaseStudy"
import RaydiumCaseStudy from "@/components/RaydiumCaseStudy"
import { getCatalogueItems } from "@/lib/catalogue"

type CataloguePageProps = {
  params: Promise<{ slug: string }>
}

async function getCatalogueItem(slug: string) {
  const items = await getCatalogueItems()
  if (slug.toLowerCase() === "algorand-staking-korea-campaign") {
    return items.find((item) => item.id === "b6a7f66e-bea3-41b3-b053-115ebfe9abbd")
  }
  return items.find((item) => item.slug.toLowerCase() === slug.toLowerCase())
}

export async function generateMetadata({ params }: CataloguePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params
  const item = await getCatalogueItem(slug)

  if (!item) return {}

  const heroImages: Record<string, string> = {
    "raydium-event": "raydium",
    "raydium-event-activation": "raydium",
    "algorand-korea-community": "algorand",
    "abelian-community": "abelian",
    "cancelled-futures-dinner": "futures-dinner",
  }
  const heroImage = heroImages[slug.toLowerCase()]
  const previewImage = heroImage ? {
    url: `/social/${heroImage}-hero.jpg`,
    width: 1200,
    height: 800,
    alt: `${item.title} — hero section`,
  } : undefined
  const inherited = await parent
  const title = `${item.companyName} case study | isakii`
  const description = item.shortSummary.replace(/\s+/g, " ").trim()

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "isakii",
      images: previewImage ? [previewImage] : inherited.openGraph?.images ?? [],
    },
    twitter: {
      card: previewImage ? "summary_large_image" : "summary",
      title,
      description,
      images: previewImage ? [previewImage] : inherited.twitter?.images ?? [],
    },
  }
}

export default async function CatalogueCaseStudyPage({ params }: CataloguePageProps) {
  const { slug } = await params
  const item = await getCatalogueItem(slug)

  if (!item) notFound()

  if (item.id === "395c43bd-2c7b-4c19-9057-d71761c92363") return <VipEventCaseStudy />

  if (item.slug.toLowerCase() === "abelian-community") {
    return <AbelianCaseStudy />
  }

  if (["raydium-event-activation", "raydium-event"].includes(item.slug.toLowerCase())) {
    return <RaydiumCaseStudy />
  }

  if (item.id === "b6a7f66e-bea3-41b3-b053-115ebfe9abbd") {
    return slug.toLowerCase() === "algorand-staking-korea-campaign" ? <AlgorandGame /> : <AlgorandCaseStudy />
  }

  notFound()
}
