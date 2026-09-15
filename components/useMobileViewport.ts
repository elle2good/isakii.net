"use client"

import { useSyncExternalStore } from "react"

const query = "(max-width: 700px)"
const subscribe = (listener: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener("change", listener)
  return () => media.removeEventListener("change", listener)
}
export default function useMobileViewport() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
