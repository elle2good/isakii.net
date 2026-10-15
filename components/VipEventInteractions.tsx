"use client"

import Image from "next/image"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"

const base = "/case-studies/vip-event/"
export function Entrance({ children, className = "", scale = 1, opacity = 0, delay = 0, duration = .5 }: { children: ReactNode; className?: string; scale?: number; opacity?: number; delay?: number; duration?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity, scale }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: "easeOut" }}>{children}</motion.div>
}

export function FloorGallery() {
  const ref = useRef<HTMLButtonElement>(null)
  const inView = useInView(ref, { amount: .3 })
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const turns = useRef(0)
  useEffect(() => {
    if (!inView || reduced || (completed && !hovered)) return
    const timer = setInterval(() => {
      setIndex(value => (value + 1) % 3)
      turns.current += 1
      if (turns.current >= 3) setCompleted(true)
    }, 1500)
    return () => clearInterval(timer)
  }, [inView, reduced, completed, hovered])
  return <button ref={ref} className="vip-hover-area vip-floor-gallery" type="button" aria-label="Venue floor plans: show next image" data-cycle-complete={completed} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)} onClick={() => setIndex(value => (value + 1) % 3)}>
    <span className="vip-floor-stage">
      <span className={`vip-floor-slide ${index === 0 ? "active" : ""}`}><Image src={base + "474-895-imgUntitledDesign31.png"} fill sizes="(max-width:700px) 85vw, 400px" alt="First-floor venue plan"/><span className="vip-floor-label">VIP</span><span className="vip-panel-label">Panel</span></span>
      <span className={`vip-floor-slide ${index === 1 ? "active" : ""}`}><Image src={base + "474-895-imgScreenshot20251201At1100571.png"} fill sizes="(max-width:700px) 85vw, 400px" alt="Second-floor venue plan"/><span className="vip-sponsor-label">Senior sponsor</span></span>
      <span className={`vip-floor-slide ${index === 2 ? "active" : ""}`}><Image src={base + "474-895-imgImage1.png"} fill sizes="(max-width:700px) 85vw, 200px" alt="Additional venue layout"/></span>
      <span className="vip-stack-cue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 16H3V3h13v2"/><rect x="7" y="7" width="14" height="14" rx="1"/><path d="m8 18 4-4 3 3 2-2 3 3"/><circle cx="16.5" cy="11.5" r="1"/></svg></span>
    </span>
  </button>
}

export function NewsletterPerformance() {
  const ref = useRef<HTMLDivElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const inView = useInView(ref, { amount: .35, once: true })
  const [ready, setReady] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const reduced = useReducedMotion()
  const play = useCallback(() => iframe.current?.contentWindow?.postMessage({ type: "vip-chart-play" }, window.location.origin), [])
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return
      if (event.data?.type === "vip-chart-ready") setReady(true)
      if (event.data?.type === "vip-chart-complete") setUnlocked(true)
    }
    window.addEventListener("message", receive)
    iframe.current?.contentWindow?.postMessage({ type: "vip-chart-check-ready" }, window.location.origin)
    return () => window.removeEventListener("message", receive)
  }, [])
  useEffect(() => { if (inView && ready) play() }, [inView, ready, play])
  useEffect(() => {
    if (!ready || unlocked) return
    let frame = 0
    const checkScrollThreshold = () => {
      frame = 0
      const chart = iframe.current
      const line = chart?.contentDocument?.getElementById("sixty-percent-line")
      if (!chart || !line) return
      const viewportTop = Math.max(0, document.querySelector(".vip-subnav")?.getBoundingClientRect().bottom ?? 0)
      // Both rectangles are live: iframe placement + SVG line position within it.
      if (chart.getBoundingClientRect().top + line.getBoundingClientRect().top <= viewportTop) {
        chart.contentWindow?.postMessage({ type: "vip-chart-finish" }, window.location.origin)
      }
    }
    const scheduleCheck = () => { if (!frame) frame = requestAnimationFrame(checkScrollThreshold) }
    checkScrollThreshold()
    window.addEventListener("scroll", scheduleCheck, { passive: true })
    window.addEventListener("resize", scheduleCheck)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleCheck)
      window.removeEventListener("resize", scheduleCheck)
    }
  }, [ready, unlocked])

  return <>
    <Entrance className="vip-chart-title" scale={1 / 1.2}><h3>Newsletter Performance</h3></Entrance>
    <div ref={ref} className="vip-chart-hover vip-hover-area" onMouseEnter={() => { if (inView && ready) play() }}>
      <iframe ref={iframe} src={base + "newsletter-chart.html?v=mobile-fit-1"} title="Newsletter open and re-open rates by region" loading="lazy" onLoad={() => setReady(true)}/>
      <button type="button" className="vip-replay-chart" aria-label="Replay newsletter chart" title="Replay chart" onClick={play}>↻</button>
    </div>
    <div className="vip-newsletter-metrics" data-unlocked={unlocked} aria-hidden={!unlocked}>
      {[["36.7%", "email open rate during the holiday season, against a 39.31% industry benchmark"], ["3%", "unsubscribe rate"], ["46.8% ↑", "increase in re-open rate\nFirst to third newsletter"]].map(([value, label]) => <div key={value}>
        <motion.strong initial={{ opacity: 0 }} animate={{ opacity: unlocked ? 1 : 0 }} transition={{ delay: reduced ? 0 : .5, duration: reduced ? 0 : .5, ease: "easeOut" }}>{value}</motion.strong>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: unlocked ? 1 : 0 }} transition={{ duration: reduced ? 0 : .5, ease: "easeOut" }}>{label}</motion.p>
      </div>)}
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: unlocked ? 1 : 0 }} transition={{ duration: reduced ? 0 : .5 }} inert={!unlocked}><NewsletterEmailForm /></motion.div>
  </>
}

function NewsletterEmailForm() {
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || success) return
    setSubmitting(true); setError("")
    try {
      const response = await fetch("/api/futures-newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: value.trim() }) })
      const data = await response.json()
      if (!response.ok || !data.registered) throw new Error(data.error || "We couldn’t request the newsletter series. Please try again.")
      setSuccess(true)
    } catch (error) { setError(error instanceof Error ? error.message : "Please try again.") }
    finally { setSubmitting(false) }
  }
  return <div className="vip-email" data-state={success ? "success" : value ? "enter" : focused ? "start" : "default"}>
    {success ? <p role="status">The newsletter series has been sent to your email! If you don&apos;t see it, check your Promotions or Spam folder</p> : <form onSubmit={submit}><label className="sr-only" htmlFor="vip-email">Email address</label><input id="vip-email" type="email" required disabled={submitting} aria-describedby={error ? "vip-email-error" : undefined} value={value} onChange={event => setValue(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={focused ? "" : "Enter your email address to receive the newsletter series"}/><button type="submit" disabled={submitting} aria-label="Request newsletter series">{submitting ? "…" : "↵"}</button></form>}
    {error && <p id="vip-email-error" role="alert">{error}</p>}
  </div>
}

const lessons = [
  ["Companies’ marketing budgets are regularly exhausted by Q4 and event confirmations should precede at least 2 months ahead.", "Choose opportunities that allow enough time to prepare, manage risk, and build in a buffer."],
  ["After an educational second newsletter, open rates rose across every region.", "People make time for useful knowledge. Education can be great marketing content."],
  ["I still question whether the outcome would have been different had it been the bull market.", "Market sentiment matters just as much as business goals."],
  ["As the event fell apart, some speakers offered to take their sessions online to help salvage it.", "Choose partners who show up even when things go wrong. They make all the difference."],
]
export function LessonCards() {
  const [active, setActive] = useState<Set<number>>(() => new Set())
  return <motion.div className="raydium-partnership-cards vip-lesson-cards" onViewportLeave={() => setActive(new Set())}>{lessons.map(([front, back], index) => <button key={front} type="button" className={active.has(index) ? "is-active" : ""} aria-pressed={active.has(index)} aria-label={`Lesson ${index + 1}: ${active.has(index) ? back : front}`} onClick={() => setActive(current => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next })}>
    <span className="raydium-card-flipper">{[front, back].map((copy, side) => <span key={side} className={`raydium-card-face raydium-card-${side ? "back" : "front"}`} aria-hidden={active.has(index) !== Boolean(side)}><Image className="raydium-card-swap" src={base + `482-742-imgSwap${side ? 4 : 3}.svg`} width={23.1869} height={22.6245} alt=""/><span className="raydium-card-copy">{copy}</span></span>)}</span>
  </button>)}</motion.div>
}

function StackCue() {
  return <span className="vip-stack-cue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 16H3V3h13v2"/><rect x="7" y="7" width="14" height="14" rx="1"/><path d="m8 18 4-4 3 3 2-2 3 3"/><circle cx="16.5" cy="11.5" r="1"/></svg></span>
}

export function PlanningHoverCard({ kind, children }: { kind: "deck" | "profiles"; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const [page, setPage] = useState(0)
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { amount: .15 })
  useEffect(() => {
    if (!hovered || !visible || reduced) return
    const timer = setInterval(() => setPage(value => (value + 1) % (kind === "deck" ? 13 : 2)), kind === "deck" ? 1800 : 1600)
    return () => clearInterval(timer)
  }, [hovered, visible, reduced, kind])
  const enter = () => { setHovered(true); if (kind === "profiles") setPage(value => (value + 1) % 2) }
  return <article ref={ref} className={`vip-planning-hover vip-planning-${kind}`} onMouseEnter={enter} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false) }}>
    <span className="vip-group-hitbox" aria-hidden="true"/>{children}
    {kind === "deck" ? <Entrance scale={1.2} opacity={1} className="vip-deck"><button type="button" className="vip-deck-pages" aria-label="Turn sponsorship presentation page" onClick={() => setPage(value => (value + 1) % 13)} data-page={page + 1}>
      <Image src={base + `slide-${(page + 1) % 13 + 1}.png`} fill sizes="(max-width:700px) 85vw, 480px" alt="Next presentation page"/>
      <motion.span key={page} className="vip-deck-page" initial={reduced ? false : { rotateY: -90, opacity: .4 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : .55, ease: "easeOut" }}><Image src={base + `slide-${page + 1}.png`} fill sizes="(max-width:700px) 85vw, 480px" alt={`Sponsorship presentation, page ${page + 1} of 13`}/></motion.span><StackCue/>
    </button></Entrance> : <button type="button" className={`vip-profiles vip-profile-gallery ${page % 2 ? "is-swapped" : ""}`} aria-label="Swap attendee profile images" onClick={() => setPage(value => (value + 1) % 2)}>
      {["474-895-imgChatGptImageOct142026025643Pm1.png", "474-895-imgChatGptImageOct142026025910Pm1.png"].map((file, index) => <span key={file} className={`vip-profile-sheet vip-profile-${index}`}><Image src={base + file} fill sizes="(max-width:700px) 75vw, 400px" alt={index ? "Attendee sector profile details" : "Macro attendee profile"}/></span>)}<StackCue/>
    </button>}
    <Entrance opacity={.6}><p>{kind === "deck" ? "Identified prospective sponsors, pitched the event through tailored decks and calls, and maintained momentum with updates on confirmed speakers and attendee profiles." : "Curated the guest list to balance priority sectors with diverse professional backgrounds, keeping attendance optimized for education and lead generation."}</p></Entrance>
  </article>
}
