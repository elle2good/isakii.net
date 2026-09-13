"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { MotionProps } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import type { CatalogueItem } from "@/lib/catalogue"

type CataloguePreviewProps = {
  item: CatalogueItem | null
  items: CatalogueItem[]
  onClose: () => void
  onSelect: (item: CatalogueItem) => void
}

const contentMotion: MotionProps = {
  initial: { opacity: 0, y: 42 },
  animate: { opacity: [0, 0, 1, 1], y: [42, 42, 0, 0] },
  transition: {
    opacity: { duration: 2, times: [0, 0.14, 0.525, 1], ease: ["linear", "easeOut", "linear"] },
    y: { duration: 2, times: [0, 0.14, 0.525, 1], ease: ["linear", "easeOut", "linear"] },
  },
}

function cloudinaryVideoSource(source: string) {
  if (!source.includes("/video/upload/")) return source
  const transformed = source.includes("/video/upload/f_webm")
    ? source
    : source.replace("/video/upload/", "/video/upload/f_webm,vc_vp9,q_auto/")
  return transformed.replace(/\.(?:mov|mp4|m4v)(?=$|[?#])/i, ".webm")
}

function PreviewMedia({ item }: { item: CatalogueItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ended, setEnded] = useState(false)
  const slug = item.slug.toLowerCase()
  const isKeytalkVideo = slug === "keytalk-movie-deep-search"
  const source =
    slug === "beauty-ai-search-engine"
      ? "/media/glamai-popup-alpha.webm"
      : slug === "keytalk-movie-deep-search"
        ? "/media/deepsearch-popup-alpha.webm"
      : item.popupImage || item.coverImage

  useEffect(() => {
    if (item.popupMediaKind !== "video") return
    const video = videoRef.current
    if (!video) return

    setEnded(false)
    video.currentTime = 0
    void video.play().catch(() => undefined)
  }, [item.id, item.popupMediaKind])

  const replay = () => {
    const video = videoRef.current
    if (!video) return
    setEnded(false)
    video.pause()
    video.currentTime = 0
    video.load()

    const playFromStart = () => {
      video.removeEventListener("canplay", playFromStart)
      void video.play().catch(() => undefined)
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playFromStart()
    } else {
      video.addEventListener("canplay", playFromStart, { once: true })
    }
  }

  if (!source) {
    return (
      <div className="catalogue-preview-placeholder" role="img" aria-label={item.popupImageAlt}>
        <span>Coming soon</span>
      </div>
    )
  }

  if (item.popupMediaKind === "video") {
    return (
      <div className="catalogue-preview-video-wrap">
        <video
          ref={videoRef}
          className={slug === "keytalk-movie-deep-search" ? "catalogue-preview-video--keytalk" : undefined}
          src={cloudinaryVideoSource(source)}
          aria-label={item.popupImageAlt}
          muted
          playsInline
          autoPlay
          loop={isKeytalkVideo}
          preload="auto"
          onEnded={() => {
            if (!isKeytalkVideo) setEnded(true)
          }}
        />
        <AnimatePresence>
          {ended && (
            <motion.div
              className="catalogue-preview-replay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <button type="button" onClick={replay} aria-label={`Play ${item.title} preview again`}>
                <span aria-hidden="true">▶</span>
                <span>Play again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // CMS image hosts vary, so the browser renders this validated HTTPS URL directly.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={source} alt={item.popupImageAlt} />
}

function NewsletterInterstitial() {
  const [email, setEmail] = useState("")
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setSubmissionState("error")
      setStatusMessage("Enter your email address.")
      return
    }

    setSubmissionState("loading")
    setStatusMessage("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      const result = (await response.json()) as { error?: string; message?: string }

      if (!response.ok) throw new Error(result.error || "Unable to subscribe.")

      setSubmissionState("success")
      setStatusMessage(result.message || "You're subscribed.")
      setEmail("")
    } catch (error) {
      setSubmissionState("error")
      setStatusMessage(error instanceof Error ? error.message : "Unable to subscribe.")
    }
  }

  return (
    <div className="catalogue-newsletter">
      <div className="catalogue-newsletter-image">
        <Image
          src="/home/newsletter-preview-portrait.jpg"
          alt="Portrait of Lisa Kim"
          fill
          sizes="(max-width: 760px) calc(100vw - 68px), 470px"
        />
      </div>
      <div className="catalogue-newsletter-content">
        <p className="catalogue-newsletter-eyebrow">Newsletter Sign-Up</p>
        <div className="catalogue-newsletter-copy">
          <h2 id="catalogue-newsletter-title">Was this helpful?</h2>
          <p>Get new case studies and insight reports as soon as they&apos;re published.</p>
        </div>
        <form className="catalogue-newsletter-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="catalogue-newsletter-email">Email address</label>
          <input
            id="catalogue-newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Address"
            disabled={submissionState === "loading"}
            required
          />
          <button type="submit" disabled={submissionState === "loading"}>
            {submissionState === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {statusMessage && (
          <p className={`catalogue-newsletter-status is-${submissionState}`} role="status" aria-live="polite">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  )
}

export default function CataloguePreview({ item, items, onClose, onSelect }: CataloguePreviewProps) {
  const [expanded, setExpanded] = useState(false)
  const [showingNewsletter, setShowingNewsletter] = useState(false)
  const [mobileNoticeItemId, setMobileNoticeItemId] = useState<string | null>(null)
  const navigationClickCountRef = useRef(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const itemIndex = item ? items.findIndex((candidate) => candidate.id === item.id) : -1
  const previous = itemIndex > 0 ? items[itemIndex - 1] : null
  const next = itemIndex >= 0 && itemIndex < items.length - 1 ? items[itemIndex + 1] : null

  useEffect(() => {
    previewRef.current?.scrollTo({ top: 0 })
  }, [item?.id, showingNewsletter])

  useEffect(() => {
    if (!item) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [item])

  useEffect(() => {
    if (!item) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false)
        setShowingNewsletter(false)
        navigationClickCountRef.current = 0
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [item, onClose])

  const animatedProps: MotionProps = reduceMotion
    ? { initial: false }
    : contentMotion

  const closePreview = () => {
    setMobileNoticeItemId(null)
    setExpanded(false)
    setShowingNewsletter(false)
    navigationClickCountRef.current = 0
    onClose()
  }

  const selectItem = (nextItem: CatalogueItem) => {
    setMobileNoticeItemId(null)
    navigationClickCountRef.current += 1
    setExpanded(false)

    if (navigationClickCountRef.current % 4 === 0) {
      setShowingNewsletter(true)
      return
    }

    setShowingNewsletter(false)
    onSelect(nextItem)
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="catalogue-preview-scrim"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePreview()
          }}
        >
          <motion.section
            ref={previewRef}
            className={`catalogue-preview ${expanded ? "is-expanded" : ""} ${showingNewsletter ? "is-newsletter" : ""} ${mobileNoticeItemId === item.id ? "has-mobile-notice" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={showingNewsletter ? "catalogue-newsletter-title" : "catalogue-preview-title"}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: 20 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <button ref={closeRef} type="button" className="catalogue-preview-close" onClick={closePreview} aria-label="Close project preview">
              ×
            </button>

            <div className="catalogue-preview-pagination" aria-label="Browse catalogue items">
              {previous && (
                <button
                  type="button"
                  className="catalogue-preview-arrow is-previous"
                  aria-label={`Previous project: ${previous.title}`}
                  onClick={() => selectItem(previous)}
                >
                  <span aria-hidden="true">←</span>
                </button>
              )}
              {next && (
                <button
                  type="button"
                  className="catalogue-preview-arrow is-next"
                  aria-label={`Next project: ${next.title}`}
                  onClick={() => selectItem(next)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>

            {showingNewsletter ? (
              <NewsletterInterstitial />
            ) : (
              <>
                <div className="catalogue-preview-media">
                  <PreviewMedia key={item.id} item={item} />
                </div>

                <div className="catalogue-preview-content">
              <div className="catalogue-preview-copy" key={item.id}>
                <p className="catalogue-preview-eyebrow">{item.contentType}</p>
                <motion.p className="catalogue-preview-year" {...animatedProps}>{item.date}</motion.p>
                <motion.h2 id="catalogue-preview-title" {...animatedProps}>{item.title}</motion.h2>
                <motion.div className="catalogue-preview-meta" {...animatedProps}>
                  <span className="catalogue-preview-company">{item.companyName}</span>
                  {item.tags.length > 0 && (
                    <div className="catalogue-preview-tags" aria-label="Project tags">
                      {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  )}
                </motion.div>
                {item.shortSummary && (
                  <motion.p className="catalogue-preview-summary" {...animatedProps}>{item.shortSummary}</motion.p>
                )}
              </div>

              {item.tldr && (
                <motion.div className={`catalogue-preview-accordion ${expanded ? "is-expanded" : ""}`} layout={!reduceMotion}>
                <button
                  type="button"
                  className="catalogue-preview-accordion-trigger"
                  aria-expanded={expanded}
                  aria-controls="catalogue-preview-tldr"
                  onClick={() => setExpanded((value) => !value)}
                >
                  <span>TLDR</span>
                  <span className="catalogue-preview-chevron" aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id="catalogue-preview-tldr"
                      className="catalogue-preview-tldr"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <p>{item.tldr}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                </motion.div>
              )}

              <div className="catalogue-preview-actions">
                {item.caseStudyUrl ? (
                  <a
                    className="catalogue-preview-cta"
                    href={item.caseStudyUrl}
                    onClick={(event) => {
                      if (
                        window.matchMedia("(max-width: 700px)").matches &&
                        item.type.toLowerCase() === "flagship" &&
                        !item.ctaLabel.toLowerCase().includes("coming soon")
                      ) {
                        event.preventDefault()
                        previewRef.current?.scrollTo({ top: 0, behavior: "instant" })
                        setMobileNoticeItemId(item.id)
                      }
                    }}
                  >
                    <span>{item.ctaLabel}</span><span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="catalogue-preview-cta is-disabled" aria-disabled="true">
                    <span>{item.ctaLabel}</span>
                  </span>
                )}

                  </div>
                </div>
              </>
            )}
            {mobileNoticeItemId === item.id && (
              <div className="catalogue-mobile-notice">
                <button type="button" className="catalogue-mobile-notice-close" onClick={() => setMobileNoticeItemId(null)} aria-label="Dismiss mobile notice">×</button>
                <p role="status">A better mobile experience for isakii.net is on its way. For now, explore case study report on desktop</p>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
