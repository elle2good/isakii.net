import { applyApprovedMetadata } from "@/lib/pageMetadata"
import type { Metadata } from "next"
import AnalyticsPreferences from "@/components/AnalyticsPreferences"

export const metadata: Metadata = applyApprovedMetadata("/analytics-preferences", {
  title: "Analytics preferences | isakii",
  robots: { index: false, follow: false },
})

export default function Page() {
  return <AnalyticsPreferences />
}
