import type { Metadata } from "next"
import HomeExperience from "@/components/HomeExperience"
import { getCatalogueItems } from "@/lib/catalogue"

const socialTitle = "Isakii | Turn Interest into Trust"
const socialDescription = "Attract the right leads and turn them into customers, advocates, partners—and more."

export const metadata: Metadata = {
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    siteName: "isakii",
    url: "https://isakii.net/",
    images: [{ url: "/isakii-preview-logo.png", width: 1080, height: 1080, alt: "isakii logo" }],
  },
  twitter: {
    title: socialTitle,
    description: socialDescription,
    card: "summary",
    images: [{ url: "/isakii-preview-logo.png", alt: "isakii logo" }],
  },
}

export default async function Home({ searchParams }: {
  searchParams: Promise<{ preview?: string | string[]; cardTest?: string | string[] }>
}) {
  const catalogueItems = await getCatalogueItems()
  const { preview, cardTest } = await searchParams
  const initialPreviewSlug = typeof preview === "string" ? preview : undefined
  // Local review only. Production assignment needs a connected experiment first.
  const directNavigation = process.env.NODE_ENV === "development" && cardTest === "direct"
  return <HomeExperience catalogueItems={catalogueItems} initialPreviewSlug={initialPreviewSlug} directNavigation={directNavigation} />
}
