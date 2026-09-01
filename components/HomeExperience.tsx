"use client"

import Image from "next/image"
import Link from "next/link"
import { PointerEvent, WheelEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import HeroVideo from "./HeroVideo"
import HomeHeader from "./HomeHeader"
import SmoothScroll from "./SmoothScroll"

const galleryImages = Array.from({ length: 8 }, (_, index) =>
  `/home/gallery/${String(index + 1).padStart(2, "0")}.jpg`,
)

const projects = [
  { title: "Afterimage", date: "2026.01", image: "/home/projects/afterimage.jpg" },
  { title: "Hourglass", date: "2025.11", image: "/home/projects/hourglass.jpg" },
  { title: "Night Motel", date: "2025.08", image: "/home/projects/night-motel.jpg" },
  { title: "Soft Static", date: "2025.04", image: "/home/projects/soft-static.jpg" },
  { title: "Blue Room", date: "2024.12", image: "/home/projects/blue-room.jpg" },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)
  const projectRef = useRef<HTMLElement>(null)
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })

  useLayoutEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [menuOpen])

  useEffect(() => {
    let animationFrame = 0
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const update = () => {
      const hero = heroRef.current
      const gallery = galleryRef.current
      const project = projectRef.current
      if (!hero || !gallery || !project) {
        animationFrame = requestAnimationFrame(update)
        return
      }

      const viewportHeight = window.innerHeight || 1
      const heroRect = hero.getBoundingClientRect()
      const galleryRect = gallery.getBoundingClientRect()
      const projectRect = project.getBoundingClientRect()
      const galleryEnter = clamp(
        (viewportHeight - galleryRect.top) / (viewportHeight + galleryRect.height),
        0,
        1,
      )
      const projectEnter = clamp(
        (viewportHeight - projectRect.top) / (viewportHeight + projectRect.height),
        0,
        1,
      )
      const progress = clamp(galleryEnter * (1 - projectEnter), 0, 1)
      const galleryIsRelevant =
        galleryRect.top < viewportHeight &&
        galleryRect.bottom > 0 &&
        heroRect.bottom > 0 &&
        projectRect.top > 0
      const galleryActive =
        galleryRect.top < viewportHeight * 0.9 &&
        galleryRect.bottom > viewportHeight * 0.15 &&
        projectRect.top > 0

      const lift = galleryIsRelevant ? -84 * progress : 0
      const hide = galleryActive ? -120 * progress : 0
      const finalLift = reducedMotion.matches ? (galleryIsRelevant ? -84 : 0) : lift
      const finalHide = reducedMotion.matches ? (galleryActive ? -120 : 0) : hide

      gallery.style.setProperty("--gallery-lift", `${finalLift}px`)
      headerRef.current?.style.setProperty("--header-lift", `${finalHide}px`)
      tickerRef.current?.style.setProperty("--ticker-lift", `${finalHide}px`)
      animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track) return
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault()
      track.scrollLeft += event.deltaY * 0.5
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track) return
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: track.scrollLeft }
    track.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track || !dragRef.current.active) return
    track.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX)
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false
    galleryTrackRef.current?.releasePointerCapture(event.pointerId)
  }

  return (
    <main className="home-page">
      <SmoothScroll intensity={10} />
      <HomeHeader
        ref={headerRef}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((value) => !value)}
      />

      <div id="overlay">
        {menuOpen && (
          <div className="home-menu-overlay is-open">
            <nav aria-label="Explore">
              <p>EXPLORE</p>
              <Link href="#projects" onClick={() => setMenuOpen(false)}>CATALOGUE</Link>
              <Link href="/work" onClick={() => setMenuOpen(false)}>BLOG</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
              <span>COMING SOON</span>
              <p>CONTACT</p>
              <a href="mailto:smkim@isakii.net">smkim@isakii.net</a>
            </nav>
          </div>
        )}
      </div>

      <section ref={heroRef} id="hero-video-opening" className="home-hero">
        <HeroVideo />
        <div className="home-hero-shade" />
      </section>

      <div ref={tickerRef} className="home-ticker" aria-label="Promotion">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}>USE CODE: youdabest <b aria-hidden="true">→</b></span>
        ))}
      </div>

      <section ref={galleryRef} className="home-gallery" aria-label="Motion gallery">
        <div
          ref={galleryTrackRef}
          id="motion-gallery-track"
          className="home-gallery-track"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          {galleryImages.map((src, index) => (
            <div className="home-gallery-image" key={src}>
              <Image src={src} alt={`Gallery image ${index + 1}`} fill sizes="600px" priority={index < 3} />
            </div>
          ))}
        </div>
        <div className="home-gallery-hint" aria-hidden="true">DRAG TO EXPLORE</div>
      </section>

      <section ref={projectRef} id="project-section" className="home-projects">
        <h2 id="projects">Project</h2>
        <div className="home-project-grid">
          {projects.map((project) => (
            <article className="home-project-card" key={project.title}>
              <div className="home-project-image">
                <Image src={project.image} alt="" fill sizes="(max-width: 700px) 80vw, 240px" />
              </div>
              <h3>{project.title}</h3>
              <p>{project.date}</p>
            </article>
          ))}
        </div>
        <a className="home-catalogue-link" href="#projects">
          VIEW CATALOGUE <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
}
