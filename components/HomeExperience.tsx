"use client"

import Image from "next/image"
import Link from "next/link"
import type Lenis from "lenis"
import { FocusEvent, useCallback, useEffect, useRef, useState } from "react"
import HeroVideo from "./HeroVideo"
import HomeHeader from "./HomeHeader"
import HomeFooter from "./HomeFooter"
import CataloguePreview from "./CataloguePreview"
import MenuContactActions from "./MenuContactActions"
import ExternalBlogLink from "./ExternalBlogLink"
import SmoothScroll from "./SmoothScroll"
import NotificationTicker from "./NotificationTicker"
import { galleryImages } from "@/lib/gallery"
import type { CatalogueItem } from "@/lib/catalogue"

const TOP_CHROME_PEEK_DURATION = 15_000

function cloudinaryVideoSource(source: string) {
  if (!source.includes("/video/upload/")) return source
  const transformed = source.includes("/video/upload/f_webm")
    ? source
    : source.replace("/video/upload/", "/video/upload/f_webm,vc_vp9,q_auto/")
  return transformed.replace(/\.(?:mov|mp4|m4v)(?=$|[?#])/i, ".webm")
}

function ProjectCover({ project, active }: { project: CatalogueItem; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const source = project.coverImage || project.popupImage
  const isVideo = project.coverMediaKind === "video"
  const slug = project.slug.toLowerCase()
  const videoSource =
    slug === "raydium-event"
      ? "/media/raydium-cover-alpha.webm"
      : slug === "beauty-ai-search-engine"
        ? "/media/glamai-cover-alpha.webm"
        : slug === "keytalk-movie-deep-search"
          ? "/media/deepsearch-cover-alpha.webm"
        : cloudinaryVideoSource(source)
  const posterSource =
    slug === "raydium-event"
      ? "/media/raydium-cover-poster.png"
      : slug === "beauty-ai-search-engine"
        ? "/media/glamai-cover-poster.png"
        : slug === "keytalk-movie-deep-search"
          ? "/media/deepsearch-cover-poster.png"
          : undefined
  const className =
    slug === "beauty-ai-search-engine"
      ? "home-project-cover--compact"
      : slug === "keytalk-movie-deep-search"
        ? "home-project-cover--keytalk"
        : undefined

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (active) {
      void video.play().catch(() => undefined)
      return
    }

    video.pause()
    video.currentTime = 0
  }, [active, videoSource])

  if (!source) {
    return (
      <div className="home-project-placeholder" role="img" aria-label={project.coverImageAlt}>
        <span>Coming soon</span>
      </div>
    )
  }

  if (isVideo) {
    return (
      <>
        <video
          ref={videoRef}
          className={`home-project-cover-video ${className ?? ""} ${active ? "is-active" : ""}`}
          src={videoSource}
          poster={posterSource}
          aria-label={project.coverImageAlt}
          muted
          playsInline
          loop
          preload="auto"
          onLoadedData={(event) => {
            if (!active) {
              event.currentTarget.pause()
              event.currentTarget.currentTime = 0
            }
          }}
        />
        {posterSource && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={`home-project-video-poster ${className ?? ""} ${active ? "is-hidden" : ""}`}
            src={posterSource}
            alt=""
            aria-hidden="true"
          />
        )}
      </>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={source} alt={project.coverImageAlt} />
  )
}

function ProjectCard({ project, onOpen }: { project: CatalogueItem; onOpen: (item: CatalogueItem) => void }) {
  const [active, setActive] = useState(false)
  const isComingSoon = project.ctaLabel.toLowerCase().includes("coming soon") || !project.caseStudyUrl
  const coverSource = project.coverImage || project.popupImage

  return (
    <article className="home-project-card">
      <button
        type="button"
        className="home-project-card-link"
        onClick={() => onOpen(project)}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`Preview ${project.title}`}
      >
        <div className="home-project-image">
          <ProjectCover project={project} active={active} />
          {isComingSoon && coverSource && project.coverMediaKind === "image" && (
            // The duplicate preserves the source alpha as a silhouette-only hover mask.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="home-project-object-shade" src={coverSource} alt="" aria-hidden="true" />
          )}
          {isComingSoon && coverSource && <span className="home-project-coming-soon">Coming soon</span>}
        </div>
        <p className="home-project-type">{project.contentType}</p>
        <h3>{project.subtitle || project.title}</h3>
        <p>{project.date}</p>
      </button>
    </article>
  )
}

export default function HomeExperience({ catalogueItems }: { catalogueItems: CatalogueItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [blogExpanded, setBlogExpanded] = useState(false)
  const [topChromeVisible, setTopChromeVisible] = useState(true)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [activeCatalogueItem, setActiveCatalogueItem] = useState<CatalogueItem | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const topChromeRef = useRef<HTMLDivElement>(null)
  const gallerySectionRef = useRef<HTMLElement>(null)
  const projectSectionRef = useRef<HTMLElement>(null)
  const videoSectionRef = useRef<HTMLElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)
  const smoothScrollRef = useRef<Lenis | null>(null)
  const galleryInteractingUntilRef = useRef(0)
  const galleryTimerRef = useRef<number | null>(null)
  const galleryPositionRef = useRef(0)
  const activeGalleryIndexRef = useRef(0)
  const topChromeHideTimerRef = useRef<number | null>(null)
  const topChromeHoveredRef = useRef(false)
  const beyondGalleryRef = useRef(false)
  const overlayOpenRef = useRef(false)
  const cataloguePreviewOpenRef = useRef(false)
  const blogExpandedRef = useRef(false)

  const clearTopChromeHideTimer = useCallback(() => {
    if (topChromeHideTimerRef.current === null) return
    window.clearTimeout(topChromeHideTimerRef.current)
    topChromeHideTimerRef.current = null
  }, [])

  const scheduleTopChromeHide = useCallback(() => {
    clearTopChromeHideTimer()
    topChromeHideTimerRef.current = window.setTimeout(() => {
      if (beyondGalleryRef.current && !topChromeHoveredRef.current && !overlayOpenRef.current) {
        setTopChromeVisible(false)
      }
      topChromeHideTimerRef.current = null
    }, TOP_CHROME_PEEK_DURATION)
  }, [clearTopChromeHideTimer])

  useEffect(() => {
    overlayOpenRef.current = menuOpen || activeCatalogueItem !== null
    cataloguePreviewOpenRef.current = activeCatalogueItem !== null
  }, [activeCatalogueItem, menuOpen])

  useEffect(() => {
    blogExpandedRef.current = blogExpanded
  }, [blogExpanded])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      setBlogExpanded(false)
      setTopChromeVisible(true)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    let previousScrollY = window.scrollY
    let initialized = false

    const updateTopChrome = () => {
      const gallery = gallerySectionRef.current
      const topChrome = topChromeRef.current
      if (!gallery || !topChrome) return

      const beyondGallery = gallery.getBoundingClientRect().top <= window.innerHeight / 2
      const galleryRect = gallery.getBoundingClientRect()
      const chromeHeight = topChrome.getBoundingClientRect().height
      const galleryCollidesWithChrome = galleryRect.top < chromeHeight && galleryRect.bottom > 0
      const delta = window.scrollY - previousScrollY
      beyondGalleryRef.current = beyondGallery

      if (blogExpandedRef.current || cataloguePreviewOpenRef.current) {
        clearTopChromeHideTimer()
        setTopChromeVisible(false)
      } else if (galleryCollidesWithChrome) {
        clearTopChromeHideTimer()
        setTopChromeVisible(false)
      } else if (!beyondGallery || overlayOpenRef.current) {
        clearTopChromeHideTimer()
        setTopChromeVisible(true)
      } else if (!initialized) {
        setTopChromeVisible(false)
      } else if (delta < -2) {
        setTopChromeVisible(true)
        scheduleTopChromeHide()
      } else if (delta > 2 && !topChromeHoveredRef.current) {
        clearTopChromeHideTimer()
        setTopChromeVisible(false)
      }

      previousScrollY = window.scrollY
      initialized = true
    }

    updateTopChrome()
    window.addEventListener("scroll", updateTopChrome, { passive: true })
    window.addEventListener("resize", updateTopChrome)
    return () => {
      window.removeEventListener("scroll", updateTopChrome)
      window.removeEventListener("resize", updateTopChrome)
      clearTopChromeHideTimer()
    }
  }, [clearTopChromeHideTimer, scheduleTopChromeHide])

  useEffect(() => {
    let previousScrollY = window.scrollY
    let upwardScroll = false
    let snapTimer: number | null = null
    let snapReleaseTimer: number | null = null
    let snapping = false

    const clearSnapTimer = () => {
      if (snapTimer === null) return
      window.clearTimeout(snapTimer)
      snapTimer = null
    }

    const clearSnapReleaseTimer = () => {
      if (snapReleaseTimer === null) return
      window.clearTimeout(snapReleaseTimer)
      snapReleaseTimer = null
    }

    const getDocumentTop = (element: HTMLElement) =>
      window.scrollY + element.getBoundingClientRect().top

    const snapToNearestSection = () => {
      snapTimer = null
      if (!upwardScroll || snapping || overlayOpenRef.current) return

      const gallery = gallerySectionRef.current
      const projects = projectSectionRef.current
      const video = videoSectionRef.current
      const topChrome = topChromeRef.current
      const lenis = smoothScrollRef.current
      if (!gallery || !projects || !video || !topChrome || !lenis) return

      const galleryTop = getDocumentTop(gallery)
      const chromeHeight = topChrome.getBoundingClientRect().height
      const snapPoints = [
        { position: Math.max(0, galleryTop - chromeHeight), showTopChrome: true },
        { position: galleryTop, showTopChrome: false },
        { position: getDocumentTop(projects), showTopChrome: false },
        { position: getDocumentTop(video), showTopChrome: false },
      ]
      const currentScrollY = window.scrollY
      const nearestPoint = snapPoints.reduce((nearest, candidate) =>
        Math.abs(candidate.position - currentScrollY) < Math.abs(nearest.position - currentScrollY)
          ? candidate
          : nearest,
      )
      const nearestTarget = nearestPoint.position
      const snapRange = Math.min(window.innerHeight * 0.42, 380)
      const distanceToTarget = Math.abs(nearestTarget - currentScrollY)
      if (distanceToTarget < 3) {
        setTopChromeVisible(nearestPoint.showTopChrome)
        return
      }
      if (distanceToTarget > snapRange) return

      snapping = true
      clearSnapReleaseTimer()
      setTopChromeVisible(nearestPoint.showTopChrome)
      lenis.scrollTo(nearestTarget, {
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.72,
        force: true,
        lock: true,
        onComplete: () => {
          snapping = false
          previousScrollY = window.scrollY
          setTopChromeVisible(nearestPoint.showTopChrome)
        },
      })
      snapReleaseTimer = window.setTimeout(() => {
        snapping = false
        snapReleaseTimer = null
      }, 900)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - previousScrollY
      if (!snapping && Math.abs(delta) > 1) upwardScroll = delta < 0
      previousScrollY = currentScrollY

      clearSnapTimer()
      if (!snapping && upwardScroll) {
        snapTimer = window.setTimeout(snapToNearestSection, 150)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearSnapTimer()
      clearSnapReleaseTimer()
    }
  }, [])

  useEffect(() => {
    const track = galleryTrackRef.current
    if (!track) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const getSetWidth = () => track.scrollWidth / 3
    const updateProgress = () => {
      const setWidth = getSetWidth()
      const itemWidth = setWidth / galleryImages.length
      if (!setWidth || !itemWidth) return
      const normalizedPosition = ((galleryPositionRef.current % setWidth) + setWidth) % setWidth
      const nextIndex = Math.floor((normalizedPosition + itemWidth / 2) / itemWidth) % galleryImages.length
      if (nextIndex === activeGalleryIndexRef.current) return
      activeGalleryIndexRef.current = nextIndex
      setActiveGalleryIndex(nextIndex)
    }
    const recenter = () => {
      const setWidth = getSetWidth()
      if (!setWidth) return
      if (galleryPositionRef.current < setWidth * 0.5) galleryPositionRef.current += setWidth
      if (galleryPositionRef.current > setWidth * 1.5) galleryPositionRef.current -= setWidth
      track.scrollLeft = galleryPositionRef.current
      updateProgress()
    }
    const initialize = () => {
      galleryPositionRef.current = getSetWidth()
      track.scrollLeft = galleryPositionRef.current
      activeGalleryIndexRef.current = 0
      setActiveGalleryIndex(0)
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

    const handleGalleryWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()
      galleryInteractingUntilRef.current = performance.now() + 700
      const wheelDistance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      galleryPositionRef.current = track.scrollLeft + wheelDistance
      recenter()
    }

    if (galleryTimerRef.current !== null) window.clearInterval(galleryTimerRef.current)
    const timer = window.setInterval(advance, 16)
    galleryTimerRef.current = timer
    track.addEventListener("wheel", handleGalleryWheel, { passive: false })
    return () => {
      cancelAnimationFrame(initializeFrame)
      window.clearInterval(timer)
      track.removeEventListener("wheel", handleGalleryWheel)
      if (galleryTimerRef.current === timer) galleryTimerRef.current = null
    }
  }, [])

  const handleTopChromePointerEnter = () => {
    topChromeHoveredRef.current = true
    clearTopChromeHideTimer()
    setTopChromeVisible(true)
  }

  const handleTopChromePointerLeave = () => {
    topChromeHoveredRef.current = false
    if (beyondGalleryRef.current && !overlayOpenRef.current) scheduleTopChromeHide()
  }

  const handleTopChromeInteraction = () => {
    setTopChromeVisible(true)
    if (beyondGalleryRef.current && !topChromeHoveredRef.current) scheduleTopChromeHide()
  }

  const handleTopChromeBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    if (beyondGalleryRef.current && !topChromeHoveredRef.current && !overlayOpenRef.current) {
      scheduleTopChromeHide()
    }
  }

  const closeOverlays = () => {
    setMenuOpen(false)
    setBlogExpanded(false)
    setTopChromeVisible(true)
  }

  const toggleBlogAccordion = () => {
    clearTopChromeHideTimer()
    setBlogExpanded((value) => {
      const nextValue = !value
      blogExpandedRef.current = nextValue
      setTopChromeVisible(!nextValue)
      return nextValue
    })
  }

  const openCatalogueItem = (item: CatalogueItem) => {
    clearTopChromeHideTimer()
    cataloguePreviewOpenRef.current = true
    setTopChromeVisible(false)
    setActiveCatalogueItem(item)
  }

  const closeCatalogueItem = () => {
    cataloguePreviewOpenRef.current = false
    setActiveCatalogueItem(null)
    setTopChromeVisible(true)
  }

  const handleSmoothScrollReady = useCallback((lenis: Lenis | null) => {
    smoothScrollRef.current = lenis
  }, [])

  return (
    <main className="home-page">
      <SmoothScroll intensity={10} onReady={handleSmoothScrollReady} />
      <div
        ref={topChromeRef}
        className={`home-top-chrome ${topChromeVisible ? "is-visible" : "is-hidden"}`}
        onPointerEnter={handleTopChromePointerEnter}
        onPointerLeave={handleTopChromePointerLeave}
        onPointerDownCapture={handleTopChromeInteraction}
        onFocusCapture={handleTopChromeInteraction}
        onBlurCapture={handleTopChromeBlur}
      >
        <HomeHeader
          ref={headerRef}
          menuOpen={menuOpen}
          onToggleMenu={() => {
            clearTopChromeHideTimer()
            setTopChromeVisible(true)
            setMenuOpen((value) => {
              if (value) setBlogExpanded(false)
              return !value
            })
          }}
        />

        <NotificationTicker />
      </div>

      <div id="overlay">
        {menuOpen && (
          <>
          <div className="home-menu-scrim" aria-hidden="true" onClick={closeOverlays} />
          <div
            className={`home-menu-overlay is-open ${blogExpanded ? "has-blog-expanded" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <button
              type="button"
              className="home-menu-close"
              onClick={closeOverlays}
              aria-label="Close menu"
            >
              x
            </button>
            <nav aria-label="Explore">
              <Link className="home-menu-link" href="/about" onClick={closeOverlays}>about</Link>
              <div className={`home-menu-accordion ${blogExpanded ? "is-expanded" : ""}`}>
                <button
                  type="button"
                  className="home-menu-accordion-trigger"
                  aria-expanded={blogExpanded}
                  aria-controls="home-blog-submenu"
                  onClick={toggleBlogAccordion}
                >
                  <span>blog</span>
                  <span className="home-menu-accordion-arrow" aria-hidden="true" />
                </button>
                <div id="home-blog-submenu" className="home-menu-submenu" aria-hidden={!blogExpanded}>
                  <ExternalBlogLink href="https://isegye.substack.com" tabIndex={blogExpanded ? 0 : -1} onOpen={closeOverlays}>
                    <span className="home-menu-submenu-label">English</span>
                    <span className="home-menu-submenu-arrow" aria-hidden="true" />
                  </ExternalBlogLink>
                  <ExternalBlogLink href="https://brunch.co.kr/@isakii" tabIndex={blogExpanded ? 0 : -1} onOpen={closeOverlays}>
                    <span className="home-menu-submenu-label">Korean</span>
                    <span className="home-menu-submenu-arrow" aria-hidden="true" />
                  </ExternalBlogLink>
                  <ExternalBlogLink href="https://medium.com/@iskaii" tabIndex={blogExpanded ? 0 : -1} onOpen={closeOverlays}>
                    <span className="home-menu-submenu-label">Archive</span>
                    <span className="home-menu-submenu-arrow" aria-hidden="true" />
                  </ExternalBlogLink>
                </div>
              </div>
              <Link className="home-menu-link" href="/#projects" onClick={closeOverlays}>catalogue</Link>
              <Link className="home-menu-link" href="/" onClick={closeOverlays}>home</Link>
            </nav>
            <MenuContactActions />
          </div>
          </>
        )}
      </div>

      <CataloguePreview
        item={activeCatalogueItem}
        items={catalogueItems}
        onClose={closeCatalogueItem}
        onSelect={setActiveCatalogueItem}
      />

      <section id="hero-video-opening" className="home-hero">
        <HeroVideo />
      </section>

      <section ref={gallerySectionRef} className="home-gallery" aria-label="Motion gallery">
        <div
          ref={galleryTrackRef}
          id="motion-gallery-track"
          className="home-gallery-track"
          data-lenis-prevent
        >
          {[...galleryImages, ...galleryImages, ...galleryImages].map((record, index) => (
            <div className="home-gallery-image" key={`${record.id}-${index}`}>
              {record.image.startsWith("/") ? (
                <Image src={record.image} alt={record.alt} fill sizes="600px" priority={index < 3} />
              ) : (
                // External database links remain browser-fetched so the database can use any image host.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={record.image} alt={record.alt} loading={index < 3 ? "eager" : "lazy"} />
              )}
            </div>
          ))}
        </div>
        <div className="home-gallery-progress" aria-label={`Gallery image ${activeGalleryIndex + 1} of ${galleryImages.length}`}>
          {galleryImages.map((record, index) => (
            <span
              className={index === activeGalleryIndex ? "is-active" : ""}
              key={record.id}
              aria-hidden="true"
            />
          ))}
        </div>
      </section>

      <section ref={projectSectionRef} id="project-section" className="home-projects">
        <h2 id="projects">Project</h2>
        <div className="home-project-grid">
          {catalogueItems.map((project) => (
            <ProjectCard project={project} onOpen={openCatalogueItem} key={project.id} />
          ))}
        </div>
        <button
          type="button"
          className="home-catalogue-link"
          aria-disabled="true"
          aria-label="Catalogue coming soon"
        >
          <span className="home-catalogue-labels" aria-hidden="true">
            <span className="home-catalogue-label-default">VIEW CATALOGUE</span>
            <span className="home-catalogue-label-coming">MORE COMING SOON</span>
          </span>
          <span className="home-catalogue-arrow" aria-hidden="true">→</span>
        </button>
      </section>

      <section ref={videoSectionRef} id="featured-video" className="home-video-feature" aria-labelledby="home-video-title">
        <div className="home-video-feature-inner">
          <h2 id="home-video-title" className="sr-only">Featured video</h2>
          <iframe
            src="https://www.youtube-nocookie.com/embed/7DKR5bhmWPc?rel=0&modestbranding=1"
            title="Featured isakii video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <HomeFooter />
    </main>
  )
}
