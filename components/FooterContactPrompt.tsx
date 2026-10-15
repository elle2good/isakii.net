"use client"

import { useEffect, useRef, useState } from "react"
import { claimContactPrompt, releaseContactPrompt } from "@/lib/contactPrompt"
import { ContactInterstitial } from "./CataloguePreview"

const BOTTOM_REACHED = "isakii:footer-contact:bottom-reached-this-visit"
const RETURN_FROM_ABOUT = "isakii:footer-contact:return-from-about"
const RETURN_FROM_CASE_STUDY = "isakii:footer-contact:return-from-case-study"
function read(storage: Storage, key: string) { try { return storage.getItem(key) } catch { return null } }
function write(storage: Storage, key: string, value: string) { try { storage.setItem(key, value) } catch { /* The current page still works when storage is unavailable. */ } }

export default function FooterContactPrompt({ blocked }: { blocked: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const shown = useRef(false)
  const bottomReached = useRef(false)
  const [open, setOpen] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [dontShow, setDontShow] = useState(false)

  useEffect(() => {
    let returningFromAbout = false
    let returningFromCaseStudy = false
    // Keep eligibility across overlays and route changes during the same visit.
    try {
      returningFromCaseStudy = read(sessionStorage, RETURN_FROM_CASE_STUDY) === "true"
      returningFromAbout = read(sessionStorage, RETURN_FROM_ABOUT) === "true"
      if (read(sessionStorage, BOTTOM_REACHED) === "true") bottomReached.current = true
    } catch { /* Retain the in-memory state when storage is unavailable. */ }
    const scroll = () => {
      if (blocked || shown.current) return
      const y = window.scrollY
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 32
      if (atBottom) {
        bottomReached.current = true
        try { write(sessionStorage, BOTTOM_REACHED, "true") } catch {}
        if (!returningFromAbout && !returningFromCaseStudy) return
      }
      if (!bottomReached.current && !returningFromCaseStudy) return
      // Returning past the marquee’s lower edge marks the top of the content.
      const marquee = document.querySelector(".home-notification-slot")
      if (!returningFromAbout && !returningFromCaseStudy && (!marquee || marquee.getBoundingClientRect().bottom < 0)) return
      const claim = claimContactPrompt()
      if (!claim) return
      setRepeat(claim.repeat)
      try {
        write(sessionStorage, RETURN_FROM_ABOUT, "false")
        write(sessionStorage, RETURN_FROM_CASE_STUDY, "false")
      } catch {}
      shown.current = true
      setOpen(true)
    }
    window.addEventListener("scroll", scroll, { passive: true })
    scroll()
    return () => window.removeEventListener("scroll", scroll)
  }, [blocked])

  useEffect(() => {
    if (!open) return
    const element = dialog.current
    const overflow = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    element?.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      releaseContactPrompt()
      element?.close()
      document.body.style.overflow = overflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [open])

  const close = () => {
    releaseContactPrompt(dontShow)
    setOpen(false)
  }

  return <dialog ref={dialog} className="footer-contact-dialog" aria-labelledby="footer-contact-title" data-lenis-prevent onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close() } }}>
    {open && <>
      <button autoFocus className="catalogue-preview-close" aria-label="Close contact invitation" onClick={close}>×</button>
      <ContactInterstitial titleId="footer-contact-title">
        {repeat && <label className="footer-contact-opt-out"><input type="checkbox" checked={dontShow} onChange={event => setDontShow(event.target.checked)}/><span>Don’t show me this message again</span></label>}
      </ContactInterstitial>
    </>}
  </dialog>
}
