"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useState } from "react"

type SubmissionState = "idle" | "submitting" | "success" | "error"

const footerLinks = [
  { label: "about", href: "/about" },
  { label: "blog", href: "/work?language=en" },
  { label: "catalogue", href: "/#projects" },
  { label: "home", href: "/" },
]

export default function HomeFooter() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionState === "submitting" || submissionState === "success") return

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") || "").trim()

    setSubmissionState("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { registered?: boolean; error?: string }

      if (!response.ok || !data.registered) {
        throw new Error(data.error || "We could not complete the subscription.")
      }

      setSubmissionState("success")
      setMessage("You’re subscribed.")
      form.reset()
    } catch (error) {
      setSubmissionState("error")
      setMessage(error instanceof Error ? error.message : "We could not complete the subscription.")
    }
  }

  return (
    <footer className="home-footer">
      <div className="home-footer-top">
        <div className="home-footer-brand-navigation">
          <Link className="home-footer-wordmark" href="/" aria-label="isakii home">isakii</Link>
          <nav className="home-footer-navigation" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link href={link.href} key={link.label}>{link.label}</Link>
            ))}
          </nav>
        </div>

        <section className="home-footer-subscribe" aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading">Subscribe</h2>
          <p>For occasional newsletters and catalogue updates.</p>
          <form onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email address"
              required
              disabled={submissionState === "submitting" || submissionState === "success"}
            />
            <button
              type="submit"
              disabled={submissionState === "submitting" || submissionState === "success"}
              aria-label={submissionState === "success" ? "Subscription complete" : "Subscribe to newsletter"}
            >
              {submissionState === "success" ? (
                <span className="home-footer-check" aria-hidden="true">✓</span>
              ) : submissionState === "submitting" ? "Sending…" : "Subscribe"}
            </button>
          </form>
          <p className={`home-footer-form-message is-${submissionState}`} aria-live="polite">{message}</p>
        </section>
      </div>

      <div className="home-footer-divider" />

      <div className="home-footer-bottom">
        <div className="home-footer-socials" aria-label="Social links">
          <a href="https://www.linkedin.com/in/isakii/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <span className="home-footer-linkedin" aria-hidden="true">in</span>
          </a>
          <a href="https://x.com/isakii" target="_blank" rel="noreferrer" aria-label="X">
            <span className="home-footer-x" aria-hidden="true">𝕏</span>
          </a>
          <a href="https://github.com/elle2good" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Image
              className="home-footer-github"
              src="/home/icons/github.webp"
              alt=""
              width={28}
              height={29}
              aria-hidden="true"
            />
          </a>
          <a href="https://calendar.app.google/ynneGAWzZeX47R9w7" target="_blank" rel="noreferrer" aria-label="Schedule a call">
            <svg className="home-footer-call" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.1 3.5 9.3 7c.3.5.2 1.1-.2 1.5l-1.4 1.4a14.8 14.8 0 0 0 6.4 6.4l1.4-1.4c.4-.4 1-.5 1.5-.2l3.5 2.2c.5.3.7.9.5 1.4l-.7 2c-.2.6-.8 1-1.5 1C10 21.3 2.7 14 2.7 5.2c0-.7.4-1.3 1-1.5l2-.7c.5-.2 1.1 0 1.4.5Z" />
            </svg>
          </a>
        </div>
        <div className="home-footer-legal" aria-label="Legal information">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <span>© 2026 Lisa Kim</span>
        </div>
      </div>
    </footer>
  )
}
