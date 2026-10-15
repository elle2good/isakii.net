"use client"

import Image from "next/image"
import CaseStudyContactActions from "./CaseStudyContactActions"
import Link from "next/link"
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import HomeFooter from "./HomeFooter"
import SmoothScroll from "./SmoothScroll"
import HomeHeader from "./HomeHeader"
import MenuContactActions from "./MenuContactActions"
import AbelianSolutions, { AbelianMotion } from "./AbelianMedia"

const navigation = [
  { id: "context", label: "Context" },
  { id: "challenges", label: "Challenges" },
  { id: "solutions", label: "Solutions" },
  { id: "impact", label: "Key outcomes" },
]

export default function AbelianCaseStudy() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("context")
  const [subnavPinned, setSubnavPinned] = useState(false)
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const showContactButtons = subnavPinned && !isScrolling
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      setIsScrolling(true)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setIsScrolling(false), 500)
    }
    // Capture also detects swipes within the horizontal carousels.
    document.addEventListener("scroll", onScroll, { passive: true, capture: true })
    return () => {
      document.removeEventListener("scroll", onScroll, true)
      clearTimeout(idleTimer)
    }
  }, [])
  const [heroCopyDismissed, setHeroCopyDismissed] = useState(false)
  const [impactCopyDismissed, setImpactCopyDismissed] = useState(false)
  const heroSequenceRef = useRef<HTMLElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const subnavRef = useRef<HTMLDivElement>(null)
  const impactRef = useRef<HTMLElement>(null)
  const impactEntered = useInView(impactRef, { amount: "some", once: true })
  const reduceMotion = useReducedMotion()

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSequenceRef,
    offset: ["start start", "end end"],
  })
  const { scrollYProgress: articleProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  })
  const { scrollYProgress: impactProgress } = useScroll({
    target: impactRef,
    offset: ["start start", "end end"],
  })

  const filmY = useTransform(heroProgress, [0.24, 0.78], ["100%", "0%"])
  const filmBlur = useTransform(heroProgress, [0.2, 0.72], ["blur(0px)", "blur(18px)"])
  const heroDarkOpacity = useTransform(heroProgress, [0.2, 0.72], [0, 0.68])
  const impactY = useTransform(impactProgress, [0, 1], [48, -48])
  const impactStoryY = useTransform(impactProgress, [0.27, 0.82], ["100%", "0%"])

  useMotionValueEvent(heroProgress, "change", (latest) => {
    setHeroCopyDismissed((dismissed) => {
      if (latest >= 0.28) return true
      if (latest <= 0.04) return false
      return dismissed
    })
  })

  useMotionValueEvent(impactProgress, "change", (latest) => {
    setImpactCopyDismissed((dismissed) => {
      if (latest >= 0.25) return true
      if (latest <= 0.04) return false
      return dismissed
    })
  })

  useEffect(() => {
    let previousScrollY = Math.max(0, window.scrollY)
    const update = () => {
      const subnav = subnavRef.current
      setSubnavPinned(Boolean(subnav && subnav.getBoundingClientRect().top <= 1))
      const currentScrollY = Math.max(0, window.scrollY)
      if (!window.matchMedia("(max-width: 700px)").matches || currentScrollY === 0) {
        setMobileHeaderHidden(false)
      } else if (currentScrollY !== previousScrollY) {
        setMobileHeaderHidden(currentScrollY > previousScrollY)
      }
      previousScrollY = currentScrollY

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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main ref={articleRef} className="abelian-page abelian-revised">
      <SmoothScroll intensity={9} anchors />
      <div className={`abelian-site-header ${subnavPinned || mobileHeaderHidden ? "is-hidden" : ""}`} inert={subnavPinned || mobileHeaderHidden}>
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
              <Link className="home-menu-link" href="/#projects" onClick={closeMenu}>catalogue</Link>
              <Link className="home-menu-link" href="/" onClick={closeMenu}>home</Link>
            </nav>
            <MenuContactActions />
          </div>
        </div>
      )}

      <section ref={heroSequenceRef} className="abelian-hero-sequence" aria-labelledby="abelian-title">
        <div className="abelian-hero-sticky">
          <motion.div className="abelian-hero-image" style={reduceMotion ? undefined : { filter: filmBlur }}>
            <Image src="/case-studies/abelian/hero.jpg" alt="A quantum computing installation" fill priority sizes="100vw" />
          </motion.div>
          <div className="abelian-hero-gradient" />
          <motion.div className="abelian-hero-dim" style={reduceMotion ? undefined : { opacity: heroDarkOpacity }} />

          <motion.div
            className="abelian-hero-copy"
            initial={false}
            animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -104 : 0 }}
            transition={{ duration: reduceMotion ? 0 : heroCopyDismissed ? 0.48 : 1.05, delay: heroCopyDismissed ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="abelian-hero-copy-motion">
              <AbelianMotion as="span" node="119:29" className="abelian-eyebrow">Case study</AbelianMotion>
              <div id="abelian-title"><AbelianMotion as="h1" node="119:30">Bootstrapping<br />a Global Community from a Very Niche Technology</AbelianMotion></div>
            </div>
          </motion.div>

          <motion.dl
            className="abelian-hero-meta"
            initial={false}
            animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -104 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div><dt>Role</dt><dd>Social Media &amp; Community Manager</dd></div>
            <div><dt>Company</dt><dd>Abelian Foundation</dd></div>
            <div><dt>Project date</dt><dd>2023.09–2024.09</dd></div>
          </motion.dl>

          <motion.div
            className="abelian-scroll-cue"
            aria-hidden="true"
            initial={false}
            animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -104 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div className="abelian-hero-film" style={reduceMotion ? undefined : { y: filmY }}>
            <div className="abelian-film-wash" />
            <div className="abelian-section-one-copy">
              <span className="abelian-summary-label">Summary</span>
              <p>
                Abelian needed to move beyond its mining-focused community to build awareness among early adopters and crypto audiences for their upcoming TGE (Token-Generation Event). It was imperative to sustain the technical credibility that gave Abelian its standing while also being accessible to a wider audience.
              </p>
              <div className="abelian-section-one-stats" aria-label="Key outcomes">
                <div><strong>25X</strong><span>growth across<br />7 community channels</span></div>
                <div><strong>~25%</strong><span>of community members<br />converted to users</span></div>
                <div><strong>40K</strong><span>App Installations</span></div>
              </div>
              <span className="abelian-summary-scroll-cue" aria-hidden="true">
                <Image src="/case-studies/abelian/arrow-right.png" alt="" width={32} height={32} />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div ref={subnavRef} className="abelian-subnav has-contact-actions">
        <span className="abelian-subnav-label">On this page:</span>
        <nav aria-label="Case study sections">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "is-active" : ""}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <CaseStudyContactActions activeSection={activeSection} />
        <motion.div className="abelian-progress" style={{ scaleX: articleProgress }} />
      </div>

      <motion.div
        className="abelian-mobile-contact-stack"
        aria-label="Contact"
        inert={!showContactButtons}
        aria-hidden={!showContactButtons}
        initial={false}
        animate={{ opacity: showContactButtons ? 1 : 0, x: showContactButtons ? 0 : 18 }}
        transition={{ duration: reduceMotion || !showContactButtons ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="mailto:smkim@isakii.net" aria-label="Email smkim@isakii.net">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="0.5" /><path d="m4 7 8 6 8-6" /></svg>
        </a>
        <a href="https://calendar.app.google/GYAJYPauZoJfZQ4F9" target="_blank" rel="noreferrer" aria-label="Schedule a call">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 9.8 3l2 4.6-2.3 1.7a14.8 14.8 0 0 0 5.2 5.2l1.7-2.3 4.6 2-.8 2.6c-.4 1.4-1.8 2.3-3.2 2.1C10.8 18 6 13.2 5.1 7c-.2-1.4.7-2.8 2.1-3.2Z" /></svg>
        </a>
      </motion.div>

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

      <section className="abelian-chapter abelian-context-chapter" aria-label="Context introduction">
        <div className="abelian-chapter-image">
          <Image src="/case-studies/abelian/context.png" alt="Quantum-resistant blockchain technology" fill sizes="100vw" />
        </div>
        <div className="abelian-chapter-overlay" />
        <div className="abelian-chapter-copy">
          <span>Context</span>
          <h2>Quantum-resistant blockchain technology with a niche mining community</h2>
        </div>
      </section>

      <section id="context" className="abelian-editorial abelian-context">
        <div className="abelian-section-label">Context</div>
        <div className="abelian-editorial-copy">
          <p className="abelian-lede">The Abelian Foundation was a pre-revenue company that had built a token-mining-focused community, most of whose members were looking forward to their mined tokens being listed on a centralized exchange (CEX).</p>
          <p>Token sales are a primary revenue source for cryptocurrency and blockchain startups. A successful token listing depends on a brand building awareness — both of the token itself and of the functionality and promise of the underlying technology — since that promise is what is expected to drive the token’s value upward over time and convince retail investors to buy in.</p>
        </div>
        <span className="abelian-snapshot-label">Snapshot</span>
        <div className="abelian-context-stats" aria-label="Snapshot metrics">
          <div><AbelianMotion as="strong" node="154:614">3 months out</AbelianMotion><AbelianMotion as="span" node="154:615">$ABEL’s first CEX listing</AbelianMotion></div>
          <div><AbelianMotion as="strong" node="154:617">9K</AbelianMotion><AbelianMotion as="span" node="154:618">community members</AbelianMotion></div>
        </div>
        <div className="abelian-editorial-copy abelian-editorial-copy-bottom">
          <p className="abelian-lede">The Foundation also planned to launch quantum-resistant D2C apps and developer tools shortly after the token launch.</p>
          <p>Awareness had to be built simultaneously across multiple audiences — early tech adopters, developers, and retail investors — to drive real adoption of the brand’s technology and pave the way for sustainable growth.</p>
        </div>
      </section>

      <section id="challenges" className="abelian-chapter abelian-challenges">
        <div className="abelian-chapter-image">
          <Image src="/case-studies/abelian/challenges.png" alt="An encrypted digital network" fill sizes="100vw" />
        </div>
        <div className="abelian-chapter-overlay" />
        <div className="abelian-chapter-copy">
          <span>Challenges</span>
          <AbelianMotion as="h2" node="119:56">Building a brand community at the pre-revenue stage, centered on communicating the probabilistic quantum threat to cryptography to a predominantly crypto-enthusiast audience.</AbelianMotion>
        </div>
      </section>

      <AbelianSolutions />

      <section ref={impactRef} id="impact" className="abelian-impact-sequence">
        <div className="abelian-impact-sticky">
          <motion.div className="abelian-impact-parallax" style={reduceMotion ? undefined : { y: impactY }} />
          <motion.div
            className="abelian-impact-frame"
            initial={false}
            animate={{ opacity: impactCopyDismissed ? 0 : 1, y: impactCopyDismissed ? -72 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="abelian-impact-heading">
              <span>IMPACT</span>
              <h2 className="sr-only">Key outcomes</h2>
            </div>
            <motion.div
              className="abelian-impact-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: impactEntered || reduceMotion ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
            >
              <div><strong>25X</strong><span>growth across<br />7 community channels</span></div>
              <div><strong>~25%</strong><span>of community members<br />converted to users</span></div>
              <div><strong>40K</strong><span>App Installations</span></div>
            </motion.div>
          </motion.div>

          <motion.div
            className="abelian-impact-story"
            aria-label="Impact story"
            style={reduceMotion ? undefined : { y: impactStoryY }}
          >
            <div className="abelian-impact-story-wash" />
            <div className="abelian-impact-story-copy">
              <p>Following a successful TGE, the Abelian Foundation moved from a pre-revenue stage company to a revenue-generating one, sustaining upward price momentum post-listing.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <HomeFooter />
    </main>
  )
}
