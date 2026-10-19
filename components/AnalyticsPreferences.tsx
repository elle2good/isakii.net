"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function AnalyticsPreferences() {
  const [disabled, setDisabled] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  function save(value: boolean) {
    try {
      localStorage.setItem("isakii.analytics.optOut", value ? "1" : "0")
      window.dispatchEvent(new Event("isakii:analytics-preference"))
      setDisabled(value)
      setError("")
    } catch {
      setError("Your browser could not save this preference. Please allow site storage and try again.")
    }
  }
  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      if (new URLSearchParams(window.location.search).get("disable") === "1") {
        save(true)
      } else {
        try { setDisabled(localStorage.getItem("isakii.analytics.optOut") === "1") }
        catch { setError("Your browser could not read its saved preference.") }
      }
    })
    return () => { cancelled = true }
  }, [])
  return <main style={{ maxWidth: 640, margin: "80px auto", padding: 24, color: "#fff0d2", fontFamily: "DM Sans, sans-serif", lineHeight: 1.6 }}>
    <h1>Analytics preferences</h1>
    <p role="status">{disabled === null ? "Checking your preference…" : disabled ? "Your visits in this browser are excluded from Vercel Analytics and the PostHog experiment." : "Analytics is enabled in this browser."}</p>
    <p>This setting applies to this browser on this device. Repeat on your other browsers and devices. Clearing site data removes the preference.</p>
    {error && <p role="alert">{error}</p>}
    <button onClick={() => save(disabled !== true)} style={{ padding: "12px 20px", cursor: "pointer", marginBlock: 16 }}>{disabled ? "Enable analytics" : "Exclude my visits"}</button>
    <p><Link href="/" style={{ color: "inherit", textDecoration: "underline" }}>Return to isakii.net</Link></p>
  </main>
}
