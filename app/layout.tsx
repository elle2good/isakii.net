import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "isakii",
  description: "Lisa Kim — writer, artist, and GTM specialist.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
