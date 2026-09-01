"use client"

import Link from "next/link"
import { forwardRef } from "react"

type HomeHeaderProps = {
  menuOpen: boolean
  onToggleMenu: () => void
  onOpenSearch: () => void
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="m15.25 15.25 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function AccountAndBag() {
  return (
    <svg width="68" height="24" viewBox="0 0 68 24" fill="none" aria-hidden="true">
      <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 20c.8-4 2.7-6 5.5-6s4.7 2 5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 8h12l-1 12H51L50 8Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M53 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

const HomeHeader = forwardRef<HTMLElement, HomeHeaderProps>(function HomeHeader(
  { menuOpen, onToggleMenu, onOpenSearch },
  ref,
) {
  return (
    <header ref={ref} className="home-header">
      <div className="home-header-actions">
        <button
          className={`home-menu-button ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
        <button className="home-icon-button" type="button" aria-label="Open search" onClick={onOpenSearch}>
          <SearchIcon />
        </button>
      </div>

      <Link href="/" className="home-wordmark">isakii</Link>

      <div className="home-account-actions" aria-label="Profile and shop">
        <AccountAndBag />
      </div>
    </header>
  )
})

export default HomeHeader
