"use client"

import { useEffect, useState } from "react"
import styles from "./AlgorandGame.module.css"

export default function AlgorandGame() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const rotateRequired = window.matchMedia("(max-width: 700px) and (orientation: portrait), (pointer: coarse) and (orientation: portrait)")
    const startWhenReady = () => {
      // Do not start the teaser behind the instruction or reset it on later rotations.
      if (!rotateRequired.matches) setStarted(true)
    }
    startWhenReady()
    rotateRequired.addEventListener("change", startWhenReady)
    return () => rotateRequired.removeEventListener("change", startWhenReady)
  }, [])

  return (
    <main className={styles.game}>
      {started && <iframe
        src="/games/algorand-korea/index.html"
        title="Algorand Korea — One Campaign, Two Perspectives"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        allowFullScreen
      />}
      <div className={styles.rotatePrompt} role="status">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <rect x="24" y="13" width="32" height="54" rx="5" stroke="currentColor" strokeWidth="2" transform="rotate(90 40 40)" />
          <path d="M16 20a29 29 0 0 1 47-4M63 8v8h-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1>Rotate your phone to play</h1>
        <p>Turn your phone sideways to explore the campaign in landscape mode.</p>
        <small>If the screen doesn’t rotate, turn off portrait orientation lock.</small>
      </div>
    </main>
  )
}
