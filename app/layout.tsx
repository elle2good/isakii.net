import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://isakii.net"),
  title: "isakii",
  openGraph: {
    siteName: "isakii",
    images: [{ url: "/isakii-preview-logo.png", width: 1080, height: 1080, alt: "isakii logo" }],
  },
  twitter: {
    card: "summary",
    images: [{ url: "/isakii-preview-logo.png", alt: "isakii logo" }],
  },
  description: "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
