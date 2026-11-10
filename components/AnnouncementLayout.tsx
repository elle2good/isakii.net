"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import HomeHeader from "./HomeHeader"
import HomeFooter from "./HomeFooter"
import NotificationTicker from "./NotificationTicker"
import MenuContactActions from "./MenuContactActions"
import ExternalBlogLink from "./ExternalBlogLink"

export default function AnnouncementLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [blogExpanded, setBlogExpanded] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const closeMenu = () => { setMenuOpen(false); setBlogExpanded(false) }

  useEffect(() => {
    if (!menuOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    const dialog = container.current?.querySelector<HTMLElement>('[role="dialog"]')
    dialog?.querySelector<HTMLButtonElement>('button')?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); setBlogExpanded(false) }
      if (event.key !== "Tab" || !dialog) return
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button')).filter(item => item.tabIndex >= 0 && item.getClientRects().length > 0)
      const first = items[0], last = items.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); previousFocus?.focus() }
  }, [menuOpen])

  return (
    <div className="grwm-page" ref={container}>
      <div className="home-top-chrome is-visible">
        <HomeHeader menuOpen={menuOpen} onToggleMenu={() => { setMenuOpen(value => !value); setBlogExpanded(false) }} />
        <div className="home-notification-slot"><NotificationTicker /></div>
      </div>
        {menuOpen && (
          <div className="grwm-menu-layer">
            <button className="home-menu-scrim" aria-label="Close menu" onClick={closeMenu} />
            <div className={`home-menu-overlay is-open ${blogExpanded ? "has-blog-expanded" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu">
              <button type="button" className="home-menu-close" onClick={closeMenu} aria-label="Close menu">x</button>
              <nav aria-label="Explore">
                <Link className="home-menu-link" href="/about" onClick={closeMenu}>about</Link>
                <div className={`home-menu-accordion ${blogExpanded ? "is-expanded" : ""}`}>
                  <button type="button" className="home-menu-accordion-trigger" aria-expanded={blogExpanded} aria-controls="grwm-blog-submenu" onClick={() => setBlogExpanded((value) => !value)}>
                    <span>blog</span>
                    <span className="home-menu-accordion-arrow" aria-hidden="true" />
                  </button>
                  <div id="grwm-blog-submenu" className="home-menu-submenu" aria-hidden={!blogExpanded}>
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
      <div inert={menuOpen}>{children}<HomeFooter /></div>
    </div>
  )
}
