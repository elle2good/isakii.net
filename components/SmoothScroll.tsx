"use client"

import Lenis from "lenis"
import { useEffect, useRef } from "react"

type SmoothScrollProps = {
  intensity?: number
}

export default function SmoothScroll({ intensity = 10 }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: intensity / 10 })
    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })

    let animationFrame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      animationFrame = requestAnimationFrame(raf)
    }

    animationFrame = requestAnimationFrame(raf)

    const overlay = document.getElementById("overlay")
    let observer: MutationObserver | null = null

    if (overlay) {
      observer = new MutationObserver(() => {
        if (overlay.children.length === 0) {
          lenis.start()
          return
        }

        const overflow = window.getComputedStyle(document.documentElement).overflow
        if (overflow === "hidden") {
          lenis.stop()
        } else {
          lenis.start()
        }
      })
      observer.observe(overlay, { childList: true })
    }

    return () => {
      observer?.disconnect()
      cancelAnimationFrame(animationFrame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [intensity])

  return (
    <style>{`
      html.lenis { height: auto; }
      .lenis.lenis-smooth { scroll-behavior: auto !important; }
      .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
      .lenis.lenis-stopped { overflow: hidden; }
      .lenis.lenis-scrolling iframe { pointer-events: none; }
    `}</style>
  )
}
