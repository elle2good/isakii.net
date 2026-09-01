"use client"

import Link from "next/link"
import { useState } from "react"
import ContactButton from "./ContactButton"

const portfolioItems = ["Media", "Events", "Illustrations"]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [portfolioOpen, setPortfolioOpen] = useState(false)

  return (
    <nav className={`navigation ${open ? "navigation-open" : ""}`} aria-label="Main navigation">
      <div className="navigation-name">
        <Link href="/" className="navigation-brand">isakii</Link>
        <button className="navigation-trigger" type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span />
          <span />
        </button>
      </div>

      <div className="navigation-links">
        <Link href="/about">About</Link>
        <div className="portfolio-control" onMouseEnter={() => setPortfolioOpen(true)} onMouseLeave={() => setPortfolioOpen(false)}>
          <button type="button" aria-expanded={portfolioOpen} onClick={() => setPortfolioOpen((value) => !value)}>Portfolio</button>
          {portfolioOpen && (
            <div className="portfolio-menu" role="menu">
              {portfolioItems.map((item) => <span role="menuitem" key={item}>{item}</span>)}
            </div>
          )}
        </div>
        <Link href="/work">Blog</Link>
        <a href="mailto:hello@isakii.net"><ContactButton /></a>
      </div>
    </nav>
  )
}
