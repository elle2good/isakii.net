"use client"

import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useReducedMotion } from "motion/react"

/** Keeps the original desktop grid; enables native touch scrolling on mobile. */
export default function MobileSwipeCarousel({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  const slides = Children.toArray(children)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const track = ref.current
    if (!track) return
    const update = () => {
      const index = track.clientWidth ? Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth))) : 0
      setActive(index)
      const slide = track.children[index] as HTMLElement | undefined
      if (slide) track.style.setProperty("--slide-height", `${slide.offsetHeight}px`)
    }
    const observer = new ResizeObserver(update)
    observer.observe(track)
    Array.from(track.children).forEach(slide => observer.observe(slide))
    track.addEventListener("scroll", update, { passive: true })
    update()
    return () => { observer.disconnect(); track.removeEventListener("scroll", update) }
  }, [slides.length])
  const navigate = (index: number) => {
    const track = ref.current
    if (track) track.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, index)) * track.clientWidth, behavior: reducedMotion ? "instant" : "smooth" })
  }
  return <div className="mobile-swipe" role="group" aria-label={label}>
    <div ref={ref} className={`${className} mobile-swipe-track`} tabIndex={0} data-lenis-prevent onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault()
        navigate(active + (event.key === "ArrowRight" ? 1 : -1))
      }
    }}>
      {slides.map(slide => isValidElement<{ className?: string }>(slide) ? cloneElement(slide, { className: `${slide.props.className || ""} mobile-swipe-slide` }) : slide)}
    </div>
    <nav className="mobile-swipe-controls" aria-label={`${label} navigation`}>
      <button type="button" aria-label={`Previous ${label}`} disabled={active === 0} onClick={() => navigate(active - 1)}><Image className="is-previous" src="/case-studies/abelian/arrow-right.png" alt="" width={24} height={24} /></button>
      <div className="mobile-swipe-dots">{slides.map((_, index) => <button key={index} type="button" aria-label={`${label}: show slide ${index + 1}`} aria-pressed={index === active} onClick={() => navigate(index)} />)}</div>
      <button type="button" aria-label={`Next ${label}`} disabled={active === slides.length - 1} onClick={() => navigate(active + 1)}><Image src="/case-studies/abelian/arrow-right.png" alt="" width={24} height={24} /></button>
    </nav>
  </div>
}
