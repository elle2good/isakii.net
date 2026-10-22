import type { PostHog } from "posthog-js"

export const CARD_EXPERIMENT = "homepage-card-preview-v1"
export const EXPOSURE_KEY = "isakii.experiment.card-preview-v1"
export type CardVariant = "control" | "direct"
export type Exposure = { variant: CardVariant; at: number; id: string; engaged?: boolean }
const DAY = 24 * 60 * 60 * 1000
let client: Promise<PostHog | null> | undefined

export function foregroundDelta(previous: number, now: number, visible: boolean, focused: boolean) {
  return visible && focused ? Math.max(0, Math.min(now - previous, 1500)) : 0
}

export function validExposure(value: unknown, id: string, now = Date.now()): value is Exposure {
  if (!value || typeof value !== "object") return false
  const record = value as Exposure
  return record.id === id && (record.variant === "control" || record.variant === "direct") &&
    Number.isFinite(record.at) && now >= record.at && now - record.at < DAY
}

export function analyticsAllowed() {
  if (typeof window === "undefined") return false
  try {
    return ["isakii.net", "www.isakii.net"].includes(window.location.hostname) &&
      window.location.pathname !== "/analytics-preferences" &&
      !new URLSearchParams(window.location.search).has("cardTest") &&
      !new URLSearchParams(window.location.search).has("preview") &&
      localStorage.getItem("isakii.analytics.optOut") !== "1" &&
      navigator.doNotTrack !== "1"
  } catch { return false }
}

export function getExperimentClient(): Promise<PostHog | null> {
  if (!analyticsAllowed()) return Promise.resolve(null)
  if (!client) client = import("posthog-js").then(({ default: posthog }) => {
    if (!analyticsAllowed()) return null
    posthog.init("phc_rcZ3icBPbbWRobopV32YfMTRRHTWzUNKneUeEtvZ6Xb2", {
      // Public, write-only project token; this is not a personal API key.
      api_host: "https://us.i.posthog.com",
      ui_host: "https://us.posthog.com",
      persistence: "localStorage",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_performance: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_dead_clicks: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_external_dependency_loading: true,
      save_referrer: false,
      respect_dnt: true,
      property_denylist: ["$referrer", "$initial_referrer", "$initial_current_url", "$initial_pathname"],
      before_send: event => {
        if (!event || !analyticsAllowed()) return null
        if (!["$pageview", "catalogue_exposure", "preview_open", "case_study_arrival", "engaged_case_study", "contact_click", "external_press_click", "grwm_visit", "consultation_form_started", "consultation_signup_success"].includes(event.event)) return null
        // Only send explicit measurements; never send form names or email addresses.
        const allowed = new Set(["distinct_id", "token", "$lib", "$lib_version", "$device_type", "$browser",
          "$browser_version", "$os", "$os_version", "$session_id", "$window_id", "$process_person_profile",
          "$is_identified", "$geoip_disable", "experiment", "variant", "environment", "slug", "kind", "host",
          "foreground_seconds", "signup_page", `$feature/${CARD_EXPERIMENT}`])
        event.properties = Object.fromEntries(Object.entries(event.properties).filter(([key]) => allowed.has(key)))
        event.properties.$current_url = window.location.origin + window.location.pathname
        event.properties.$pathname = window.location.pathname
        return event
      },
    })
    const syncPreference = () => {
      try {
        if (localStorage.getItem("isakii.analytics.optOut") === "1") {
          posthog.opt_out_capturing()
          localStorage.removeItem(EXPOSURE_KEY)
        } else if (posthog.has_opted_out_capturing()) {
          posthog.opt_in_capturing({ captureEventName: false })
        }
      } catch { posthog.opt_out_capturing() }
    }
    syncPreference()
    window.addEventListener("isakii:analytics-preference", syncPreference)
    window.addEventListener("storage", syncPreference)
    return posthog
  }).catch(() => null)
  return client
}

export function readExposure(sdk: PostHog): Exposure | null {
  if (!analyticsAllowed()) return null
  try {
    const value: unknown = JSON.parse(localStorage.getItem(EXPOSURE_KEY) || "null")
    return validExposure(value, sdk.get_distinct_id()) ? value : null
  } catch { return null }
}

function send(sdk: PostHog, event: string, record: Exposure, extra: Record<string, string | number> = {}) {
  if (!analyticsAllowed()) return
  sdk.capture(event, { experiment: CARD_EXPERIMENT, variant: record.variant,
    [`$feature/${CARD_EXPERIMENT}`]: record.variant, environment: "production", ...extra })
}

export function exposeCards(sdk: PostHog, variant: CardVariant) {
  if (!analyticsAllowed()) return
  try {
    // First exposure fixes the attribution window. Do not reset it on return visits.
    const existing = localStorage.getItem(EXPOSURE_KEY)
    if (existing) {
      const prior = JSON.parse(existing) as Exposure
      if (prior.id === sdk.get_distinct_id()) return
    }
    const record: Exposure = { variant, at: Date.now(), id: sdk.get_distinct_id() }
    localStorage.setItem(EXPOSURE_KEY, JSON.stringify(record))
    send(sdk, "catalogue_exposure", record)
  } catch { /* Storage unavailable: do not enroll an untrackable visitor. */ }
}

export async function trackCardEvent(event: string, extra: Record<string, string | number> = {}) {
  const sdk = await getExperimentClient()
  if (!sdk) return
  const record = readExposure(sdk)
  if (record) send(sdk, event, record, extra)
}

// Consultation tracking is independent of catalogue experiment enrollment.
export async function trackConsultationEvent(event: "grwm_visit" | "consultation_form_started" | "consultation_signup_success", page: string) {
  try {
    const sdk = await getExperimentClient()
    if (!sdk || !analyticsAllowed()) return
    sdk.capture(event, { environment: "production", signup_page: page })
  } catch { /* Analytics must never interrupt a successful signup. */ }
}

export function recordEngagement(sdk: PostHog, slug: string) {
  const record = readExposure(sdk)
  if (!record || record.engaged) return
  try {
    localStorage.setItem(EXPOSURE_KEY, JSON.stringify({ ...record, engaged: true }))
    send(sdk, "engaged_case_study", record, { slug, foreground_seconds: 30 })
  } catch { /* Respect unavailable storage. */ }
}
