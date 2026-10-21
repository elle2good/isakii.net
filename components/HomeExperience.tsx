"use client"

import Image from "next/image"
import Link from "next/link"
import type Lenis from "lenis"
import { FocusEvent, memo, useCallback, useEffect, useRef, useState } from "react"
import HeroVideo from "./HeroVideo"
import HomeHeader from "./HomeHeader"
import HomeFooter from "./HomeFooter"
import ConsultationSection from "./ConsultationSection"
import CataloguePreview from "./CataloguePreview"
import MenuContactActions from "./MenuContactActions"
import ExternalBlogLink from "./ExternalBlogLink"
import SmoothScroll from "./SmoothScroll"
import NotificationTicker from "./NotificationTicker"
import useMobileViewport from "./useMobileViewport"
import useCardExperiment from "./useCardExperiment"
import { trackCardEvent } from "@/lib/cardExperiment"
import { galleryImages } from "@/lib/gallery"
import { imageDelivery } from "@/lib/media"
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
  const mobile = useMobileViewport()
  const videoRef = useRef<HTMLVideoElement>(null)
  const source = (mobile && project.mobileCoverImage) || project.coverImage || project.popupImage
  const isVideo = (mobile && project.mobileCoverMediaKind ? project.mobileCoverMediaKind : project.coverMediaKind) === "video"
  const slug = project.slug.toLowerCase()
  const videoSource =
    mobile && project.mobileCoverImage && project.mobileCoverImage !== project.coverImage ? cloudinaryVideoSource(source) : slug === "raydium-event"
      ? "/media/raydium-cover-alpha.webm"
      : slug === "beauty-ai-search-engine"
        ? "/media/glamai-cover-alpha.webm"
        : slug === "keytalk-movie-deep-search"
          ? "/media/deepsearch-cover-alpha.webm"
        : cloudinaryVideoSource(source)
  const posterSource =
    mobile && project.mobileCoverImage && project.mobileCoverImage !== project.coverImage ? undefined : slug === "raydium-event"
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
          src={active || !posterSource ? videoSource : undefined}
          poster={posterSource}
          aria-label={project.coverImageAlt}
          muted
          playsInline
          loop
          preload={active ? "auto" : posterSource ? "none" : "metadata"}
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
            loading="lazy"
            decoding="async"
            alt=""
            aria-hidden="true"
          />
        )}
      </>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...imageDelivery(source, "(max-width: 700px) 90vw, 420px")} alt={project.coverImageAlt} loading="lazy" decoding="async" />
  )
}

const ProjectCard = memo(function ProjectCard({ project, onOpen, directNavigation, onInteract }: { project: CatalogueItem; onOpen: (item: CatalogueItem) => void; directNavigation: boolean; onInteract: (eligible: boolean) => void }) {
  const [active, setActive] = useState(false)
  const isComingSoon = project.ctaLabel.toLowerCase().includes("coming soon") || !project.caseStudyUrl
  const coverSource = project.coverImage || project.popupImage
  const opensDirectly = directNavigation && !isComingSoon
  const CardAction = opensDirectly ? "a" : "button"

  return (
    <article className="home-project-card" data-case-study={!isComingSoon && project.caseStudyUrl.startsWith("/catalogue/")}>
      <CardAction
        type={opensDirectly ? undefined : "button"}
        href={opensDirectly ? project.caseStudyUrl : undefined}
        className="home-project-card-link"
        onClick={() => {
          onInteract(!isComingSoon && project.caseStudyUrl.startsWith("/catalogue/"))
          if (!opensDirectly) onOpen(project)
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`${opensDirectly ? "Read" : "Preview"} ${project.title}`}
      >
        <div className={`home-project-image ${project.id === "b6a7f66e-bea3-41b3-b053-115ebfe9abbd" ? "home-project-image--algorand" : ""}`}>
          <ProjectCover project={project} active={active} />
          {isComingSoon && coverSource && project.coverMediaKind === "image" && (
            // The duplicate preserves the source alpha as a silhouette-only hover mask.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="home-project-object-shade" {...imageDelivery(coverSource, "(max-width: 700px) 90vw, 420px")} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          )}
          {isComingSoon && coverSource && <span className="home-project-coming-soon">Coming soon</span>}
        </div>
        <p className="home-project-type">{project.contentType}</p>
        <h3>{project.subtitle || project.title}</h3>
        <p>{[project.companyName, project.date].filter(Boolean).join(" | ")}</p>
      </CardAction>
      {!isComingSoon && (
        <a
          className="home-project-read-link"
          href={project.caseStudyUrl}
          onClick={() => onInteract(project.caseStudyUrl.startsWith("/catalogue/"))}
          aria-label={`${project.contentType.toLowerCase().includes("press release") ? "Read press release" : "Read case study"}: ${project.title}`}
        >
          {project.contentType.toLowerCase().includes("press release") ? "Read press release" : "Read case study"}
        </a>
      )}
    </article>
  )
})

export default function HomeExperience({ catalogueItems, initialPreviewSlug, directNavigation = false, initialSection }: {
  catalogueItems: CatalogueItem[]
  initialPreviewSlug?: string
  directNavigation?: boolean
  initialSection?: string
}) {
  const initialPreview = catalogueItems.find(item => item.slug.toLowerCase() === initialPreviewSlug?.toLowerCase()) ?? null
  const orderedCatalogueItems = catalogueItems.filter(item => item.order > 0).sort((a, b) => a.order - b.order)
  const mobileCatalogue = useMobileViewport()
  const [catalogueExpanded, setCatalogueExpanded] = useState(false)
  const [catalogueShifted, setCatalogueShifted] = useState(false)
  const catalogueOffset = !mobileCatalogue && catalogueShifted && orderedCatalogueItems.length > 5 ? 1 : 0
  const [menuOpen, setMenuOpen] = useState(false)
  const [ctaScrolling, setCtaScrolling] = useState(false)
  const [consultationInView, setConsultationInView] = useState(false)
  const [landingReady, setLandingReady] = useState(!initialSection)

  useEffect(() => {
    const section = document.querySelector(".home-consultation")
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      setConsultationInView(entry.isIntersecting)
    }, { rootMargin: "-96px 0px 0px 0px", threshold: 0 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      if (!window.matchMedia("(max-width: 700px)").matches) return
      setCtaScrolling(true)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setCtaScrolling(false), 350)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      clearTimeout(idleTimer)
    }
  }, [])

  const [blogExpanded, setBlogExpanded] = useState(false)
  const [topChromeVisible, setTopChromeVisible] = useState(!initialPreview)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [activeCatalogueItem, setActiveCatalogueItem] = useState<CatalogueItem | null>(initialPreview)
  const headerRef = useRef<HTMLElement>(null)
  const topChromeRef = useRef<HTMLDivElement>(null)
  const gallerySectionRef = useRef<HTMLElement>(null)
  const projectSectionRef = useRef<HTMLElement>(null)
  const cardExperiment = useCardExperiment(projectSectionRef, Boolean(initialPreviewSlug))
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

      if (window.matchMedia("(max-width: 700px)").matches) {
        clearTopChromeHideTimer()
        beyondGalleryRef.current = false
        setTopChromeVisible(true)
        const projectsTop = projectSectionRef.current?.getBoundingClientRect().top ?? window.innerHeight
        const tickerHeight = topChrome.querySelector<HTMLElement>(".home-ticker")?.offsetHeight ?? 37
        const shift = Math.min(tickerHeight, Math.max(0, topChrome.offsetHeight - projectsTop))
        topChrome.style.setProperty("--mobile-ticker-shift", `${-shift}px`)
        previousScrollY = window.scrollY
        initialized = true
        return
      }

      const galleryRect = gallery.getBoundingClientRect()
      const beyondGallery = galleryRect.top <= window.innerHeight / 2
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
    const ticker = document.querySelector<HTMLElement>(".home-ticker-track")
    let setWidth = 0
    let pixelsPerSecond = 0
    let galleryVisible = false
    const measureGallery = () => {
      galleryVisible = track.getClientRects().length > 0
      setWidth = galleryVisible ? track.scrollWidth / 3 : 0
      const duration = ticker ? Number.parseFloat(getComputedStyle(ticker).animationDuration) || 48 : 48
      pixelsPerSecond = ticker ? ticker.scrollWidth / 2 / duration : 0
    }
    measureGallery()
    const sizeObserver = new ResizeObserver(measureGallery)
    sizeObserver.observe(track)
    if (ticker) sizeObserver.observe(ticker)
    window.addEventListener("resize", measureGallery)
    const getSetWidth = () => setWidth
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

      if (!document.hidden && galleryVisible && !reducedMotion.matches && time >= galleryInteractingUntilRef.current) {
        if (pixelsPerSecond) {
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
      sizeObserver.disconnect()
      window.removeEventListener("resize", measureGallery)
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

  const openCatalogueItem = useCallback((item: CatalogueItem) => {
    void trackCardEvent("preview_open", { slug: item.slug })
    clearTopChromeHideTimer()
    cataloguePreviewOpenRef.current = true
    setTopChromeVisible(false)
    setActiveCatalogueItem(item)
  }, [clearTopChromeHideTimer])

  const closeCatalogueItem = () => {
    const url = new URL(window.location.href)
    if (url.searchParams.has("preview")) {
      url.searchParams.delete("preview")
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
    }
    cataloguePreviewOpenRef.current = false
    setActiveCatalogueItem(null)
    setTopChromeVisible(true)
  }

  const handleSmoothScrollReady = useCallback((lenis: Lenis | null) => {
    smoothScrollRef.current = lenis
  }, [])

  useEffect(() => {
    if (!initialSection) return
    // Fonts can change the height of the catalogue above this section.
    let cancelled = false
    let frame = 0
    void document.fonts.ready.then(() => {
      if (cancelled) return
      frame = requestAnimationFrame(() => {
        const section = document.getElementById(window.location.hash.slice(1) || initialSection)
        const lenis = smoothScrollRef.current
        if (section) {
          if (lenis) {
            lenis.resize()
            lenis.scrollTo(section, { immediate: true, force: true })
          } else {
            section.scrollIntoView({ behavior: "instant", block: "start" })
          }
        }
        // Reveal only once the browser has applied the landing position.
        frame = requestAnimationFrame(() => setLandingReady(true))
      })
    })
    return () => { cancelled = true; cancelAnimationFrame(frame) }
  }, [initialSection])

  return (
    <main className={`home-page${initialSection ? " home-section-landing" : ""}${!landingReady ? " is-landing-pending" : ""}`}>
      {initialSection && <noscript><style>{`.home-page.is-landing-pending > * { visibility:visible; } .home-page.is-landing-pending::after { display:none; }`}</style></noscript>}
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

        <div className="home-notification-slot"><NotificationTicker /></div>
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
              <Link className="home-menu-link" href="/#projects" onNavigate={(event) => {
                event.preventDefault()
                closeOverlays()
                if (window.location.hash !== "#projects") window.history.pushState(null, "", "/#projects")
                requestAnimationFrame(() => {
                  const section = projectSectionRef.current
                  if (!section) return
                  const lenis = smoothScrollRef.current
                  if (lenis) {
                    lenis.start()
                    lenis.resize()
                    lenis.scrollTo(section, { immediate: true, force: true })
                  } else {
                    section.scrollIntoView({ block: "start", behavior: "instant" })
                  }
                  clearTopChromeHideTimer()
                  setTopChromeVisible(false)
                })
              }}>catalogue</Link>
              <Link className="home-menu-link" href="/" onClick={closeOverlays}>home</Link>
            </nav>
            <MenuContactActions />
          </div>
          </>
        )}
      </div>

      <CataloguePreview
        item={activeCatalogueItem}
        items={orderedCatalogueItems}
        onClose={closeCatalogueItem}
        onSelect={setActiveCatalogueItem}
      />

      <section id="hero-video-opening" className="home-hero">
        <HeroVideo />
        <div className="home-hero-message">
          <h1 aria-label="The Human Agent for Relationships">
            <picture>
              <source media="(max-width: 700px)" srcSet="/home/human-agent-mobile.png" />
              <img src="/home/human-agent-desktop.png" alt="The Human Agent for Relationships" />
            </picture>
          </h1>
          <h2>Attract the right leads and turn them into customers, advocates, partners and more.</h2>
          <a className="home-hero-cta" href="https://calendar.app.google/rq7PqiSkYUWpw1ADA" target="_blank" rel="noopener noreferrer"><span>Get Started</span></a>
        </div>
      </section>
      <div className={`home-hero-mobile-ticker${consultationInView ? " is-suppressed" : ""}`}><NotificationTicker /></div>

      <a
        className={`home-hero-cta home-mobile-cta${ctaScrolling || consultationInView || menuOpen || activeCatalogueItem ? " is-hidden" : ""}`}
        href="https://calendar.app.google/rq7PqiSkYUWpw1ADA"
        target="_blank" rel="noopener noreferrer"
      ><span>Get<br />Started</span></a>

      <section ref={gallerySectionRef} className="home-gallery" aria-label="Motion gallery">
        <div
          ref={galleryTrackRef}
          id="motion-gallery-track"
          className="home-gallery-track"
          data-lenis-prevent
        >
          {[...galleryImages, ...galleryImages, ...galleryImages].map((record, index) => (
            <div className="home-gallery-image" key={`${record.id}-${index}`}>
              <div className="home-gallery-image-content">
                {record.image.startsWith("/") ? (
                  <Image src={record.image} alt={record.alt} fill sizes="300px" />
                ) : (
                  // External database links remain browser-fetched so the database can use any image host.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img {...imageDelivery(record.image, "300px", 640)} alt={record.alt} loading="lazy" decoding="async" />
                )}
              </div>
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

      <section ref={projectSectionRef} id="projects" className="home-projects">
        <h2>Previous work</h2>
        <div className="home-project-carousel">
          <div id="catalogue-project-grid" className={`home-project-grid home-project-track${catalogueOffset ? " is-shifted" : ""}`}>
            {orderedCatalogueItems.slice(0, 6).map((project, index) => {
              const visible = mobileCatalogue ? index < 5 || catalogueExpanded : index >= catalogueOffset && index < catalogueOffset + 5
              return <div className="home-project-slide" key={project.id} inert={!visible} aria-hidden={!visible}>
                <ProjectCard project={project} onOpen={openCatalogueItem}
                  directNavigation={directNavigation || cardExperiment.variant === "direct"}
                  onInteract={cardExperiment.interact} />
              </div>
            })}
          </div>
        </div>
        <button
          type="button"
          className={`home-catalogue-link${catalogueOffset ? " is-shifted" : ""}${mobileCatalogue && catalogueExpanded ? " is-expanded" : ""}`}
          disabled={orderedCatalogueItems.length <= 5}
          aria-controls="catalogue-project-grid"
          aria-expanded={mobileCatalogue ? catalogueExpanded : undefined}
          aria-label={mobileCatalogue ? (catalogueExpanded ? "Show fewer catalogue items" : "Show sixth catalogue item") : catalogueOffset ? "Show catalogue items 1 to 5" : "Show catalogue items 2 to 6"}
          onClick={() => mobileCatalogue ? setCatalogueExpanded(expanded => !expanded) : setCatalogueShifted(shifted => !shifted)}
        >
          <span className="home-catalogue-button-label">VIEW PREVIOUS WORK</span>
          <span className="home-catalogue-arrow" aria-hidden="true">→</span>
        </button>
      </section>

      <ConsultationSection />

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
