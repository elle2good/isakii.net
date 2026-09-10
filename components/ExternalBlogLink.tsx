"use client"

import type { MouseEvent, ReactNode } from "react"

type ExternalBlogLinkProps = {
  children: ReactNode
  href: string
  onOpen?: () => void
  tabIndex?: number
}

export default function ExternalBlogLink({ children, href, onOpen, tabIndex }: ExternalBlogLinkProps) {
  const confirmExternalNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const shouldOpen = window.confirm(
      `This will redirect you to ${href}. Do you want to open this link?`,
    )

    if (!shouldOpen) return

    window.open(href, "_blank", "noopener,noreferrer")
    onOpen?.()
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      tabIndex={tabIndex}
      onClick={confirmExternalNavigation}
    >
      {children}
    </a>
  )
}
