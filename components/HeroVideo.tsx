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
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null)
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

  useEffect(() => {
    const video = videoRef.current
    const stage = stageRef.current
    const frame = frameRef.current
    const canvas = ambientCanvasRef.current
    if (!video || !stage || !frame || !canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    let animationFrame = 0
    let videoFrame = 0
    let disposed = false

    const drawAmbientFrame = () => {
      if (disposed || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return

      const bounds = stage.getBoundingClientRect()
      const frameBounds = frame.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(bounds.width * pixelRatio))
      const height = Math.max(1, Math.round(bounds.height * pixelRatio))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      const frameWidth = frameBounds.width * pixelRatio
      const frameLeft = (frameBounds.left - bounds.left) * pixelRatio
      const sourceAspect = video.videoWidth / video.videoHeight
      const frameAspect = frameWidth / height

      let sourceX = 0
      let sourceY = 0
      let sourceWidth = video.videoWidth
      let sourceHeight = video.videoHeight

      if (sourceAspect > frameAspect) {
        sourceWidth = video.videoHeight * frameAspect
        sourceX = (video.videoWidth - sourceWidth) / 2
      } else {
        sourceHeight = video.videoWidth / frameAspect
        sourceY = (video.videoHeight - sourceHeight) / 2
      }

      context.clearRect(0, 0, width, height)

      // Extend the exact visible edge pixels of the foreground video into the
      // surrounding canvas. The subtle blur prevents hard bands while keeping
      // every shade change synchronized to the live video frame.
      context.drawImage(video, sourceX, sourceY, 2, sourceHeight, 0, 0, frameLeft + 2, height)
      context.drawImage(
        video,
        sourceX + sourceWidth - 2,
        sourceY,
        2,
        sourceHeight,
        frameLeft + frameWidth - 2,
        0,
        width - frameLeft - frameWidth + 2,
        height,
      )
      context.drawImage(video, sourceX, sourceY, sourceWidth, 2, frameLeft, 0, frameWidth, 22 * pixelRatio)
    }

    const queueFrame = () => {
      drawAmbientFrame()
      if ("requestVideoFrameCallback" in video) {
        videoFrame = video.requestVideoFrameCallback(queueFrame)
      } else {
        animationFrame = window.requestAnimationFrame(queueFrame)
      }
    }

    const observer = new ResizeObserver(drawAmbientFrame)
    observer.observe(stage)
    observer.observe(frame)
    queueFrame()

    return () => {
      disposed = true
      observer.disconnect()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (videoFrame && "cancelVideoFrameCallback" in video) video.cancelVideoFrameCallback(videoFrame)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-video-stage">
      <canvas ref={ambientCanvasRef} className="hero-video-ambient" aria-hidden="true" />
      <div ref={frameRef} className="hero-video-frame">
        <video ref={videoRef} src={videoSrc} crossOrigin="anonymous" autoPlay muted playsInline />
      </div>
      <div className="hero-video-gradation" aria-hidden="true" />
    </div>
  )
}
