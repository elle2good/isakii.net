// Shared by every contact-card entry point. Session means the current browser tab.
const SESSION_COUNT = "isakii:contact:session-impressions"
const LIFETIME_COUNT = "isakii:footer-contact:impressions"
const DISMISSED = "isakii:footer-contact:dismissed"
let fallbackCount = 0
let optedOut = false
let active = false

export function claimContactPrompt(): { repeat: boolean } | null {
  if (active || optedOut) return null
  let count = fallbackCount
  let lifetime = 0
  try {
    if (localStorage.getItem(DISMISSED) === "true") return null
    count = Math.max(count, Number(sessionStorage.getItem(SESSION_COUNT)) || 0)
    lifetime = Number(localStorage.getItem(LIFETIME_COUNT)) || 0
  } catch { /* Use the in-memory limit if storage is unavailable. */ }
  if (count >= 2) return null
  fallbackCount = count + 1
  active = true
  try {
    sessionStorage.setItem(SESSION_COUNT, String(count + 1))
    localStorage.setItem(LIFETIME_COUNT, String(lifetime + 1))
  } catch {}
  return { repeat: count > 0 || lifetime > 0 }
}

export function releaseContactPrompt(dontShow = false) {
  active = false
  if (dontShow) {
    optedOut = true
    try { localStorage.setItem(DISMISSED, "true") } catch {}
  }
}
