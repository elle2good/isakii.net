"use client"

import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

export default function AbelianMobileMetrics({ children, className, label }: { children: ReactNode; className: string; label: string }) {
  const slides = Children.toArray(children)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: 0.6 })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!visible || reducedMotion) return
    const media = window.matchMedia("(max-width: 700px)")
    const timer = window.setInterval(() => {
      if (media.matches && !document.hidden) setActive(value => (value + 1) % slides.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [visible, reducedMotion, slides.length])

  return (
    <div ref={ref} className={`${className} abelian-metric-carousel`} role="group" aria-label={label}>
      {slides.map((slide, index) => isValidElement<{ className?: string }>(slide) ? cloneElement(slide, { className: `abelian-metric-slide ${index === active ? "is-current" : ""}` }) : slide)}
      <nav className="abelian-metric-controls" aria-label={`${label} controls`}>
        {slides.map((_, index) => <button key={index} type="button" aria-label={`Show metric ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)} />)}
      </nav>
    </div>
  )
}
