/** Keep Cloudinary as the CDN, but request display-sized, compressed assets. */
export function cloudinaryImage(source: string, width: number) {
  if (!source.startsWith("https://res.cloudinary.com/") || !source.includes("/image/upload/") || source.includes("/s--")) return source
  return source.replace("/image/upload/", `/image/upload/c_limit,w_${width},q_auto,f_auto/`)
}

export function imageDelivery(source: string, sizes: string, width = 960) {
  const src = cloudinaryImage(source, width)
  return {
    src,
    ...(src !== source ? {
      srcSet: [320, 640, 960, 1280, 1600].map(size => `${cloudinaryImage(source, size)} ${size}w`).join(", "),
      sizes,
    } : {}),
  }
}

export function cloudinaryHeroVideo(source: string, width: number) {
  if (!source.startsWith("https://res.cloudinary.com/") || !source.includes("/video/upload/")) return source
  return source.replace("/video/upload/", `/video/upload/c_limit,w_${width},q_auto,f_mp4,vc_h264/`).replace(/\.(mov|webm|mp4)(?=$|\?)/i, ".mp4")
}
