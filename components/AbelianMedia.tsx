"use client"

import Image from "next/image"
import { useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import "./abelian-motion.css"
import "./abelian-case-study.css"

/** Latch entrances so animated bounds cannot repeatedly reset the viewport trigger. */
export function AbelianMotion({ node, as = "div", className = "", children }: {
  node: string; as?: "div" | "span" | "strong" | "h1" | "h2" | "h3" | "p"; className?: string; children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: 0.15, once: true })
  const Tag = as
  return <Tag ref={ref} className={`${className} abelian-motion ${visible ? "is-visible" : ""}`} data-motion={node}>{children}</Tag>
}

const media = (name: string) => `/case-studies/abelian/media/${name}.webp`

function HoverGallery({ title, images, shape = "landscape", labels, activeIndex, onAdvance }: {
  title: string; images: string[]; shape?: "landscape" | "banner" | "shirt"; labels?: string[]; activeIndex?: number; onAdvance?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [localActive, setActive] = useState(0)
  const active = activeIndex ?? localActive
  const reduced = useReducedMotion()
  const ref = useRef<HTMLButtonElement>(null)
  const visible = useInView(ref, { amount: 0.05 })
  const playing = activeIndex === undefined && (hovered || focused) && visible && !reduced
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setActive(index => (index + 1) % images.length), 900)
    return () => clearInterval(timer)
  }, [playing, images.length])
  const reset = () => { if (activeIndex === undefined) setActive(0) }
  return <figure className={`abelian-hover-gallery is-${shape}`}>
    <button ref={ref} type="button" aria-label={`${title}: show next image`} className="abelian-media-hover-area"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); if (!focused) reset() }}
      onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); if (!hovered) reset() }}
      onClick={() => onAdvance ? onAdvance() : setActive(index => (index + 1) % images.length)}>
      <span className="abelian-gallery-stack">
        {images.map((name, index) => <Image key={name} src={media(name)} alt={`${title}${labels ? ` — ${labels[index]}` : `, image ${index + 1}`}`} fill sizes="(max-width: 700px) 85vw, 32vw" className={index === active ? "is-active" : ""} aria-hidden={index !== active} />)}
        <span className="abelian-gallery-cue" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 16H3V3h13v2" /><rect x="7" y="7" width="14" height="14" rx="1" /><path d="m8 18 4-4 3 3 2-2 3 3" /><circle cx="16.5" cy="11.5" r="1" /></svg>
        </span>
      </span>
    </button>
    {labels && <figcaption>{title}<strong>{labels[active]}</strong></figcaption>}
  </figure>
}

const brochurePages = Array.from({ length: 12 }, (_, index) => `brochure-page-${index + 1}`)

function BrochurePreview() {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [page, setPage] = useState(0)
  const ref = useRef<HTMLButtonElement>(null)
  const visible = useInView(ref, { amount: 0.05 })
  const reduced = useReducedMotion()
  const active = (hovered || focused) && visible
  useEffect(() => {
    if (!active || reduced) return
    const timer = setInterval(() => setPage(value => (value + 1) % brochurePages.length), 900)
    return () => clearInterval(timer)
  }, [active, reduced])
  const current = active ? page : 0
  const next = active && !reduced ? (current + 1) % brochurePages.length : current
  return <figure className="abelian-brochure abelian-brochure-preview">
    <button ref={ref} type="button" className="abelian-media-hover-area" aria-label="Preview brochure: show next page"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setFocused(false); setPage(0) }}
      onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setPage(0) }}
      onClick={() => setPage(value => (value + 1) % brochurePages.length)}>
      <span className="abelian-brochure-book" data-page={current + 1}>
        {brochurePages.map((name, index) => <Image key={name} src={media(name)} alt={`Abelian brochure, page ${index + 1}`} fill sizes="(max-width: 700px) 85vw, 25vw" className={index === next ? "is-active" : ""} aria-hidden={index !== next} />)}
        {active && !reduced && <span key={current} className="abelian-brochure-turn" aria-hidden="true"><Image src={media(brochurePages[current])} alt="" fill sizes="(max-width: 700px) 85vw, 25vw" /></span>}
        <span className="abelian-gallery-cue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 16H3V3h13v2" /><rect x="7" y="7" width="14" height="14" rx="1" /><path d="m8 18 4-4 3 3 2-2 3 3" /></svg></span>
      </span>
    </button>
    <figcaption>BROCHURE<strong>NEW</strong></figcaption>
  </figure>
}

function HoverVideo({ id, thumbnail, title, description }: { id: string; thumbnail: string; title: string; description?: ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const ref = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { amount: 0.05 })
  const active = (hovered || focused) && inView && pageVisible
  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])
  return <figure className={`abelian-hover-video ${active ? "is-playing" : ""}`}>
    <a ref={ref} className="abelian-media-hover-area" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${title} on YouTube (opens in a new tab)`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      <span className="abelian-video-stage">
        <Image src={media(thumbnail)} alt={title} fill sizes="(max-width: 700px) 85vw, 40vw" />
        {active && <iframe title={`${title} preview`} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`} allow="autoplay; encrypted-media" tabIndex={-1} aria-hidden="true" referrerPolicy="strict-origin-when-cross-origin" />}
      </span>
    </a>
    {description && <figcaption className="abelian-video-description">{description}</figcaption>}
  </figure>
}

function SolutionHeading({ number, title, children, node }: { number: string; title: string; children: ReactNode; node: string }) {
  return <AbelianMotion node={node} className="abelian-solution-heading">
    <span className="abelian-solution-number">{number}</span><h3>{title}</h3><p>{children}</p>
  </AbelianMotion>
}

export default function AbelianSolutions() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const fieldVisible = useInView(fieldRef, { amount: 0.05 })
  const reduced = useReducedMotion()
  const [fieldActive, setFieldActive] = useState(0)
  const advanceField = () => setFieldActive(index => (index + 1) % 2)
  useEffect(() => {
    if (!fieldVisible || reduced) return
    const timer = setInterval(() => setFieldActive(index => (index + 1) % 2), 2000)
    return () => clearInterval(timer)
  }, [fieldVisible, reduced])
  return <section id="solutions" className="abelian-solutions abelian-solutions-expanded">
    <header><span>Solutions</span><h2>Forming a highly engaged community that amplifies the brand’s mission and initiatives, each in their own voice.</h2></header>
    <section className="abelian-solution-block">
      <SolutionHeading number="01" title="Community gamification" node="121:28">Designed and ran 9 community games to retain high-interest audiences, managing rules, timelines, budgets, performance tracking, and participant entries and follow-ups.</SolutionHeading>
      <div className="abelian-games-grid">
        <AbelianMotion node="462:371"><HoverGallery title="Abelian Creator Competition" images={["creator-cover", "creator-campaign", "creator-entry"]} /></AbelianMotion>
        <AbelianMotion node="462:372"><HoverGallery title="Flex the mine" images={["mine-cover", "mine-entry-3", "mine-entry-2", "mine-entry-1"]} /></AbelianMotion>
        <AbelianMotion node="464:382"><HoverGallery title="Other games" images={["games-crossword", "games-quiz"]} /></AbelianMotion>
      </div>
    </section>
    <section className="abelian-solution-block">
      <SolutionHeading number="02" title="Content and Paid Campaigns" node="121:32">Created accessible videos, graphics, and articles that made complex topics easier to understand, with publishing coordinated through a content calendar.</SolutionHeading>
      <AbelianMotion node="452:319" className="abelian-content-performance"><p>Performance:</p><ul><li>$0.20 average cost per engagement across paid X campaigns</li><li>4.9% average engagement rate on organic X content for an audience of approximately 20K followers</li></ul></AbelianMotion>
      <AbelianMotion node="464:383" className="abelian-paid-videos">
        <HoverVideo id="3NGqh1HjV5Q" thumbnail="paid-maxpool" title="MaxPool launch" />
        <HoverVideo id="gemCodrJmgc" thumbnail="paid-hardfork" title="Abelian hard fork" />
      </AbelianMotion>
    </section>
    <section className="abelian-solution-block">
      <SolutionHeading number="03" title="Livestreaming" node="121:36">Delivered 22 livestreams to engage new and high-interest audiences, selecting partners to support community acquisition, cross-promotion, product launches, and company announcements.</SolutionHeading>
      <AbelianMotion node="465:406" className="abelian-live-videos">
        <HoverVideo id="TqUMig96GsM" thumbnail="live-discord" title="Product demo on Discord Live" description={<><strong>Product demo on Discord Live</strong> with internal engineering team and community members.</>} />
        <HoverVideo id="2qkGsjL6yOU" thumbnail="live-binance" title="Binance Livestream, AMA" description={<><strong>Binance Livestream, AMA</strong> with the company’s Founder and Marketing Lead.</>} />
        <HoverVideo id="5r_JLEoC4Pw" thumbnail="live-spaces" title="X Spaces" description={<><strong>X Spaces</strong> with external partners.</>} />
      </AbelianMotion>
    </section>
    <section className="abelian-solution-block">
      <SolutionHeading number="04" title="Field Marketing" node="156:690">Created marketing collateral for international community events and conferences.</SolutionHeading>
      <div ref={fieldRef} className="abelian-field-grid">
        <AbelianMotion node="461:364"><HoverGallery activeIndex={fieldActive} onAdvance={advanceField} title="Roll-up banner" images={["banner-after", "banner-before"]} shape="banner" labels={["AFTER", "BEFORE"]} /></AbelianMotion>
        <AbelianMotion node="461:363"><HoverGallery activeIndex={fieldActive} onAdvance={advanceField} title="Tshirt" images={["shirt-after", "shirt-before"]} shape="shirt" labels={["AFTER", "BEFORE"]} /></AbelianMotion>
        <AbelianMotion node="459:358"><BrochurePreview /></AbelianMotion>
      </div>
    </section>
  </section>
}
