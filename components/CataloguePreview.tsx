"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { MotionProps } from "motion/react"
import { useEffect, useRef, useState } from "react"
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
  const isKeytalkVideo = item.slug.toLowerCase() === "keytalk-movie-deep-search"
  const source =
    item.slug.toLowerCase() === "beauty-ai-search-engine"
      ? "/media/glamai-popup-alpha.webm"
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

  if (item.popupMediaKind === "video") {
    return (
      <div className="catalogue-preview-video-wrap">
        <video
          ref={videoRef}
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

export default function CataloguePreview({ item, items, onClose, onSelect }: CataloguePreviewProps) {
  const [expanded, setExpanded] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  const index = item ? items.findIndex((candidate) => candidate.id === item.id) : -1
  const previous = index > 0 ? items[index - 1] : null
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : null

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
    setExpanded(false)
    onClose()
  }

  const selectItem = (nextItem: CatalogueItem) => {
    setExpanded(false)
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
            className={`catalogue-preview ${expanded ? "is-expanded" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalogue-preview-title"
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
                <motion.p className="catalogue-preview-summary" {...animatedProps}>{item.shortSummary}</motion.p>
              </div>

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

              <div className="catalogue-preview-actions">
                {item.caseStudyUrl ? (
                  <a className="catalogue-preview-cta" href={item.caseStudyUrl}>
                    <span>{item.ctaLabel}</span><span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="catalogue-preview-cta is-disabled" aria-disabled="true">
                    <span>{item.ctaLabel}</span><span aria-hidden="true">↗</span>
                  </span>
                )}

              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
