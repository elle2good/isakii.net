export type CatalogueItem = {
  id: string
  order: number
  contentType: string
  title: string
  subtitle: string
  slug: string
  date: string
  type: string
  companyName: string
  shortSummary: string
  tldr: string
  ctaLabel: string
  caseStudyUrl: string
  downloadUrl: string
  popupImage: string
  coverImage: string
  popupImageAlt: string
  coverImageAlt: string
}

type BaserowRow = Record<string, unknown> & { id?: number }

const READY_ITEM: CatalogueItem = {
  id: "9cd62da9-5ef0-4357-a610-6983c766160e",
  order: 0,
  contentType: "Case Study Report",
  title: "Bootstrapping a Global Community from a Very Niche Technology",
  subtitle: "Social Media & Community Bootstrapping",
  slug: "Abelian-community",
  date: "2023–2024",
  type: "Flagship",
  companyName: "Abelian Foundation",
  shortSummary:
    "By bootstrapping a quantum-resistant blockchain community, this company turned early promise into real revenue. Read the full case study to see how.",
  tldr:
    "The company needed to transform its niche, mining-focused community into broader awareness and adoption for its quantum-resistant blockchain ahead of its token launch. I developed accessible technical content, gamified engagement programs, streamlined community management, and led a multilingual ambassador network. This strategy grew seven community channels sixfold, converted approximately 25% of community members into users, supported a successful token launch and three product launches, and helped generate roughly 15,000 wallet addresses; contributing to Abelian’s transition from pre-revenue to revenue-generating.",
  ctaLabel: "Read the full case study",
  caseStudyUrl: "/work/abelian-community",
  downloadUrl: "",
  popupImage:
    "https://res.cloudinary.com/dwto97ayq/image/upload/v1788861377/Abelian_Pop_up_image_np3crf.png",
  coverImage:
    "https://res.cloudinary.com/dwto97ayq/image/upload/v1788792753/exec-0b9c3f0e-fbc5-49d0-bdf1-345e573b404d_vyqedd.png",
  popupImageAlt: "Abelian wallet interface case study preview",
  coverImageAlt: "Printed Abelian Foundation case study cover",
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "")
const number = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(text(value))
  return Number.isFinite(parsed) ? parsed : 0
}
const truthy = (value: unknown) => value === true || value === 1 || text(value).toLowerCase() === "true"

function selectValue(value: unknown) {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "value" in value) {
    return text((value as { value?: unknown }).value)
  }
  return ""
}

function linkedIds(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || !("id" in entry)) return []
    const id = Number((entry as { id?: unknown }).id)
    return Number.isFinite(id) ? [id] : []
  })
}

function mapCatalogueRows(itemRows: BaserowRow[], mediaRows: BaserowRow[]): CatalogueItem[] {
  const mediaByItem = new Map<number, BaserowRow[]>()

  for (const media of mediaRows) {
    for (const itemId of linkedIds(media.Catalogue_Items)) {
      const records = mediaByItem.get(itemId) ?? []
      records.push(media)
      mediaByItem.set(itemId, records)
    }
  }

  return itemRows
    .filter((row) => truthy(row.Active) && text(row.Content_Title))
    .map((row) => {
      const slug = text(row.Slug)
      const media = mediaByItem.get(row.id ?? -1) ?? []
      const byType = (type: string) =>
        media.find((record) => truthy(record.Active) && selectValue(record["Media Type"]).toLowerCase() === type)
        ?? media.find((record) => selectValue(record["Media Type"]).toLowerCase() === type)
      const popup = byType("pop up image")
      const cover = byType("cover")
      const first = popup ?? cover ?? media.find((record) => truthy(record.Active)) ?? media[0]
      const popupImage = text(popup?.["Asset URL"] ?? first?.["Asset URL"])
      const coverImage = text(cover?.["Asset URL"] ?? popupImage)

      return {
        id: text(row.project_pk) || String(row.id),
        order: number(row.Order),
        contentType: text(row.Content_Type),
        title: text(row.Content_Title),
        subtitle: text(row.Subtitle),
        slug,
        date: text(row.Date),
        type: selectValue(row.Type),
        companyName: text(row.Company_Name),
        shortSummary: text(row.Short_Summary),
        tldr: text(row.TLDR),
        ctaLabel: text(row.CTA_Label) || "Read the full case study",
        caseStudyUrl:
          text(row["Case Study URL"])
          || (slug.toLowerCase() === "abelian-community" ? "/work/abelian-community" : ""),
        downloadUrl: text(row["Download URL"]),
        popupImage,
        coverImage,
        popupImageAlt: text(popup?.["Alt text"]) || `${text(row.Content_Title)} preview`,
        coverImageAlt: text(cover?.["Alt text"]) || `${text(row.Subtitle) || text(row.Content_Title)} cover`,
      }
    })
    .sort((a, b) => a.order - b.order)
}

async function fetchTable(tableId: string, token: string) {
  const response = await fetch(
    `https://api.baserow.io/api/database/rows/table/${tableId}/?user_field_names=true&size=200`,
    {
      headers: { Authorization: `Token ${token}` },
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) throw new Error(`Baserow table ${tableId} returned ${response.status}`)
  const payload = (await response.json()) as { results?: BaserowRow[] }
  return Array.isArray(payload.results) ? payload.results : []
}

export async function getCatalogueItems(): Promise<CatalogueItem[]> {
  const token = process.env.BASEROW_DATABASE_TOKEN
  const itemsTable = process.env.BASEROW_CATALOGUE_ITEMS_TABLE_ID ?? "1172105"
  const mediaTable = process.env.BASEROW_CATALOGUE_MEDIA_TABLE_ID ?? "1183573"

  if (!token) return [READY_ITEM]

  try {
    const [itemRows, mediaRows] = await Promise.all([
      fetchTable(itemsTable, token),
      fetchTable(mediaTable, token),
    ])
    const items = mapCatalogueRows(itemRows, mediaRows)
    return items.length ? items : [READY_ITEM]
  } catch (error) {
    console.error("Unable to load the Baserow catalogue; using the checked-in preview.", error)
    return [READY_ITEM]
  }
}
