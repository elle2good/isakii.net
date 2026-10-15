"use client"

import { cloudinaryHeroVideo } from "@/lib/media"
import { useEffect, useRef, useState } from "react"

type Props = { videoSrc?: string }

export default function HeroVideo({ videoSrc = "/home/seoul-voxel-hero.mp4" }: Props) {
  const [isReady, setIsReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) setIsReady(true)
  }, [videoSrc])
  return (
    <div className={`hero-video-stage ${isReady ? "is-ready" : ""}`}>
      <div className="hero-video-frame">
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto" onLoadedData={() => setIsReady(true)}>
          <source media="(max-width: 700px)" src="/home/seoul-rooftop-mobile.mp4" type="video/mp4" />
          <source src={cloudinaryHeroVideo(videoSrc, 1280)} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
