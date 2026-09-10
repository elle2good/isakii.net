"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import HomeFooter from "./HomeFooter"
import HomeHeader from "./HomeHeader"
import MenuContactActions from "./MenuContactActions"

const navigation = [
  { id: "opportunity", label: "Opportunity" },
  { id: "mission", label: "Mission" },
  { id: "strategy", label: "Strategic approach" },
  { id: "outcomes", label: "Key outcomes" },
]

const galleryItems = [
  {
    type: "video" as const,
    src: "https://res.cloudinary.com/dwto97ayq/video/upload/f_mp4,q_auto/v1788926527/copy_897D3BCE-07B8-4997-AAF9-88EB49C49FC9_crjkzr.mp4",
    alt: "Guests at the Raydium Café Rave",
  },
  {
    type: "video" as const,
    src: "https://res.cloudinary.com/dwto97ayq/video/upload/f_mp4,q_auto/v1788923012/cafeclips00023767_phttsw.mp4",
    alt: "Raydium Café Rave event footage",
  },
  {
    type: "image" as const,
    src: "https://res.cloudinary.com/dwto97ayq/image/upload/f_auto,q_auto/v1788923222/Facetune_09-09-2026-12-06-28_k6ypkn.heic",
    alt: "Raydium Café Rave event photograph",
  },
  {
    type: "video" as const,
    src: "https://res.cloudinary.com/dwto97ayq/video/upload/f_mp4,q_auto/v1788923023/cafeclips02580625_hauzjz.mp4",
    alt: "Café Rave guests and activations",
  },
  {
    type: "video" as const,
    src: "https://res.cloudinary.com/dwto97ayq/video/upload/f_mp4,q_auto/v1788923258/cafeclips02582110_hnzr5k.mp4",
    alt: "Raydium Café Rave closing footage",
  },
]

const strategyRows = [
  {
    number: "01",
    title: <>Multifunctional<br />Space Design</>,
    body: "Cafés were scouted in the heart of the city, prioritizing easy accessibility for all attendees, and selected venues with semi-segregated spaces to accommodate the distinct needs of each guest group. The event announcement highlighted exclusive developer spaces, a dance floor, and a networking terrace.",
    visual: "floorplan",
  },
  {
    number: "02",
    title: <>Partnerships</>,
    body: "",
    visual: "cards",
  },
  {
    number: "03",
    title: <>Grassroots Outreach</>,
    body: "Grassroots outreach was conducted ahead of the event through personal invitations and small dinners, spreading word to Solana ecosystem stakeholders attending Korea Blockchain Week.",
    visual: "none",
  },
]

const partnerCards = [
  {
    front: "International\nDeveloper-focused\ntalent community\nnetworks",
    back: "Superteam leaders from Korea, Vietnam, and Canada chapters joined as co-hosts.",
    artwork: "/case-studies/raydium/cards/superteam-symbol.svg",
  },
  {
    front: "Seoul-based\nDJ and artist\ncollective",
    back: "Unborn Sounds joined as artists while also helping promote the event Instagram.",
    artwork: "/case-studies/raydium/cards/unborn-sounds.png",
  },
  {
    front: "While not a formal partnership, the local originators of Seoul's morning café rave scene were consulted ahead of the event on operational logistics and legal considerations.",
    back: "The event was advised on and approved by SMCC personnel.",
    artwork: "",
  },
]

const heroVideo = "https://res.cloudinary.com/dwto97ayq/video/upload/v1788879338/magnific_a-peaceful-sunrise-nature_hu1Q1usvqL_nyozvt.mp4"
const heroVideoReversed = "https://res.cloudinary.com/dwto97ayq/video/upload/e_reverse/v1788879338/magnific_a-peaceful-sunrise-nature_hu1Q1usvqL_nyozvt.mp4"

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15, once: false })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ opacity: inView ? 1 : 0.5, y: inView || reduceMotion ? 0 : 20 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function RevealFromLeft({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.45, once: false })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ opacity: inView ? 1 : 0.5, x: inView || reduceMotion ? 0 : -120 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function PingPongVideo({ reduceMotion }: { reduceMotion: boolean }) {
  const forwardRef = useRef<HTMLVideoElement>(null)
  const reverseRef = useRef<HTMLVideoElement>(null)
  const [activeClip, setActiveClip] = useState<"forward" | "reverse">("forward")

  useEffect(() => {
    const forward = forwardRef.current
    const reverse = reverseRef.current
    if (!forward || !reverse) return

    if (reduceMotion) {
      forward.pause()
      reverse.pause()
      forward.currentTime = 0
      reverse.currentTime = 0
      return
    }

    let frame = 0
    let disposed = false
    let active = forward
    let standby = reverse
    let switching = false
    const trimSeconds = 1

    const changeClip = () => {
      if (disposed || switching) return
      switching = true
      standby.currentTime = trimSeconds

      void standby.play().then(() => {
        const revealStandby = () => {
          if (disposed) return
          setActiveClip(standby === forward ? "forward" : "reverse")
          window.setTimeout(() => {
            if (disposed) return
            active.pause()
            active.currentTime = trimSeconds
            const previous = active
            active = standby
            standby = previous
            switching = false
          }, 140)
        }

        if ("requestVideoFrameCallback" in standby) standby.requestVideoFrameCallback(revealStandby)
        else window.requestAnimationFrame(revealStandby)
      }).catch(() => {
        switching = false
      })
    }

    const monitor = () => {
      if (active.duration && active.currentTime >= active.duration - trimSeconds) changeClip()
      frame = window.requestAnimationFrame(monitor)
    }

    const start = () => {
      if (disposed) return
      forward.currentTime = trimSeconds
      reverse.currentTime = trimSeconds
      void forward.play().catch(() => undefined)
      frame = window.requestAnimationFrame(monitor)
    }

    forward.addEventListener("ended", changeClip)
    reverse.addEventListener("ended", changeClip)
    if (forward.readyState >= 3) start()
    else forward.addEventListener("canplay", start, { once: true })

    return () => {
      disposed = true
      forward.removeEventListener("ended", changeClip)
      reverse.removeEventListener("ended", changeClip)
      window.cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <>
      <video className={activeClip === "forward" ? "is-active" : ""} ref={forwardRef} src={heroVideo} poster="/case-studies/raydium/hero-fallback.png" muted playsInline preload="auto" />
      <video className={activeClip === "reverse" ? "is-active" : ""} ref={reverseRef} src={heroVideoReversed} muted playsInline preload="auto" />
    </>
  )
}

function PartnershipCards() {
  const [activeCards, setActiveCards] = useState<Set<number>>(() => new Set())

  const toggleCard = (index: number) => {
    setActiveCards((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <motion.div className="raydium-partnership-cards" onViewportLeave={() => setActiveCards(new Set())}>
      {partnerCards.map((card, index) => (
        <button
          key={card.front}
          type="button"
          className={activeCards.has(index) ? "is-active" : ""}
          aria-pressed={activeCards.has(index)}
          onClick={() => toggleCard(index)}
        >
          <span className="raydium-card-flipper">
            <span className="raydium-card-face raydium-card-front">
              <Image className="raydium-card-swap" src="/case-studies/raydium/cards/swap-reference.png" alt="" width={20} height={18} aria-hidden="true" />
              <span className="raydium-card-copy">{card.front}</span>
            </span>
            <span className="raydium-card-face raydium-card-back">
              <Image className="raydium-card-swap" src="/case-studies/raydium/cards/swap-pressed.svg" alt="" width={18} height={16} aria-hidden="true" />
              <span className="raydium-card-copy">{card.back}</span>
              {card.artwork && <Image className={`raydium-card-artwork artwork-${index + 1}`} src={card.artwork} alt="" width={254} height={258} aria-hidden="true" />}
            </span>
          </span>
        </button>
      ))}
    </motion.div>
  )
}

function OutcomeGallery({ dismissed }: { dismissed: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15, once: false })
  const [current, setCurrent] = useState(0)
  const reduceMotion = useReducedMotion()
  const goTo = useCallback((next: number) => {
    setCurrent((next + galleryItems.length) % galleryItems.length)
  }, [])

  const paused = dismissed || !inView

  useEffect(() => {
    if (galleryItems[current].type !== "image" || paused) return
    const timer = window.setTimeout(() => goTo(current + 1), 5000)
    return () => window.clearTimeout(timer)
  }, [current, paused, goTo])

  const item = galleryItems[current]

  return (
    <motion.div ref={ref} className="raydium-gallery" aria-label="Raydium event gallery" onViewportLeave={() => setCurrent(0)}>
      <button type="button" className="raydium-gallery-arrow is-left" aria-label="Previous gallery item" onClick={() => goTo(current - 1)}>‹</button>
      <div className="raydium-gallery-media">
        {item.type === "video" ? (
          <video
            key={`${item.src}-${paused ? "paused" : "playing"}`}
            src={item.src}
            aria-label={item.alt}
            autoPlay={!paused && !reduceMotion}
            muted
            playsInline
            preload="metadata"
            onEnded={() => goTo(current + 1)}
            onError={() => window.setTimeout(() => goTo(current + 1), 1000)}
          />
        ) : (
          // Cloudinary negotiates this HEIC source to a browser-native format.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.src} src={item.src} alt={item.alt} />
        )}
      </div>
      <button type="button" className="raydium-gallery-arrow is-right" aria-label="Next gallery item" onClick={() => goTo(current + 1)}>›</button>
      <div className="raydium-gallery-dots" aria-label={`Gallery item ${current + 1} of ${galleryItems.length}`}>
        {galleryItems.map((galleryItem, index) => (
          <button
            key={galleryItem.src}
            type="button"
            className={index === current ? "is-active" : ""}
            aria-label={`Show gallery item ${index + 1}`}
            aria-current={index === current ? "true" : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function RaydiumCaseStudy() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("opportunity")
  const [subnavPinned, setSubnavPinned] = useState(false)
  const [heroCopyDismissed, setHeroCopyDismissed] = useState(false)
  const [missionCopyDismissed, setMissionCopyDismissed] = useState(false)
  const [galleryDismissed, setGalleryDismissed] = useState(false)
  const articleRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)
  const outcomesRef = useRef<HTMLElement>(null)
  const subnavRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress: articleProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] })
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] })
  const { scrollYProgress: missionProgress } = useScroll({ target: missionRef, offset: ["start start", "end end"] })
  const { scrollYProgress: outcomesProgress } = useScroll({ target: outcomesRef, offset: ["start start", "end end"] })

  const heroMediaY = useTransform(heroProgress, [0, 1], [0, -46])
  const heroMediaScale = useTransform(heroProgress, [0, 1], [1, 1.06])
  const heroMediaFilter = useTransform(heroProgress, [0.18, 0.7], ["blur(0px)", "blur(22px)"])
  const heroFilmY = useTransform(heroProgress, [0.16, 0.42], ["100%", "0%"])

  const missionMediaY = useTransform(missionProgress, [0, 1], [40, -50])
  const missionTakeoverY = useTransform(missionProgress, [0.16, 0.44], ["100%", "0%"])

  const galleryOpacity = useTransform(outcomesProgress, [0, 0.16, 0.34], [1, 1, 0])
  const galleryY = useTransform(outcomesProgress, [0.16, 0.36], [0, -96])
  const impactTakeoverY = useTransform(outcomesProgress, [0.16, 0.46], ["100%", "0%"])

  useMotionValueEvent(heroProgress, "change", (latest) => {
    setHeroCopyDismissed((dismissed) => {
      if (latest >= 0.16) return true
      if (latest <= 0.04) return false
      return dismissed
    })
  })

  useMotionValueEvent(missionProgress, "change", (latest) => {
    setMissionCopyDismissed((dismissed) => {
      if (latest >= 0.16) return true
      if (latest <= 0.04) return false
      return dismissed
    })
  })

  useMotionValueEvent(outcomesProgress, "change", (latest) => setGalleryDismissed(latest > 0.44))

  useEffect(() => {
    const update = () => {
      const subnav = subnavRef.current
      setSubnavPinned(Boolean(subnav && subnav.getBoundingClientRect().top <= 1))
      let next = navigation[0].id
      const checkpoint = window.innerHeight * 0.35 + 78
      for (const item of navigation) {
        const section = document.getElementById(item.id)
        if (section && section.getBoundingClientRect().top <= checkpoint) next = item.id
      }
      setActiveSection(next)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false)
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main ref={articleRef} className="raydium-page">
      <div className={`abelian-site-header ${subnavPinned ? "is-hidden" : ""}`}>
        <HomeHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((value) => !value)} />
      </div>

      {menuOpen && (
        <div className="abelian-menu-layer">
          <button className="home-menu-scrim" aria-label="Close menu" onClick={closeMenu} />
          <div className="home-menu-overlay is-open" role="dialog" aria-modal="true" aria-label="Site menu">
            <button type="button" className="home-menu-close" onClick={closeMenu} aria-label="Close menu">x</button>
            <nav aria-label="Explore">
              <Link className="home-menu-link" href="/about" onClick={closeMenu}>about</Link>
              <Link className="home-menu-link" href="/work?language=en" onClick={closeMenu}>blog</Link>
              <Link className="home-menu-link" href="/work" onClick={closeMenu}>catalogue</Link>
              <Link className="home-menu-link" href="/coming-soon" onClick={closeMenu}>coming soon</Link>
            </nav>
            <MenuContactActions />
          </div>
        </div>
      )}

      <section ref={heroRef} className="raydium-hero-sequence" aria-labelledby="raydium-title">
        <div className="raydium-hero-sticky">
          <motion.div className="raydium-hero-media" style={reduceMotion ? undefined : { y: heroMediaY, scale: heroMediaScale, filter: heroMediaFilter }}>
            <PingPongVideo reduceMotion={Boolean(reduceMotion)} />
          </motion.div>
          <div className="raydium-hero-gradient" />
          <motion.div className="raydium-hero-copy" initial={false} animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -120 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.12, ease: "easeOut" }}>Case study</motion.span>
            <motion.h1 id="raydium-title" initial={reduceMotion ? false : { opacity: 0, y: 42 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.78, delay: 0.28, ease: "easeOut" }}>One Event, Half the Cost,<br />Triple the Reach</motion.h1>
          </motion.div>
          <motion.dl className="raydium-hero-meta" initial={false} animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -120 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
            <div><dt>Role</dt><dd>Ambassador</dd></div>
            <div><dt>Company</dt><dd>Raydium</dd></div>
            <div><dt>Project date</dt><dd>2025.09.01–2025.09.24</dd></div>
          </motion.dl>
          <motion.div className="raydium-scroll-cue-wrap" aria-hidden="true" initial={false} animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -120 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
            <span className="abelian-scroll-cue raydium-scroll-cue" />
          </motion.div>
          <motion.div className="raydium-hero-film" style={reduceMotion ? undefined : { y: heroFilmY }}>
            <div className="raydium-hero-film-wash" />
            <div className="raydium-section-two-copy">
              <p>Just three months after listing its token on Korea’s largest cryptocurrency exchange, Raydium hosted a branded café rave: the company’s first offline activation in Asia. The event was built around strategies to reach three distinct audience groups at once, and we pulled off an exclusive, successful event for less than the cost of a lower-tier sponsorship at a typical industry side event.</p>
              <div className="raydium-section-two-stats">
                <div><strong>40%↓</strong><span>below industry-standard cost<br />per attendee</span></div>
                <div><strong>35%</strong><span>open rate on follow-up emails<br />sent 4 months later</span></div>
                <div><strong>4</strong><span>new local and international<br />partnerships</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div ref={subnavRef} className="abelian-subnav raydium-subnav">
        <span className="abelian-subnav-label">On this page:</span>
        <nav aria-label="Case study sections">
          {navigation.map((item) => <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? "is-active" : ""} aria-current={activeSection === item.id ? "location" : undefined}>{item.label}</a>)}
        </nav>
        <div className="raydium-subnav-actions">
          <a href="https://calendar.app.google/ynneGAWzZeX47R9w7" target="_blank" rel="noreferrer" aria-label="Book a call"><Image src="/case-studies/raydium/nav-icon-2.svg" alt="" width={13} height={13} aria-hidden="true" /></a>
          <button type="button" aria-label="Download or save this case study as PDF" onClick={() => window.print()}><Image src="/case-studies/raydium/nav-icon-1.svg" alt="" width={10} height={10} aria-hidden="true" /></button>
        </div>
        <motion.div className="abelian-progress" style={{ scaleX: articleProgress }} />
      </div>

      <motion.button
        type="button"
        className="abelian-scroll-top"
        aria-label="Scroll back to the hero"
        aria-hidden={!subnavPinned}
        initial={false}
        animate={{ opacity: subnavPinned ? 1 : 0, x: subnavPinned ? 0 : 18 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        tabIndex={subnavPinned ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
      >
        <span className="abelian-scroll-top-triangle" aria-hidden="true" />
      </motion.button>

      <section className="raydium-opportunity-chapter" aria-label="Opportunity chapter image">
        <Image src="/case-studies/raydium/opportunity.png" alt="Raydium listed on Upbit" fill sizes="100vw" />
        <div />
      </section>

      <section id="opportunity" className="raydium-editorial">
        <span className="raydium-rail-label">Opportunity</span>
        <Reveal className="raydium-opportunity-copy">
          <p className="raydium-lede">When Raydium&apos;s native token RAY listed on Upbit, 24-hour trading volume surged more than 600%, reaching $401M — with zero marketing behind it.</p>
          <p>It was a clear signal that crypto traders and investors were genuinely excited about RAY’s expansion into Korea’s largest exchange. Korea Blockchain Week 2025, held three months after the listing, was the perfect opportunity to reinforce that momentum and signal the brand&apos;s next steps.</p>
        </Reveal>
        <div className="raydium-opportunity-stats">
          <RevealFromLeft><strong>1 month</strong><span>planning lead time</span></RevealFromLeft>
          <RevealFromLeft><strong>0</strong><span>prior offline activations in Asia</span></RevealFromLeft>
        </div>
        <Reveal className="raydium-opportunity-copy raydium-opportunity-bottom">
          <p>As a Decentralized Exchange already fighting skepticism over unclear legal footing, the brand had always steered clear of the boozy side, event parties that define blockchain conference culture, refusing to reinforce crypto&apos;s “dark and corrupt” reputation.</p>
          <p>A wellness-driven trend that reframed “fun” without the baggage was spotted around the same moment the brand listed on South Korea’s major exchange.</p>
        </Reveal>
      </section>

      <section ref={missionRef} id="mission" className="raydium-mission-sequence">
        <div className="raydium-mission-sticky">
          <motion.div className="raydium-mission-media" style={reduceMotion ? undefined : { y: missionMediaY }}>
            <Image src="/case-studies/raydium/mission.png" alt="Raydium brand landscape" fill sizes="100vw" />
          </motion.div>
          <div className="raydium-mission-overlay" />
          <motion.div className="raydium-mission-title" initial={false} animate={{ opacity: missionCopyDismissed ? 0 : 1, y: missionCopyDismissed ? -104 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
            <span>Mission</span>
            <h2>Raydium is 1) a decentralized exchange for <u>crypto users</u> everywhere, 2) an open-source DeFi protocol with SDKs and APIs for <u>developers</u>, and 3) core infrastructure to <u>Solana’s ecosystem</u>.</h2>
          </motion.div>
          <motion.div className="raydium-mission-takeover" style={reduceMotion ? undefined : { y: missionTakeoverY }}>
            <p>The Café Rave had to be inviting, accessible, and satisfying to all of Raydium&apos;s stakeholders: retail users, developers, and the broader Solana ecosystem.</p>
          </motion.div>
        </div>
      </section>

      <section id="strategy" className="raydium-strategy">
        <span className="raydium-rail-label">Strategic Approach</span>
        <div className="raydium-strategy-list">
          {strategyRows.map((row) => (
            <Reveal key={row.number} className="raydium-strategy-row">
              <span className="raydium-strategy-number">{row.number}</span>
              <h3>{row.title}</h3>
              {row.body && <p>{row.body}</p>}
              {row.visual === "floorplan" && <Image className="raydium-floorplan" src="/case-studies/raydium/floorplan.png" alt="Café Rave multifunctional floor plan" width={1035} height={416} />}
              {row.visual === "cards" && <PartnershipCards />}
            </Reveal>
          ))}
          <Reveal className="raydium-strategy-closing">
            <span className="raydium-strategy-number">04</span>
            <p>The most important part of the strategy was, without question, <strong>brand research</strong>.<br /><br />As the sole representative of Raydium at the event, I thoroughly researched the brand&apos;s history, mission, and evolution to ensure I could authentically embody its ethos for guests.</p>
          </Reveal>
        </div>
      </section>

      <section ref={outcomesRef} id="outcomes" className="raydium-outcomes-sequence">
        <div className="raydium-outcomes-sticky">
          <motion.div className="raydium-gallery-stage" style={reduceMotion ? undefined : { opacity: galleryOpacity, y: galleryY }}>
            <span>Key Outcomes</span>
            <OutcomeGallery key={galleryDismissed ? "dismissed" : "visible"} dismissed={galleryDismissed} />
          </motion.div>
          <motion.div className="raydium-impact-takeover" style={reduceMotion ? undefined : { y: impactTakeoverY }}>
            <div><strong>40%↓</strong><span>below industry-standard cost<br />per attendee</span></div>
            <div><strong>35%</strong><span>open rate on follow-up emails<br />sent 4 months later</span></div>
            <div><strong>4</strong><span>new local and international<br />partnerships</span></div>
          </motion.div>
        </div>
      </section>

      <HomeFooter />
    </main>
  )
}
