import HomeExperience from "@/components/HomeExperience"
import { getCatalogueItems } from "@/lib/catalogue"

export default async function Home() {
  const catalogueItems = await getCatalogueItems()
  return <HomeExperience catalogueItems={catalogueItems} />
}
