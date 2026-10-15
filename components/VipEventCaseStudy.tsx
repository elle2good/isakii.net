"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import HomeHeader from "./HomeHeader"
import HomeFooter from "./HomeFooter"
import MenuContactActions from "./MenuContactActions"
import CaseStudyContactActions from "./CaseStudyContactActions"
import SmoothScroll from "./SmoothScroll"
import { Entrance, FloorGallery, LessonCards, NewsletterPerformance, PlanningHoverCard } from "./VipEventInteractions"
import "./vip-event-case-study.css"

const base = "/case-studies/vip-event/"
const sections = [["context", "Context"], ["before-crisis", "Before crisis"], ["crisis", "The crisis"], ["management", "Management"], ["lessons", "Lessons"]]
const summary = [["1,000+", "registered guests and 404 approved attendance across finance, fintech, and tech"], ["37%", "average holiday season newsletter open rate following the event’s cancellation"], ["−$450", "financial loss following successful dispute resolution against the venue"]]

function Takeover({ hero = false, children }: { hero?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const y = useTransform(scrollYProgress, [.16, .44], ["100%", "0%"])
  const opacity = useTransform(scrollYProgress, [.16, .34], [1, 0])
  const textY = useTransform(scrollYProgress, [.16, .34], [0, -104])
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, -46])
  const blur = useTransform(scrollYProgress, [.18, .7], ["blur(0px)", "blur(22px)"])
  return <section ref={ref} id={hero ? undefined : "crisis"} className={`vip-sequence ${hero ? "vip-hero" : "vip-crisis"}`}>
    <div className="vip-sticky">
      <motion.div className="vip-backdrop" style={reduced ? undefined : { y: mediaY, filter: blur }}><Image src={base + (hero ? "hero-updated.png" : "481-686-imgChatGptImageOct142026114236Am1.png")} alt="" fill sizes="100vw" priority={hero}/></motion.div>
      <div className="vip-shade"/>
      <motion.div className="vip-opening" style={reduced ? undefined : { "--vip-copy-opacity": opacity, y: textY } as MotionStyle}>{children}</motion.div>
      <motion.div className="vip-takeover" style={reduced ? undefined : { y }}>
        <div className="vip-takeover-wash" aria-hidden="true"><span className="vip-gradient-layer" style={{ backgroundImage: `url(${base}${hero ? "summary" : "crisis"}-gradient.svg)` }}/><span className="vip-gradient-layer" style={{ backgroundImage: `url(${base}${hero ? "summary" : "crisis"}-texture.svg)` }}/></div>
        <div className="vip-takeover-content"><h2 className="vip-label">{hero ? "Summary" : "The crisis"}</h2>
          <p className="vip-editorial">{hero ? "When a lead-generation event for Abu Dhabi Finance Week 2025 was cancelled on the day, the focus shifted to crisis management: coordinating stakeholders, communicating with guests, and pursuing litigation against the venue." : "With funding falling short and a venue contract breach compromising the planned experience, I cancelled the event 10 hours before it was due to begin."}</p>
          {hero && <div className="vip-metrics vip-summary-metrics">{summary.map(([value, label]) => <div key={value}><strong>{value}</strong><p>{label}</p></div>)}</div>}
        </div>
      </motion.div>
    </div>
  </section>
}

function PlanningArt({ file, alt, className = "", scale = 1.2 }: { file: string; alt: string; className?: string; scale?: number }) {
  return <Entrance scale={scale} opacity={1} className={className}><Image src={base + file} alt={alt} fill sizes="(max-width:700px) 85vw, 480px"/></Entrance>
}
function ManagementRow({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  const reduced = useReducedMotion()
  return <div className="vip-management-row"><span className="vip-number">{number}</span><motion.h3 initial={reduced ? false : { x: -60 }} whileInView={{ x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .5, ease: "easeOut" }}>{title}</motion.h3><motion.p initial={reduced ? false : { opacity: .5 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .5, ease: "easeOut" }}>{children}</motion.p></div>
}

export default function VipEventCaseStudy() {
  const ref = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState("context")
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  useEffect(() => {
    const update = () => {
      setPinned(Boolean(navRef.current && navRef.current.getBoundingClientRect().top <= 1))
      let current = "context"
      for (const [id] of sections) if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < window.innerHeight * .35 + 78) current = id
      setActive(current)
    }
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update)
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update) }
  }, [])
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false) }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close) }, [])
  return <main ref={ref} className="vip-page">
    {!reduced && <SmoothScroll intensity={9} anchors/>}
    <div className={`abelian-site-header ${pinned && !menuOpen ? "is-hidden" : ""}`}><HomeHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(value => !value)}/></div>
    {menuOpen && <div className="abelian-menu-layer"><button className="home-menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)}/><div className="home-menu-overlay is-open" role="dialog" aria-modal="true" aria-label="Site menu"><button className="home-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">x</button><nav aria-label="Explore">{[["/about", "about"], ["/work?language=en", "blog"], ["/#projects", "catalogue"], ["/", "home"]].map(([href, label]) => <Link className="home-menu-link" key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav><MenuContactActions/></div></div>}
    <Takeover hero>
      <div className="vip-hero-copy"><motion.p initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .58, delay: .12, ease: "easeOut" }}>CASE STUDY &amp; INSIGHTS REPORT</motion.p><motion.h1 initial={reduced ? false : { opacity: 0, y: 42 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .77, delay: .28, ease: "easeOut" }}>VIP Event, Cancelled.</motion.h1></div>
      <dl className="vip-meta"><div><dt>Role</dt><dd>Organizer</dd></div><div><dt>Company</dt><dd>None / Independent</dd></div><div><dt>Project date</dt><dd>2025.11.01 - 2026.01.12</dd></div></dl>
    </Takeover>
    <div ref={navRef} className="abelian-subnav has-contact-actions vip-subnav"><span className="abelian-subnav-label">On this page:</span><nav aria-label="Case study sections">{sections.map(([id,label]) => <a key={id} href={`#${id}`} className={active === id ? "is-active" : ""} aria-current={active === id ? "location" : undefined}>{label}</a>)}</nav><CaseStudyContactActions/><motion.div className="abelian-progress" style={{ scaleX: scrollYProgress }}/></div>
    <section id="context" className="vip-context vip-container"><h2 className="vip-label">Context</h2><div className="vip-context-columns"><div><h3>Business Momentum ↑</h3><p>Strong momentum. A need to scale.</p><p>After a strong year, I set out to build my next client pipeline through an educational event during Abu Dhabi Finance Week.</p></div><div><h3>Market confidence ↓</h3><p>Sharp losses. Market downturn.</p><p>Crypto was reeling from October’s sell-off. Bitcoin had fallen as much as 36% from its peak, while perpetual futures dominated industry conversations.</p></div></div>
      <h3 className="vip-resource-label">Available Resources</h3><div className="vip-metrics vip-resources">{[["1.5 months", "to plan and deliver"],["$25,000", "budget for the initiative"],["1 person", "end-to-end planning and execution"]].map(([value,label]) => <div key={value}><Entrance delay={.8}><strong>{value}</strong></Entrance><Entrance delay={.8} opacity={.4}><p>{label}</p></Entrance></div>)}</div>
    </section>
    <div className="vip-context-divider" aria-hidden="true"/><section id="before-crisis" className="vip-before vip-container"><h2 className="vip-label">Before crisis</h2><div className="vip-planning-grid">
      <article><header><span className="vip-number">01</span><h3>Event Planning</h3></header><Entrance opacity={.6}><p>Sourced the venue, negotiated packages, and built the budget and sponsorship tiers around the target audience.</p></Entrance><Entrance scale={1.2} opacity={1} className="vip-floor-wrap"><FloorGallery/></Entrance></article>
      <article><header><span className="vip-number">02</span><h3>Content Planning</h3></header><Entrance opacity={.6}><p>Developed panel topics, questions, and organized panel speakers and moderators.</p></Entrance><div className="vip-documents"><PlanningArt file="474-895-imgPanelQuestions11.png" alt="First panel questions" scale={1.15}/><PlanningArt file="474-895-imgPanelQuestions31.png" alt="Third panel questions" scale={1.15}/></div></article>
      <PlanningHoverCard kind="deck"><header><span className="vip-number">03</span><h3>Sponsor Outreach &amp; Pitching</h3></header></PlanningHoverCard>
      <PlanningHoverCard kind="profiles"><header><span className="vip-number">04</span><h3>Guest Curation</h3></header></PlanningHoverCard>
    </div></section>
    <Takeover><div className="vip-crisis-content"><h2 className="vip-label">The crisis</h2><div className="vip-metrics">{[["404", "VIP guests"],["0%", "of the sponsorship target secured"],["10 hours", "left until event when a contract breach by the venue was detected"]].map(([value,label], i) => <Entrance key={value} delay={.6 + [0,.282,.644][i]} duration={.7}><strong>{value}</strong><p>{label}</p></Entrance>)}</div></div></Takeover>
    <section id="management" className="vip-management vip-container"><h2 className="vip-label">Management</h2><article><ManagementRow number="01" title="Stakeholder Communication">Immediately called stakeholders to explain the circumstances, communicate the cancellation decision, and ask for their understanding.</ManagementRow></article><article><ManagementRow number="02" title="Guest Communications">Promptly notified confirmed guests of the cancellation and its circumstances. Followed up with three entertaining, educational newsletters over the holiday season to manage reputation.</ManagementRow><NewsletterPerformance/></article><article><ManagementRow number="03" title="Dispute Resolution">Negotiated directly with the venue across 18 email exchanges, securing a recovery of the deposit, less credit card processing fees.</ManagementRow></article></section>
    <section id="lessons" className="vip-lessons"><div className="vip-container"><h2 className="vip-label">Lessons</h2><LessonCards/></div></section>
    <HomeFooter/>
    {pinned && <button type="button" className="abelian-scroll-top" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })}><span className="abelian-scroll-top-triangle" aria-hidden="true"/></button>}
  </main>
}
