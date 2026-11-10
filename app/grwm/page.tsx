import type { Metadata } from "next"
import Link from "next/link"
import AnnouncementLayout from "@/components/AnnouncementLayout"

const title = "An update from Lisa | isakii"
const message = "I'm now committed full-time to help grow data centers in a sustainable and friendly manner with w.media. Hopefully, we can work together next time!"

export const metadata: Metadata = {
  title,
  description: message,
  alternates: { canonical: "https://isakii.net/grwm" },
  openGraph: { title, description: message, url: "https://isakii.net/grwm" },
  twitter: { title, description: message },
}

export default function GrwmPage() {
  return (
    <AnnouncementLayout>
    <main className="grwm-announcement">
      <article>
        <h1>An update from Lisa</h1>
        <p>I'm now committed full-time to help grow data centers in a sustainable and friendly manner with <a href="https://w.media">w.media</a>. Hopefully, we can work together next time!</p>
        <Link className="grwm-home-link" href="/">Go back to home page</Link>
      </article>
    </main>
    </AnnouncementLayout>
  )
}
