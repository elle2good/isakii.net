"use client"

import Link from "next/link"
import Image from "next/image"
import { forwardRef } from "react"

type HomeHeaderProps = {
  menuOpen: boolean
  onToggleMenu: () => void
}

const HomeHeader = forwardRef<HTMLElement, HomeHeaderProps>(function HomeHeader(
  { menuOpen, onToggleMenu },
  ref,
) {
  return (
    <header ref={ref} className="home-header">
      <div className="home-header-actions">
        <button
          className="home-menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <Link href="/" className="home-wordmark" aria-label="isakii home" onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
        if (window.location.pathname.startsWith("/catalogue/")) {
          try { sessionStorage.setItem("isakii:footer-contact:return-from-case-study", "true") } catch {}
        }
      }}>
        <Image
          className="home-wordmark-image"
          src="/isakii-logo.png"
          alt=""
          width={148}
          height={72}
          priority
        />
      </Link>
    </header>
  )
})

export default HomeHeader
