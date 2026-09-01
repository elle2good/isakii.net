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

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const headerRef = useRef<HTMLElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })
  const galleryInteractingRef = useRef(false)

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
    const getItemWidth = () => track.firstElementChild?.getBoundingClientRect().width || 1
    const recenter = () => {
      const setWidth = getSetWidth()
      if (!setWidth) return
      if (track.scrollLeft < setWidth * 0.5) track.scrollLeft += setWidth
      if (track.scrollLeft > setWidth * 1.5) track.scrollLeft -= setWidth
    }
    const initialize = () => {
      track.scrollLeft = getSetWidth()
    }
    const frame = requestAnimationFrame(initialize)
    const timer = window.setInterval(() => {
      if (reducedMotion.matches || galleryInteractingRef.current) return
      track.scrollTo({ left: track.scrollLeft + getItemWidth(), behavior: "smooth" })
      window.setTimeout(recenter, 900)
    }, 3200)

    track.addEventListener("scrollend", recenter)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(timer)
      track.removeEventListener("scrollend", recenter)
    }
  }, [])

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track) return
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault()
      track.scrollLeft += event.deltaX
    } else if (event.shiftKey) {
      event.preventDefault()
      track.scrollLeft += event.deltaY
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track) return
    galleryInteractingRef.current = true
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: track.scrollLeft }
    track.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    if (!track || !dragRef.current.active) return
    track.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX)
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current
    dragRef.current.active = false
    if (!track) return
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
    const itemWidth = track.firstElementChild?.getBoundingClientRect().width || 1
    track.scrollTo({ left: Math.round(track.scrollLeft / itemWidth) * itemWidth, behavior: "smooth" })
    window.setTimeout(() => {
      galleryInteractingRef.current = false
    }, 700)
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
        <div className="home-hero-shade" />
      </section>

      <section className="home-gallery" aria-label="Motion gallery">
        <div
          ref={galleryTrackRef}
          id="motion-gallery-track"
          className="home-gallery-track"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={(event) => {
            if (dragRef.current.active) handlePointerEnd(event)
          }}
        >
          {[...galleryImages, ...galleryImages, ...galleryImages].map((src, index) => (
            <div className="home-gallery-image" key={`${src}-${index}`}>
              <Image src={src} alt={`Gallery image ${(index % galleryImages.length) + 1}`} fill sizes="600px" priority={index < 3} />
            </div>
          ))}
        </div>
        <div className="home-gallery-hint" aria-hidden="true">DRAG TO EXPLORE</div>
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
