"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analyticsAllowed, foregroundDelta, getExperimentClient, readExposure, recordEngagement, trackCardEvent } from "@/lib/cardExperiment"

export default function ExperimentAnalytics() {
  const pathname = usePathname()
  useEffect(() => {
    let cancelled = false
    // Track initial loads and Next.js route changes once, independent of experiment enrollment.
    // Automatic SDK pageviews stay disabled to avoid double-counting.
    void getExperimentClient().then(sdk => {
      if (!sdk || cancelled || !analyticsAllowed()) return
      sdk.capture("$pageview", { environment: "production" })
      if (pathname === "/grwm") sdk.capture("grwm_visit", { environment: "production", signup_page: pathname })
    })
    return () => { cancelled = true }
  }, [pathname])

  useEffect(() => {
    if (!pathname.startsWith("/catalogue/")) return
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | undefined
    const slug = pathname.split("/").filter(Boolean).at(-1) || ""
    void getExperimentClient().then(sdk => {
      if (!sdk || cancelled) return
      const exposure = readExposure(sdk)
      if (!exposure) return
      void trackCardEvent("case_study_arrival", { slug })
      let elapsed = 0
      const progressKey = `isakii.reading.${exposure.at}.${slug}`
      try { elapsed = Number(sessionStorage.getItem(progressKey)) || 0 } catch { return }
      let previous = performance.now()
      timer = setInterval(() => {
        const now = performance.now()
        const delta = foregroundDelta(previous, now, document.visibilityState === "visible", document.hasFocus())
        previous = now
        if (document.visibilityState !== "visible" || !document.hasFocus() || !readExposure(sdk)) return
        elapsed += delta
        try { sessionStorage.setItem(progressKey, String(elapsed)) } catch { return }
        if (elapsed >= 30_000) {
          recordEngagement(sdk, slug)
          clearInterval(timer)
        }
      }, 1000)
    })
    return () => { cancelled = true; clearInterval(timer) }
  }, [pathname])

  useEffect(() => {
    function click(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.protocol === "mailto:") void trackCardEvent("contact_click", { kind: "email" })
      else if (anchor.hostname === "calendar.app.google") void trackCardEvent("contact_click", { kind: "booking" })
      else if (anchor.closest(".home-project-card, .catalogue-preview-actions") &&
        anchor.origin !== window.location.origin && anchor.protocol === "https:") {
        void trackCardEvent("external_press_click", { host: anchor.hostname })
      }
    }
    document.addEventListener("click", click)
    return () => document.removeEventListener("click", click)
  }, [])
  return null
}
