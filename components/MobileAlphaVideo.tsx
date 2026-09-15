"use client"

import { RefObject, useEffect, useRef } from "react"

/** H.264 carries RGB and the original alpha plane side by side for iOS playback. */
export default function MobileAlphaVideo({ src, label, videoRef, loop, onEnded }: {
  src: string; label: string; videoRef: RefObject<HTMLVideoElement | null>; loop: boolean; onEnded: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const buffer = document.createElement("canvas")
    const bufferContext = buffer.getContext("2d", { willReadFrequently: true })
    const context = canvas.getContext("2d")
    if (!bufferContext || !context) return
    let frame = 0
    let stopped = false
    const render = () => {
      if (stopped) return
      if (video.readyState >= 2 && video.videoWidth) {
        const width = video.videoWidth / 2
        const height = video.videoHeight
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width; canvas.height = height
          buffer.width = video.videoWidth; buffer.height = height
        }
        bufferContext.drawImage(video, 0, 0)
        const color = bufferContext.getImageData(0, 0, width, height)
        const alpha = bufferContext.getImageData(width, 0, width, height).data
        for (let i = 0; i < color.data.length; i += 4) color.data[i + 3] = alpha[i] < 3 ? 0 : alpha[i] > 252 ? 255 : alpha[i]
        context.putImageData(color, 0, 0)
      }
      frame = video.requestVideoFrameCallback ? video.requestVideoFrameCallback(render) : requestAnimationFrame(render)
    }
    render()
    return () => {
      stopped = true
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frame)
      else cancelAnimationFrame(frame)
    }
  }, [src, videoRef])
  return <>
    <video ref={videoRef} src={src} className="mobile-alpha-source" aria-hidden="true" muted playsInline autoPlay loop={loop} preload="auto" onEnded={onEnded} />
    <canvas ref={canvasRef} className="mobile-alpha-canvas" role="img" aria-label={label} />
  </>
}
