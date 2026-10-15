"use client"

import { Analytics, type BeforeSend } from "@vercel/analytics/next"

// Read on every event so opting out also covers client-side navigation.
const beforeSend: BeforeSend = event => {
  if (window.location.pathname === "/analytics-preferences") return null
  try {
    if (localStorage.getItem("isakii.analytics.optOut") === "1") return null
  } catch {
    // Do not send if the browser prevents us from checking its preference.
    return null
  }
  return event
}

export default function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />
}
