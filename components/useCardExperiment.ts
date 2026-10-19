"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { PostHog } from "posthog-js"
import { CARD_EXPERIMENT, exposeCards, getExperimentClient, type CardVariant } from "@/lib/cardExperiment"

export default function useCardExperiment(section: RefObject<HTMLElement | null>, excluded: boolean) {
  const [variant, setVariant] = useState<CardVariant | null>(null)
  const sdkRef = useRef<PostHog | null>(null)
  const locked = useRef(false)
  useEffect(() => {
    if (excluded) return
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    void getExperimentClient().then(sdk => {
      if (!sdk || cancelled) return
      sdkRef.current = sdk
      unsubscribe = sdk.onFeatureFlags((_flags, _variants, context) => {
        if (cancelled || locked.current || context?.errorsLoading) return
        const value = sdk.getFeatureFlag(CARD_EXPERIMENT, { send_event: false, fresh: true })
        if (value === "control" || value === "direct") {
          locked.current = true
          setVariant(value)
        }
      })
    })
    return () => { cancelled = true; unsubscribe?.() }
  }, [excluded])

  const expose = useCallback(() => {
    if (variant && sdkRef.current) exposeCards(sdkRef.current, variant)
  }, [variant])

  useEffect(() => {
    if (!variant || !section.current) return
    const observer = new IntersectionObserver(entries => {
      if (document.visibilityState !== "visible") return
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5 &&
        !entry.target.closest('[aria-hidden="true"], [inert]'))) expose()
    }, { threshold: 0.5 })
    section.current.querySelectorAll('[data-case-study="true"]').forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [variant, section, expose])

  // A click before flags load keeps the original behavior and excludes that page.
  // This prevents a popup opening and then switching the same visit to direct.
  const interact = useCallback((eligible: boolean) => { locked.current = true; if (eligible) expose() }, [expose])
  return { variant, interact }
}
