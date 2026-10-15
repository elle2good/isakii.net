"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import "./case-study-contact-actions.css"

function ContactLinks() {
  return <>
    <a href="https://calendar.app.google/GYAJYPauZoJfZQ4F9" target="_blank" rel="noopener noreferrer" aria-label="Book a call" title="Book a call">
      <Image src="/case-studies/shared/call.svg" alt="" width={13} height={13} aria-hidden="true" />
    </a>
    <a href="mailto:smkim@isakii.net" aria-label="Email smkim@isakii.net" title="Email Lisa">
      <span className="case-study-mail-icon" aria-hidden="true"><Image src="/case-studies/shared/mail-fold.svg" alt="" width={11.7001} height={4.69544} /></span>
    </a>
  </>
}

export default function CaseStudyContactActions({ activeSection }: { activeSection?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [floating, setFloating] = useState(false)
  useEffect(() => {
    let idle: ReturnType<typeof setTimeout> | undefined
    let clickVisibleUntil = 0
    const show = () => {
      if (window.innerWidth > 700) return
      document.body.classList.add('case-study-mobile-scrolling')
      clearTimeout(idle)
      idle = setTimeout(() => document.body.classList.remove('case-study-mobile-scrolling'), Math.max(3000, clickVisibleUntil - Date.now()))
    }
    const onScroll = () => show()
    const onClick = (event: MouseEvent) => {
      if (window.innerWidth > 700 || !(event.target instanceof Element)) return
      if (!event.target.closest('.case-study-mobile-contact-actions a, .abelian-scroll-top')) return
      clickVisibleUntil = Date.now() + 5000
      show()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
      clearTimeout(idle)
      document.body.classList.remove('case-study-mobile-scrolling')
    }
  }, [])
  useEffect(() => {
    const update = () => setFloating(window.innerWidth <= 700 && (ref.current?.closest('.abelian-subnav')?.getBoundingClientRect().top ?? 100) <= 1)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  useEffect(() => {
    const reveal = () => {
      if (window.innerWidth > 700) return
      const nav = ref.current?.closest('.abelian-subnav')?.querySelector('nav')
      const active = nav?.querySelector<HTMLElement>('[aria-current="location"]')
      if (!nav || !active) return
      const box = nav.getBoundingClientRect(), item = active.getBoundingClientRect()
      nav.scrollTo({ left: nav.scrollLeft + item.left - box.left - (box.width - item.width) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
    reveal()
    window.addEventListener('resize', reveal)
    return () => window.removeEventListener('resize', reveal)
  }, [activeSection])
  return <>
    <div ref={ref} className="case-study-contact-actions" aria-label="Contact Lisa"><ContactLinks /></div>
    {floating && createPortal(<div className="case-study-mobile-contact-actions" aria-label="Contact Lisa"><ContactLinks /></div>, document.body)}
  </>
}
