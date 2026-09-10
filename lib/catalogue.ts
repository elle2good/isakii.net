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
  tags: string[]
  shortSummary: string
  tldr: string
  ctaLabel: string
  caseStudyUrl: string
  downloadUrl: string
  popupImage: string
  coverImage: string
  popupMediaKind: "image" | "video"
  coverMediaKind: "image" | "video"
  popupImageAlt: string
  coverImageAlt: string
}

type BaserowRow = Record<string, unknown> & { id?: number }

const READY_ITEM: CatalogueItem = {
  id: "9cd62da9-5ef0-4357-a610-6983c766160e",
  order: 0,
  contentType: "Case Study Report",
  title: "Bootstrapping a Global Community from a Very Niche Technology",
  subtitle: "From Pre-Revenue to Revenue",
  slug: "Abelian-community",
  date: "2023–2024",
  type: "Flagship",
  companyName: "Abelian Foundation",
  tags: ["Social Media", "Community", "Content Strategy"],
  shortSummary:
    "By bootstrapping a quantum-resistant blockchain community, this company turned early promise into real revenue.\n\nRead the full case study to see how.",
  tldr:
    "The company needed to transform its niche, mining-focused community into broader awareness and adoption for its quantum-resistant blockchain ahead of its token launch. I developed accessible technical content, gamified engagement programs, streamlined community management, and led a multilingual ambassador network. This strategy grew seven community channels sixfold, converted approximately 25% of community members into users, supported a successful token launch and three product launches, and helped generate roughly 15,000 wallet addresses; contributing to Abelian’s transition from pre-revenue to revenue-generating.",
  ctaLabel: "Read the full case study",
  caseStudyUrl: "/catalogue/Abelian-community",
  downloadUrl: "",
  popupImage:
    "https://res.cloudinary.com/dwto97ayq/image/upload/v1788861377/Abelian_Pop_up_image_np3crf.png",
  coverImage:
    "https://res.cloudinary.com/dwto97ayq/image/upload/v1788879284/Untitled_design_ehnbxj.png",
  popupMediaKind: "image",
  coverMediaKind: "image",
  popupImageAlt: "Abelian wallet interface case study preview",
  coverImageAlt: "Printed Abelian Foundation case study cover",
}

const READY_RAYDIUM_ITEM: CatalogueItem = {
  id: "21bc99d4-bde5-4ad3-8d9d-3dcaf17e464b",
  order: 1,
  contentType: "Case Study Report",
  title: "One Event, Half the Cost, Triple the Reach",
  subtitle: "Trendy Event Activation",
  slug: "Raydium-event",
  date: "2025",
  type: "Flagship",
  companyName: "Raydium",
  tags: ["Event Planning", "Event Management"],
  shortSummary:
    "An anonymous DeFi protocol hosted its first offline event in Asia targeting 3 different guest groups.\n\nRead the full case study to find out how.",
  tldr:
    "The design and delivery of Raydium’s first offline activation in Asia, combining brand research, multifunctional venue design, partnerships, and grassroots outreach. The event served three core guest groups: retail users, developers and Solana ecosystem stakeholders. Outcomes included strong post-event resonance at 40% below the industry-standard cost per attendee.",
  ctaLabel: "Read the full case study",
  caseStudyUrl: "/catalogue/Raydium-event",
  downloadUrl: "",
  popupImage:
    "https://res.cloudinary.com/dwto97ayq/image/upload/v1788922358/Frame_6_no9gqh.png",
  coverImage:
    "https://res.cloudinary.com/dwto97ayq/video/upload/v1788917700/frame-8-animated-book-alpha_orq53j.mov",
  popupMediaKind: "image",
  coverMediaKind: "video",
  popupImageAlt: "Raydium Event Activation case study preview",
  coverImageAlt: "Raydium Event Activation cover",
}

const READY_GLAMAI_ITEM: CatalogueItem = {
  id: "b08d5bc9-282a-4cf3-ac31-dd685aba4065",
  order: 2,
  contentType: "Press Release",
  title: "The AI Before AI",
  subtitle: "LVMH Innovation Award Finalist",
  slug: "beauty-ai-search-engine",
  date: "2019–2022",
  type: "Basic",
  companyName: "Keytalk AI (Mycelebs)",
  tags: ["Product Ops", "Data Ops"],
  shortSummary:
    "The idea for Mycelebs emerged during a meeting in which CJ Corporation’s then–Chief Digital Officer watched executives debate which celebrity would be the best fit to promote a new product. Struck by how heavily the decision relied on personal judgment, he envisioned using social media data and AI to bring a more objective, score-based approach to subjective questions. He founded Mycelebs to bring that vision to life.\n\nGlamai became one of the direct-to-consumer apps built on Mycelebs’ AI search technology.",
  tldr:
    "Glamai is an AI-powered beauty discovery app that helps influencers find products tailored to different needs and preferences. The South Korean startup technology processes information from brands, retailers, and social media into over 19,000 searchable “keytalks”, context-based keywords, to support more personalized, inclusive beauty recommendations.",
  ctaLabel: "Read the press release",
  caseStudyUrl:
    "https://www.prweb.com/releases/a-new-beauty-discovery-app-helps-influencers-match-their-cosmetics-and-skin-care-needs-with-the-latest-trends-824812240.html",
  downloadUrl: "",
  popupImage:
    "https://res.cloudinary.com/dwto97ayq/video/upload/v1789019316/right_glamai-floating-phone-right-alpha_y9a6jz.mov",
  coverImage:
    "https://res.cloudinary.com/dwto97ayq/video/upload/v1789019123/glamai-floating-phone-alpha_bwlo55.mov",
  popupMediaKind: "video",
  coverMediaKind: "video",
  popupImageAlt: "Floating Glamai phone preview",
  coverImageAlt: "Floating Glamai phone cover",
}

const READY_ITEMS = [READY_ITEM, READY_RAYDIUM_ITEM, READY_GLAMAI_ITEM]

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "")
const contentText = (value: unknown) => text(value).replace(/\s*(?:\/n|\\n)\s*/gi, "\n")
const shortSummaryText = (value: unknown) =>
  contentText(value)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n")
const number = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(text(value))
  return Number.isFinite(parsed) ? parsed : 0
}
const truthy = (value: unknown) => value === true || value === 1 || text(value).toLowerCase() === "true"

const tagsValue = (value: unknown) => {
  const values = Array.isArray(value)
    ? value.map((entry) => selectValue(entry))
    : text(value).split(",")

  return values.map((tag) => tag.trim()).filter(Boolean)
}

const mediaKind = (url: string): "image" | "video" =>
  /\/video\/upload\//i.test(url) || /\.(?:mp4|mov|m4v|webm|ogv)(?:$|[?#])/i.test(url) ? "video" : "image"

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
      const itemType = selectValue(row.Type)
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
        type: itemType,
        companyName: text(row.Company_Name),
        tags: tagsValue(row.Tags),
        shortSummary: shortSummaryText(row.Short_Summary),
        tldr: contentText(row.TLDR),
        ctaLabel: text(row.CTA_Label) || "Read the full case study",
        caseStudyUrl:
          itemType.toLowerCase() === "flagship" && slug
            ? `/catalogue/${encodeURIComponent(slug)}`
            : text(row["Case Study URL"]),
        downloadUrl: text(row["Download URL"]),
        popupImage,
        coverImage,
        popupMediaKind: mediaKind(popupImage),
        coverMediaKind: mediaKind(coverImage),
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

  if (!token) return READY_ITEMS

  try {
    const [itemRows, mediaRows] = await Promise.all([
      fetchTable(itemsTable, token),
      fetchTable(mediaTable, token),
    ])
    const items = mapCatalogueRows(itemRows, mediaRows)
    return items.length ? items : READY_ITEMS
  } catch (error) {
    console.error("Unable to load the Baserow catalogue; using the checked-in preview.", error)
    return READY_ITEMS
  }
}
