"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"
import HomeFooter from "./HomeFooter"
import HomeHeader from "./HomeHeader"
import MenuContactActions from "./MenuContactActions"
import ExternalBlogLink from "./ExternalBlogLink"
import NotificationTicker from "./NotificationTicker"

const ease = [0.22, 1, 0.36, 1] as const

function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.32 }}
      transition={{ duration: reduceMotion ? 0 : 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutExperience() {
  const reduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [blogExpanded, setBlogExpanded] = useState(false)
  const [topChromeVisible, setTopChromeVisible] = useState(true)

  useEffect(() => {
    let previousScrollY = window.scrollY
    let previousTouchY: number | null = null

    const showForDirection = (delta: number) => {
      if (menuOpen) {
        setTopChromeVisible(true)
      } else if (delta > 0) {
        setTopChromeVisible(false)
      } else if (delta < 0) {
        setTopChromeVisible(true)
      }
    }

    const updateTopChrome = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - previousScrollY
      if (currentScrollY <= 2) setTopChromeVisible(true)
      else showForDirection(delta)
      previousScrollY = currentScrollY
    }

    const updateFromWheel = (event: WheelEvent) => showForDirection(event.deltaY)
    const rememberTouch = (event: TouchEvent) => {
      previousTouchY = event.touches[0]?.clientY ?? null
    }
    const updateFromTouch = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY
      if (currentTouchY === undefined || previousTouchY === null) return
      showForDirection(previousTouchY - currentTouchY)
      previousTouchY = currentTouchY
    }

    window.addEventListener("scroll", updateTopChrome, { passive: true })
    window.addEventListener("wheel", updateFromWheel, { passive: true })
    window.addEventListener("touchstart", rememberTouch, { passive: true })
    window.addEventListener("touchmove", updateFromTouch, { passive: true })
    return () => {
      window.removeEventListener("scroll", updateTopChrome)
      window.removeEventListener("wheel", updateFromWheel)
      window.removeEventListener("touchstart", rememberTouch)
      window.removeEventListener("touchmove", updateFromTouch)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setBlogExpanded(false)
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setBlogExpanded(false)
  }

  const handlePageWheel = (deltaY: number) => {
    if (menuOpen) setTopChromeVisible(true)
    else if (deltaY > 0) setTopChromeVisible(false)
    else if (deltaY < 0) setTopChromeVisible(true)
  }

  return (
    <main className="about-page-new" onWheelCapture={(event) => handlePageWheel(event.deltaY)}>
      <section className="about-stage" aria-labelledby="about-title">
        <div className="about-atmosphere" aria-hidden="true">
          <div className="about-room-crop">
            <Image className="about-room-art" src="/about/desk-left-layer.png" alt="" width={1920} height={1080} priority sizes="118vw" />
          </div>
          <Image className="about-window-art" src="/about/window-layer.png" alt="" width={383} height={875} priority />
          <div className="about-atmosphere-dim" />
        </div>

        <div className={`about-site-header ${topChromeVisible ? "is-visible" : "is-hidden"}`}>
          <HomeHeader
            menuOpen={menuOpen}
            onToggleMenu={() => {
              setMenuOpen((value) => !value)
              if (menuOpen) setBlogExpanded(false)
            }}
          />
          <NotificationTicker />
        </div>

        {menuOpen && (
          <div className="about-menu-layer">
            <button className="home-menu-scrim" aria-label="Close menu" onClick={closeMenu} />
            <div className={`home-menu-overlay is-open ${blogExpanded ? "has-blog-expanded" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu">
              <button type="button" className="home-menu-close" onClick={closeMenu} aria-label="Close menu">x</button>
              <nav aria-label="Explore">
                <Link className="home-menu-link" href="/about" onClick={closeMenu}>about</Link>
                <div className={`home-menu-accordion ${blogExpanded ? "is-expanded" : ""}`}>
                  <button type="button" className="home-menu-accordion-trigger" aria-expanded={blogExpanded} aria-controls="about-blog-submenu" onClick={() => setBlogExpanded((value) => !value)}>
                    <span>blog</span>
                    <span className="home-menu-accordion-arrow" aria-hidden="true" />
                  </button>
                  <div id="about-blog-submenu" className="home-menu-submenu" aria-hidden={!blogExpanded}>
                    <ExternalBlogLink href="https://isegye.substack.com" tabIndex={blogExpanded ? 0 : -1} onOpen={closeMenu}><span className="home-menu-submenu-label">English</span><span className="home-menu-submenu-arrow" aria-hidden="true" /></ExternalBlogLink>
                    <ExternalBlogLink href="https://brunch.co.kr/@isakii" tabIndex={blogExpanded ? 0 : -1} onOpen={closeMenu}><span className="home-menu-submenu-label">Korean</span><span className="home-menu-submenu-arrow" aria-hidden="true" /></ExternalBlogLink>
                    <ExternalBlogLink href="https://medium.com/@iskaii" tabIndex={blogExpanded ? 0 : -1} onOpen={closeMenu}><span className="home-menu-submenu-label">Archive</span><span className="home-menu-submenu-arrow" aria-hidden="true" /></ExternalBlogLink>
                  </div>
                </div>
                <Link className="home-menu-link" href="/#projects" onClick={closeMenu}>catalogue</Link>
                <Link className="home-menu-link" href="/" onClick={closeMenu}>home</Link>
              </nav>
              <MenuContactActions />
            </div>
          </div>
        )}

        <motion.h1 id="about-title" className="about-handwritten-title" aria-label="hi, there." initial={reduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
          <motion.span className="about-handwriting-word about-handwriting-hi" aria-hidden="true" variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)" } }} transition={{ duration: reduceMotion ? 0 : 1.05, delay: 0.24, ease }} />
          <motion.span className="about-handwriting-word about-handwriting-there" aria-hidden="true" variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)" } }} transition={{ duration: reduceMotion ? 0 : 1.48, delay: reduceMotion ? 0 : 1.02, ease }} />
        </motion.h1>

        <motion.div className="about-portrait-new" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 1.15, delay: 0.5, ease }}>
          <Image src="/about/portrait.png" alt="Lisa Kim" fill priority sizes="172px" />
        </motion.div>

        <motion.div className="about-neon-card" aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 1, delay: 0.75, ease }}>
          <Image src="/about/neon-card.png" alt="" fill priority sizes="114px" />
        </motion.div>

        <motion.div className="about-desk-art" aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 1.1, delay: 0.9, ease }}>
          <Image src="/about/desk.png" alt="" fill priority sizes="331px" />
        </motion.div>

        <div className="about-editorial">
          <FadeIn className="about-intro" delay={0.05}><p>I’m Lisa (본명: 김수민)</p></FadeIn>
          <FadeIn className="about-body-new" delay={0.12}>
            <p>I was born in Seoul, South Korea, on August 10th, 1996, and I currently live in Gangnam-gu, at the heart of the city.</p>
            <p>I graduated with a Bachelor of Science in Clothing &amp; Textiles from Sookmyung Women&apos;s University. Since then, I&apos;ve worked full-time at an AI startup (before ChatGPT even launched) and later continued my journey in emerging tech as a self-employed blockchain consultant and freelancer.</p>
            <p>In my free time, I enjoy listening to music, practicing yoga, jogging, and doing anything creative.</p>
            <p>I&apos;m entrepreneurial by nature, which gives me a naturally optimistic outlook. In 2026, I started studying for the LSAT as a way to sharpen my reasoning skills: a good counterbalance to that optimism.</p>
            <p>Anyway, I&apos;m glad you found me. Thanks for stopping by.</p>
          </FadeIn>
        </div>

        <motion.div className="about-signatures" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.55 }} aria-label="Lisa Kim signatures">
          <motion.span className="about-signature-piece about-signature-western" variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)" } }} transition={{ duration: reduceMotion ? 0 : 1.2, ease }}><Image src="/about/signatures.png" alt="" width={161} height={55} /></motion.span>
          <motion.span className="about-signature-piece about-signature-korean" variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)" } }} transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : 0.72, ease }}><Image src="/about/signatures.png" alt="" width={161} height={55} /></motion.span>
        </motion.div>
      </section>

      <HomeFooter />
    </main>
  )
}
