"use client"

import Image from "next/image"
import Link from "next/link"
import { WheelEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
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

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const headerRef = useRef<HTMLElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)
  const galleryInteractingUntilRef = useRef(0)
  const galleryTimerRef = useRef<number | null>(null)
  const galleryPositionRef = useRef(0)

  useLayoutEffect(() => {
    document.documentElement.style.overflow = menuOpen || searchOpen ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [menuOpen, searchOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      setSearchOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const track = galleryTrackRef.current
    if (!track) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const getSetWidth = () => track.scrollWidth / 3
    const recenter = () => {
      const setWidth = getSetWidth()
      if (!setWidth) return
      if (galleryPositionRef.current < setWidth * 0.5) galleryPositionRef.current += setWidth
      if (galleryPositionRef.current > setWidth * 1.5) galleryPositionRef.current -= setWidth
      track.scrollLeft = galleryPositionRef.current
    }
    const initialize = () => {
      galleryPositionRef.current = getSetWidth()
      track.scrollLeft = galleryPositionRef.current
    }
    const initializeFrame = requestAnimationFrame(initialize)
    let previousTime = performance.now()

    const advance = () => {
      const time = performance.now()
      const elapsed = Math.min(time - previousTime, 64)
      previousTime = time

      if (!reducedMotion.matches && time >= galleryInteractingUntilRef.current) {
        const ticker = document.querySelector<HTMLElement>(".home-ticker-track")
        if (ticker) {
          const duration = Number.parseFloat(getComputedStyle(ticker).animationDuration) || 48
          const pixelsPerSecond = (ticker.scrollWidth / 2) / duration
          galleryPositionRef.current += pixelsPerSecond * (elapsed / 1000)
          recenter()
        }
      }
    }

    if (galleryTimerRef.current !== null) window.clearInterval(galleryTimerRef.current)
    const timer = window.setInterval(advance, 16)
    galleryTimerRef.current = timer
    return () => {
      cancelAnimationFrame(initializeFrame)
      window.clearInterval(timer)
      if (galleryTimerRef.current === timer) galleryTimerRef.current = null
    }
  }, [])

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track) return
    event.preventDefault()
    galleryInteractingUntilRef.current = performance.now() + 700
    galleryPositionRef.current = track.scrollLeft + event.deltaX + event.deltaY

    const setWidth = track.scrollWidth / 3
    if (galleryPositionRef.current < setWidth * 0.5) galleryPositionRef.current += setWidth
    if (galleryPositionRef.current > setWidth * 1.5) galleryPositionRef.current -= setWidth
    track.scrollLeft = galleryPositionRef.current
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  )

  const closeOverlays = () => {
    setMenuOpen(false)
    setSearchOpen(false)
  }

  return (
    <main className="home-page">
      <SmoothScroll intensity={10} />
      <HomeHeader
        ref={headerRef}
        menuOpen={menuOpen}
        onToggleMenu={() => {
          setSearchOpen(false)
          setMenuOpen((value) => !value)
        }}
        onOpenSearch={() => {
          setMenuOpen(false)
          setSearchOpen(true)
        }}
      />

      <div id="overlay">
        {menuOpen && (
          <div className="home-menu-overlay is-open">
            <nav aria-label="Explore">
              <Link className="home-menu-link" href="/about" onClick={() => setMenuOpen(false)}>about</Link>
              <Link className="home-menu-link" href="/work" onClick={() => setMenuOpen(false)}>blog</Link>
              <Link className="home-menu-link" href="#projects" onClick={() => setMenuOpen(false)}>catalogue</Link>
              <Link className="home-menu-link" href="/coming-soon" onClick={() => setMenuOpen(false)}>coming soon</Link>
            </nav>
            <a className="home-menu-contact" href="mailto:smkim@isakii.net">
              <span aria-hidden="true">&#9993;</span>
              <span>smkim@isakii.net</span>
              <span className="home-menu-contact-arrow" aria-hidden="true">&#8599;</span>
            </a>
          </div>
        )}
      </div>

      {searchOpen && (
        <div className="home-search-overlay" role="dialog" aria-modal="true" aria-label="Search projects">
          <button type="button" className="home-search-close" onClick={closeOverlays} aria-label="Close search">×</button>
          <label htmlFor="home-search">SEARCH</label>
          <input
            id="home-search"
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="TYPE A PROJECT NAME"
          />
          <div className="home-search-results">
            {(searchQuery ? filteredProjects : projects).map((project) => (
              <a href="#projects" key={project.title} onClick={closeOverlays}>
                <span>{project.title}</span><small>{project.date}</small>
              </a>
            ))}
            {searchQuery && filteredProjects.length === 0 && <p>NO PROJECTS FOUND</p>}
          </div>
        </div>
      )}

      <div className="home-ticker" aria-label="Promotion">
        <div className="home-ticker-track">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index}>USE CODE: youdabest <b aria-hidden="true">→</b></span>
          ))}
        </div>
      </div>

      <section id="hero-video-opening" className="home-hero">
        <HeroVideo />
      </section>

      <section className="home-gallery" aria-label="Motion gallery">
        <div
          ref={galleryTrackRef}
          id="motion-gallery-track"
          className="home-gallery-track"
          onWheel={handleWheel}
        >
          {[...galleryImages, ...galleryImages, ...galleryImages].map((src, index) => (
            <div className="home-gallery-image" key={`${src}-${index}`}>
              <Image src={src} alt={`Gallery image ${(index % galleryImages.length) + 1}`} fill sizes="600px" priority={index < 3} />
            </div>
          ))}
        </div>
        <div className="home-gallery-hint" aria-hidden="true">SCROLL TO EXPLORE</div>
      </section>

      <section id="project-section" className="home-projects">
        <h2 id="projects">Project</h2>
        <div className="home-project-grid">
          {projects.map((project) => (
            <article className="home-project-card" key={project.title}>
              <Link className="home-project-card-link" href="/work" aria-label={`View ${project.title}`}>
              <div className="home-project-image">
                <Image src={project.image} alt="" fill sizes="(max-width: 700px) 80vw, 240px" />
              </div>
              <h3>{project.title}</h3>
              <p>{project.date}</p>
              </Link>
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
