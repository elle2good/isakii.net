"use client"

import { useMemo, useState } from "react"

type Props = {
  frontCover?: string
  innerPages?: string[]
  backCover?: string
  width?: number
  height?: number
  borderRadius?: number
}

export default function InteractiveBook({ frontCover, innerPages = [], backCover, width = 200, height = 200, borderRadius = 0 }: Props) {
  const leaves = useMemo(() => {
    const images = [frontCover, ...innerPages, backCover].filter(Boolean) as string[]
    if (images.length % 2) images.push("")
    return Array.from({ length: images.length / 2 }, (_, index) => [images[index * 2], images[index * 2 + 1]])
  }, [backCover, frontCover, innerPages])
  const [flippedCount, setFlippedCount] = useState(0)

  const advance = () => setFlippedCount((count) => count >= leaves.length ? 0 : count + 1)

  return (
    <button className="interactive-book" type="button" onClick={advance} aria-label="Turn book page" style={{ width, height }}>
      {(leaves.length ? leaves : [["", ""]]).map(([front, back], index) => (
        <span className={`book-leaf ${index < flippedCount ? "flipped" : ""}`} key={`${front}-${index}`} style={{ zIndex: index < flippedCount ? index : leaves.length - index }}>
          <span className="book-face book-front" style={{ borderRadius: `0 ${borderRadius}px ${borderRadius}px 0` }}>{front && <img src={front} alt="" />}</span>
          <span className="book-face book-back" style={{ borderRadius: `${borderRadius}px 0 0 ${borderRadius}px` }}>{back && <img src={back} alt="" />}</span>
        </span>
      ))}
    </button>
  )
}
