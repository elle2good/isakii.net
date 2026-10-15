import type { Metadata } from "next"
import HomeExperience from "@/components/HomeExperience"
import { getCatalogueItems } from "@/lib/catalogue"

const socialTitle = "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics"

export const metadata: Metadata = {
  openGraph: {
    title: socialTitle,
    siteName: "isakii",
    url: "https://isakii.net/",
    images: [{ url: "/isakii-preview-logo.png", width: 1080, height: 1080, alt: "isakii logo" }],
  },
  twitter: {
    title: socialTitle,
    card: "summary",
    images: [{ url: "/isakii-preview-logo.png", alt: "isakii logo" }],
  },
}

export default async function Home({ searchParams }: {
  searchParams: Promise<{ preview?: string | string[] }>
}) {
  const catalogueItems = await getCatalogueItems()
  const { preview } = await searchParams
  const initialPreviewSlug = typeof preview === "string" ? preview : undefined
  return <HomeExperience catalogueItems={catalogueItems} initialPreviewSlug={initialPreviewSlug} />
}
