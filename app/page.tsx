import HomeExperience from "@/components/HomeExperience"
import { getCatalogueItems } from "@/lib/catalogue"

export default async function Home({ searchParams }: {
  searchParams: Promise<{ preview?: string | string[] }>
}) {
  const catalogueItems = await getCatalogueItems()
  const { preview } = await searchParams
  const initialPreviewSlug = typeof preview === "string" ? preview : undefined
  return <HomeExperience catalogueItems={catalogueItems} initialPreviewSlug={initialPreviewSlug} />
}
