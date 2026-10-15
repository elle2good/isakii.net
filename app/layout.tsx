import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "isakii",
  description: "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
