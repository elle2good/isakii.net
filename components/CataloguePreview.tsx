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

            <div className="catalogue-preview-media">
              {/* CMS image hosts vary, so the browser renders this validated HTTPS URL directly. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.popupImage || item.coverImage} alt={item.imageAlt} />
            </div>

            <div className="catalogue-preview-content">
              <div className="catalogue-preview-copy" key={item.id}>
                <p className="catalogue-preview-eyebrow">{item.contentType}</p>
                <motion.h2 id="catalogue-preview-title" {...animatedProps}>{item.title}</motion.h2>
                <motion.div className="catalogue-preview-meta" {...animatedProps}>
                  <span>{item.date}</span>
                  <span aria-hidden="true" />
                  <span>{item.companyName}</span>
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

                <div className="catalogue-preview-pagination" aria-label="Browse catalogue items">
                  {previous && (
                    <button type="button" onClick={() => selectItem(previous)}>
                      <span aria-hidden="true">←</span><span>Previous</span>
                    </button>
                  )}
                  {(next || item.order === 0) && (
                    <button type="button" disabled={!next} onClick={() => next && selectItem(next)}>
                      <span>{item.order === 0 ? "Next Project" : "Next"}</span><span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
