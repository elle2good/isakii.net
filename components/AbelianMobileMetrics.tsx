"use client"

import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import Image from "next/image"

export default function AbelianMobileMetrics({ children, className, label }: { children: ReactNode; className: string; label: string }) {
  const slides = Children.toArray(children)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const track = ref.current
    if (!track) return
    const update = () => {
      if (track.clientWidth) setActive(Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))))
    }
    const observer = new ResizeObserver(update)
    observer.observe(track)
    track.addEventListener("scroll", update, { passive: true })
    return () => { observer.disconnect(); track.removeEventListener("scroll", update) }
  }, [slides.length])

  const navigate = (index: number) => {
    const track = ref.current
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion ? "instant" : "smooth" })
  }

  return (
    <div className={`${className} abelian-metric-carousel`} role="group" aria-label={label}>
      <section ref={ref} className="abelian-metric-track" aria-label={`${label} slides`} tabIndex={0} data-lenis-prevent onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault()
          navigate(Math.max(0, Math.min(slides.length - 1, active + (event.key === "ArrowRight" ? 1 : -1))))
        }
      }}>
      {slides.map((slide, index) => isValidElement<{ className?: string }>(slide) ? cloneElement(slide, { className: `abelian-metric-slide ${index === active ? "is-current" : ""}` }) : slide)}
      </section>
      {active > 0 && <button type="button" className="abelian-metric-arrow is-previous" aria-label={`Previous ${label.toLowerCase()} metric`} onClick={() => navigate(active - 1)}><Image src="/case-studies/abelian/arrow-right.png" alt="" width={24} height={24} /></button>}
      {active < slides.length - 1 && <button type="button" className="abelian-metric-arrow is-next" aria-label={`Next ${label.toLowerCase()} metric`} onClick={() => navigate(active + 1)}><Image src="/case-studies/abelian/arrow-right.png" alt="" width={24} height={24} /></button>}
      <nav className="abelian-metric-controls" aria-label={`${label} controls`}>
        {slides.map((_, index) => <button key={index} type="button" aria-label={`Show metric ${index + 1}`} aria-pressed={index === active} onClick={() => navigate(index)} />)}
      </nav>
    </div>
  )
}
