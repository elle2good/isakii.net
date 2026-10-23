import { applyApprovedMetadata } from "@/lib/pageMetadata"
import type { Metadata } from "next"
import HomeExperience from "@/components/HomeExperience"
import { getCatalogueItems } from "@/lib/catalogue"

const socialTitle = "The Human Agent for Relationships | Lisa Kim"
const socialDescription = "Helping brands find the right words, reach the right people, and build relationships that turn into measurable growth."

export const metadata: Metadata = applyApprovedMetadata("/", {
  title: "Lisa Kim | Communications & Growth Consultant",
  description: "Lisa Kim helps early-stage and midsize startups clarify their message and grow through communications, content, and events.",
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
})

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
