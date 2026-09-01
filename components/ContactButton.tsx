"use client"

import { useEffect, useRef, useState } from "react"

const BLOB_BASE =
  "M20,7 C32,3 52,2 67,3 C82,4 102,5 110,11 C116,15 117,24 115,32 C113,40 104,44 90,45 C75,46 43,47 26,45 C11,43 3,37 2,29 C1,20 6,10 20,7 Z"

const BLOB_FRAMES = [
  "M18,8 C30,2 53,3 68,2 C83,3 103,6 111,12 C117,16 116,25 114,33 C112,41 103,45 89,46 C74,47 42,47 25,44 C10,42 2,36 4,28 C5,19 7,11 18,8 Z",
  "M21,6 C33,4 51,1 66,4 C81,5 101,4 109,10 C115,14 118,23 116,31 C114,39 105,43 91,44 C76,45 44,48 27,46 C12,44 4,38 2,30 C0,21 7,9 21,6 Z",
  "M19,9 C31,4 54,4 69,3 C84,5 104,7 112,13 C118,17 116,26 113,34 C111,42 102,45 88,45 C73,46 41,46 24,43 C9,41 2,35 4,27 C6,18 8,12 19,9 Z",
  "M22,7 C34,3 50,2 65,3 C80,4 100,4 108,11 C114,15 117,24 115,32 C114,40 105,46 91,46 C76,47 45,48 28,45 C13,43 4,38 3,30 C1,21 8,10 22,7 Z",
  "M17,8 C29,3 52,2 67,5 C82,6 103,7 111,12 C117,16 117,26 115,34 C113,41 104,44 89,44 C74,45 42,47 25,45 C10,43 2,37 3,29 C1,20 6,11 17,8 Z",
]

type Props = {
  label?: string
  fillColor?: string
  strokeColor?: string
  textColor?: string
  onClick?: () => void
}

export default function ContactButton({
  label = "Contact",
  fillColor = "#CDC4B8",
  strokeColor = "#DA260F",
  textColor = "#3D4B5C",
  onClick,
}: Props) {
  const [blobPath, setBlobPath] = useState(BLOB_BASE)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef(0)

  const stopWiggle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    frameRef.current = 0
    setBlobPath(BLOB_BASE)
  }

  const startWiggle = () => {
    stopWiggle()
    intervalRef.current = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % BLOB_FRAMES.length
      setBlobPath(BLOB_FRAMES[frameRef.current])
    }, 120)
  }

  useEffect(() => stopWiggle, [])

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={startWiggle}
      onMouseLeave={stopWiggle}
      onFocus={startWiggle}
      onBlur={stopWiggle}
      style={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: 120,
        height: 48,
        padding: 0,
        border: 0,
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <svg viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <path d={blobPath} fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      </svg>
      <span style={{ position: "relative", zIndex: 1, fontSize: 14, color: textColor, userSelect: "none" }}>{label}</span>
    </button>
  )
}
