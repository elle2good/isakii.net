"use client"

import { cloudinaryHeroVideo } from "@/lib/media"
import { useEffect, useRef, useState } from "react"

type Props = { videoSrc?: string }

export default function HeroVideo({ videoSrc = "/home/seoul-voxel-hero.mp4" }: Props) {
  const [isReady, setIsReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const mobile = window.matchMedia("(max-width: 700px)")
    // Video source media queries are not re-evaluated reliably after resizing.
    const selectSource = () => {
      const src = mobile.matches
        ? "/home/seoul-rooftop-mobile.mp4"
        : cloudinaryHeroVideo(videoSrc, 1280)
      if (video.getAttribute("src") === src) return
      setIsReady(false)
      video.muted = true
      video.src = src
      video.load()
      void video.play().catch(() => { /* Autoplay may be restricted by the device. */ })
    }
    selectSource()
    mobile.addEventListener("change", selectSource)
    return () => mobile.removeEventListener("change", selectSource)
  }, [videoSrc])
  return (
    <div className={`hero-video-stage ${isReady ? "is-ready" : ""}`}>
      <div className="hero-video-frame">
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto" onLoadedData={() => setIsReady(true)} />
      </div>
    </div>
  )
}
