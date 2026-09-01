import Link from "next/link"

function LeftIcons() {
  return (
    <svg width="68" height="24" viewBox="0 0 68 24" fill="none" aria-hidden="true">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M55 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" stroke="white" strokeWidth="1.6" />
      <path d="m60 16 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function RightIcons() {
  return (
    <svg width="68" height="24" viewBox="0 0 68 24" fill="none" aria-hidden="true">
      <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="white" strokeWidth="1.6" />
      <path d="M6.5 20c.8-4 2.7-6 5.5-6s4.7 2 5.5 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 8h12l-1 12H51L50 8Z" stroke="white" strokeWidth="1.6" />
      <path d="M53 8V6a3 3 0 0 1 6 0v2" stroke="white" strokeWidth="1.6" />
    </svg>
  )
}

export default function HomeHeader() {
  return (
    <header className="home-header">
      <div className="header-side" aria-label="Menu and search"><LeftIcons /></div>
      <Link href="/" className="home-wordmark">isakii</Link>
      <div className="header-side" aria-label="Profile and shop"><RightIcons /></div>
    </header>
  )
}
