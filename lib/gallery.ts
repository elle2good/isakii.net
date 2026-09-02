import galleryImageRecords from "@/data/gallery-images.json"

export type GalleryImage = {
  id: string
  image: string
  order: number
  alt: string
}

const isSupportedImageSource = (source: string) =>
  source.startsWith("/") || /^https:\/\//i.test(source)

const validateGalleryImages = (records: GalleryImage[]) => {
  const ids = new Set<string>()
  const orders = new Set<number>()

  for (const record of records) {
    if (!record.id.trim()) throw new Error("Gallery image records require a non-empty id.")
    if (ids.has(record.id)) throw new Error(`Duplicate gallery image id: ${record.id}`)
    if (!Number.isInteger(record.order) || record.order < 1) {
      throw new Error(`Gallery image ${record.id} requires a positive whole-number order.`)
    }
    if (orders.has(record.order)) throw new Error(`Duplicate gallery image order: ${record.order}`)
    if (!isSupportedImageSource(record.image)) {
      throw new Error(`Gallery image ${record.id} must use a local /path or an https image link.`)
    }
    if (!record.alt.trim()) throw new Error(`Gallery image ${record.id} requires alt text.`)

    ids.add(record.id)
    orders.add(record.order)
  }

  return [...records].sort((first, second) => first.order - second.order)
}

export const galleryImages = validateGalleryImages(galleryImageRecords)
