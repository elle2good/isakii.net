"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import HomeFooter from "./HomeFooter"
import HomeHeader from "./HomeHeader"
import MenuContactActions from "./MenuContactActions"

const navigation = [
  { id: "context", label: "Context" },
  { id: "challenges", label: "Challenges" },
  { id: "solutions", label: "Solutions" },
  { id: "impact", label: "Key outcomes" },
]

const solutions = [
  {
    number: "01",
    title: "Community gamification",
    body: "Leaderboards, quests, and unlockable rewards were thoughtfully designed to incentivize social sharing and participation across a growing Discord server and third-party platforms like Zealy — lightweight systems built to deliver a rewarding community experience without straining the team's resources.",
  },
  {
    number: "02",
    title: "Friendly, digestible content",
    body: "Technical articles written from a first-time learner's perspective, paired with livestreamed sessions, made deep-tech messaging more approachable for a broader audience. Community members were invited to lend their own voices to funny, shareable content about Abelian, helping it spread organically across social media.",
  },
  {
    number: "03",
    title: "Community-response streamlining",
    body: "An FAQ, automated channel security, and moderation guidelines kept community management efficient — protecting the brand's image and helping the team navigate a tricky narrative challenge: marketing technology built around a quantum threat that hasn't happened yet.",
  },
  {
    number: "04",
    title: "Ambassador programs",
    body: "Fifteen ambassadors spanning seven languages — each active on their own preferred social platform — were selected from within the community and managed to carry Abelian's brand awareness into corners of the global online world the team couldn't have reached on its own.",
  },
]

function RevealRow({ number, title, body }: (typeof solutions)[number]) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.45, once: false })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="abelian-solution-row"
      initial={false}
      animate={{ opacity: inView ? 1 : 0.5, y: inView || reduceMotion ? 0 : 18 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="abelian-solution-number">{number}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </motion.div>
  )
}

export default function AbelianCaseStudy() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("context")
  const [subnavPinned, setSubnavPinned] = useState(false)
  const [heroCopyDismissed, setHeroCopyDismissed] = useState(false)
  const [impactCopyDismissed, setImpactCopyDismissed] = useState(false)
  const heroSequenceRef = useRef<HTMLElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const subnavRef = useRef<HTMLDivElement>(null)
  const impactRef = useRef<HTMLElement>(null)
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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main ref={articleRef} className="abelian-page">
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

      <section ref={heroSequenceRef} className="abelian-hero-sequence" aria-labelledby="abelian-title">
        <div className="abelian-hero-sticky">
          <motion.div className="abelian-hero-image" style={reduceMotion ? undefined : { filter: filmBlur }}>
            <Image src="/case-studies/abelian/hero.jpg" alt="A quantum computing installation" fill priority sizes="100vw" />
          </motion.div>
          <div className="abelian-hero-gradient" />
          <motion.div className="abelian-hero-dim" style={reduceMotion ? undefined : { opacity: heroDarkOpacity }} />

          <motion.div
            className="abelian-hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: -42 }}
            animate={{ opacity: heroCopyDismissed ? 0 : 1, y: heroCopyDismissed ? -104 : 0 }}
            transition={{ duration: reduceMotion ? 0 : heroCopyDismissed ? 0.48 : 1.05, delay: heroCopyDismissed ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="abelian-hero-copy-motion">
              <span className="abelian-eyebrow">Case study</span>
              <h1 id="abelian-title">Bootstrapping<br />a Global Community from a Very Niche Technology</h1>
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
              <p>
                Abelian needed to move beyond its mining-focused community to build awareness among early adopters and crypto audiences for their upcoming TGE (Token-Generation Event). It was imperative to sustain the technical credibility that gave Abelian its standing while also being accessible to a wider audience.
              </p>
              <div className="abelian-section-one-stats">
                <div><strong>6X</strong><span>growth across<br />7 community channels</span></div>
                <div><strong>~25%</strong><span>of community members<br />converted to users</span></div>
                <div><strong>3</strong><span>products launched</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div ref={subnavRef} className="abelian-subnav">
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
        <div className="abelian-context-stats">
          <div><strong>3 months out</strong><span>$ABEL’s first CEX listing</span></div>
          <div><strong>10K</strong><span>community members</span></div>
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
          <span>Core challenges</span>
          <h2>Building a brand community at the pre-revenue stage, centered on communicating the probabilistic quantum threat to cryptography to a predominantly crypto-enthusiast audience.</h2>
        </div>
      </section>

      <section id="solutions" className="abelian-solutions">
        <header>
          <span>Solutions</span>
          <h2>Forming a highly engaged community that amplifies the brand’s mission and initiatives, each in their own voice.</h2>
        </header>
        <div className="abelian-solution-list">
          {solutions.map((solution) => <RevealRow key={solution.number} {...solution} />)}
        </div>
      </section>

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
              <span>Impact</span>
              <h2 className="sr-only">Key outcomes</h2>
            </div>
            <div className="abelian-impact-stats">
              <div><strong>6X</strong><span>growth across<br />7 community channels</span></div>
              <div><strong>~25%</strong><span>of community members<br />converted to users</span></div>
              <div><strong>3</strong><span>products launched</span></div>
            </div>
          </motion.div>

          <motion.div
            className="abelian-impact-story"
            aria-label="Impact story"
            style={reduceMotion ? undefined : { y: impactStoryY }}
          >
            <div className="abelian-impact-story-wash" />
            <div className="abelian-impact-story-copy">
              <p>Following a successful TGE, the Abelian Foundation moved from a pre-revenue stage company to a revenue-generating one, sustaining upward price momentum post-listing.</p>
              <p>Beyond the launch of its native token, $ABEL, heightened community engagement supported the same-year launch of two additional products: Abelian Pro, a D2C quantum-resistant mobile wallet, and MaxPool, an innovative mining pool built on a novel difficulty-smoothing algorithm.</p>
              <p>Abelian’s native blockchain explorer recorded approximately 15,000 wallet addresses created between October 2023 and January 2024.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <HomeFooter />
    </main>
  )
}
