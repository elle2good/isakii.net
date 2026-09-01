"use client"

import { useEffect, useRef } from "react"

type Props = {
  videoSrc?: string
  loopStart?: number
  loopEnd?: number
}

export default function HeroVideo({
  videoSrc = "https://res.cloudinary.com/dwto97ayq/video/upload/v1778476848/Landingpage_Portrait_Vid_z1b78s.mp4",
  loopStart = 12,
  loopEnd = 15,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasLoopedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (hasLoopedRef.current && video.currentTime >= loopEnd) video.currentTime = loopStart
    }
    const handleEnded = () => {
      if (!hasLoopedRef.current) {
        hasLoopedRef.current = true
        video.currentTime = loopStart
        void video.play()
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [loopStart, loopEnd])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#0C0319" }}>
      <video ref={videoRef} src={videoSrc} autoPlay muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  )
}
