"use client"

import { useRef, useState } from "react"

const PROJECTS = [
  { title: "Glamai", year: "2019-2022", date: "November, 2019", desc: "D2C AI Beauty Discovery app launched on North American app stores.", logoSrc: "https://res.cloudinary.com/dwto97ayq/image/upload/v1779106604/glamai_logo_rniplx.png" },
  { title: "MaiMovie", year: "2019-2022", date: "November, 2019", desc: "Free AI Movie & SVOD Finder app launched on North American app stores.", logoSrc: "https://res.cloudinary.com/dwto97ayq/image/upload/v1779106636/maimovie_logo_x7zvkq.png" },
  { title: "Nomad Era", year: "2023", date: "January, 2023", desc: "Went fully nomadic, working remotely while traveling across 14 countries.", logoSrc: "" },
  { title: "Tech Growth", year: "2023", date: "March, 2023", desc: "Helped multiple tech companies strengthen their online communities.", logoSrc: "" },
  { title: "14 Countries", year: "2024", date: "February, 2024", desc: "Completed two years of nomadic travel across 14 countries.", logoSrc: "" },
  { title: "Growth Co", year: "2024", date: "June, 2024", desc: "Continued growth specialist work with tech clients globally.", logoSrc: "" },
  { title: "Cafe Rave", year: "2025", date: "March, 2025", desc: "Co-hosted a cafe rave in Gangnam-gu, Seoul, with Raydium Protocol and Unborn Sounds.", logoSrc: "" },
  { title: "Raydium Protocol", year: "2025", date: "March, 2025", desc: "Growth and community partnership with Raydium Protocol.", logoSrc: "" },
]

const SEGMENTS = [
  { key: "s2019", label: "2019 – 2022", indices: [0, 1] },
  { key: "s2023", label: "2023", indices: [2, 3] },
  { key: "s2024", label: "2024", indices: [4, 5] },
  { key: "s2025", label: "2025", indices: [6, 7] },
]

function LogoCircle({ index, onSelect }: { index: number; onSelect: (index: number) => void }) {
  const project = PROJECTS[index]
  return (
    <button className="work-logo" type="button" aria-label={project.title} onClick={() => onSelect(index)}>
      {project.logoSrc ? <img src={project.logoSrc} alt="" /> : <span>{project.title.slice(0, 4)}</span>}
    </button>
  )
}

export default function WorkSection() {
  const [activeYear, setActiveYear] = useState("")
  const [selected, setSelected] = useState<number | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showYear = (key: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setActiveYear(key)
  }
  const hideYear = () => {
    hideTimer.current = setTimeout(() => setActiveYear(""), 350)
  }

  return (
    <section className="work-section">
      <span className="work-label">Work</span>
      <p className="work-hint">Hover a year to explore</p>

      <svg className="work-wave" viewBox="0 0 48 400" preserveAspectRatio="none" aria-hidden="true">
        {SEGMENTS.map((segment, index) => {
          const y = index * 100
          const path = index % 2 === 0
            ? `M24,${y} C6,${y + 35} 42,${y + 65} 24,${y + 100}`
            : `M24,${y} C42,${y + 35} 6,${y + 65} 24,${y + 100}`
          return <path key={segment.key} d={path} className={activeYear === segment.key ? "active" : ""} onMouseEnter={() => showYear(segment.key)} onMouseLeave={hideYear} />
        })}
      </svg>

      <div className="work-years">
        {SEGMENTS.map((segment) => {
          const active = activeYear === segment.key
          return (
            <div className={`work-year ${active ? "active" : ""}`} key={segment.key} onMouseEnter={() => showYear(segment.key)} onMouseLeave={hideYear}>
              <span>{segment.label}</span>
              <div className="work-logos">
                {segment.indices.map((index) => <LogoCircle key={index} index={index} onSelect={setSelected} />)}
              </div>
            </div>
          )
        })}
      </div>

      {selected !== null && (
        <aside className="work-detail" aria-live="polite">
          <button type="button" aria-label="Close project detail" onClick={() => setSelected(null)}>×</button>
          <span>{PROJECTS[selected].date}</span>
          <h2>{PROJECTS[selected].title}</h2>
          <p>{PROJECTS[selected].desc}</p>
        </aside>
      )}
    </section>
  )
}
