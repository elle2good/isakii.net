import { applyApprovedMetadata } from "@/lib/pageMetadata"
import type { Metadata } from "next"
import HomeExperience from "@/components/HomeExperience"
import { getCatalogueItems } from "@/lib/catalogue"

const title = "Take your relationships to the next level in 2027."
const description = "Sign up for a free consultation session with Lisa Kim."
const image = { url: "/consultation/grwm-preview.png", width: 381, height: 280, alt: "Get Ready for 2027 with me" }

export const metadata: Metadata = applyApprovedMetadata("/grwm", {
  title,
  description,
  alternates: { canonical: "https://isakii.net/grwm" },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "isakii",
    url: "https://isakii.net/grwm",
    images: [image],
  },
  twitter: { card: "summary_large_image", title, description, images: [image] },
})

export default async function GrwmPage() {
  const catalogueItems = await getCatalogueItems()
  return <HomeExperience catalogueItems={catalogueItems} initialSection="grwm" />
}
