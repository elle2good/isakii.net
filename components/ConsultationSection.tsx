"use client"

import { useState, type FormEvent } from "react"

export default function ConsultationSection() {
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return
    const data = new FormData(event.currentTarget)
    setStatus("sending")
    setMessage("")
    try {
      const response = await fetch("/api/consultation", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:data.get("name"),email:data.get("email")}) })
      const result = await response.json()
      if (!response.ok || !result.registered) throw new Error(result.error || "Please try again.")
      setStatus("success")
      setMessage("You’re signed up! Check your email, including Promotions or Spam, for the next steps.")
    } catch(error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Please try again.")
    }
  }

  return (
    <section id="grwm" className="home-consultation" aria-labelledby="consultation-heading">
      <div className="consultation-grid" aria-hidden="true"><img src="/consultation/grid.png" alt="" /></div>
      <h2 id="consultation-heading" className="consultation-heading"><img src="/consultation/headline.png" alt="Get Ready for 2027 with me" /></h2>
      <form className="consultation-form" onSubmit={submit}>
        <img className="consultation-free" src="/consultation/free-consultation.png" alt="Free consultation" />
        <label><span className="sr-only">Your Name</span><input name="name" autoComplete="name" placeholder="Your Name" required /></label>
        <label><span className="sr-only">Company Email address</span><input name="email" type="email" autoComplete="email" placeholder="Company Email address" required /></label>
        <button type="submit" className={status === "success" ? "is-success" : undefined} disabled={status === "sending" || status === "success"}>{status === "sending" ? "Sending…" : status === "success" ? "TTYL" : "Sign Up"}</button>
        {message && <p className="consultation-status" role="status">{status === "success" ? <strong>{message}</strong> : message}</p>}
      </form>
      <ul className="consultation-prompts">
        <li><span>“I am launching a product from scratch.”</span></li>
        <li><span>“My company needs more holiday season support.”</span></li>
        <li><span>“My followers won’t buy from me.”</span></li>
        <li><span>“I have leads who are only interested.”</span></li>
      </ul>
      <img className="consultation-arrow" src="/consultation/arrow.png" alt="" />
      <div className="consultation-mobile-stamp">
        <img src="/consultation/mobile-stamp.png" alt="" />
        <span>Yes,i can</span>
        <img className="consultation-mobile-badge" src="/consultation/mobile-badge.png" alt="Cried but did the thing anyways" />
      </div>
      <div className="consultation-stamp">
        <img src="/consultation/mobile-stamp.png" alt="" />
        <span>i can<br />do it</span>
        <img className="consultation-desktop-badge" src="/consultation/mobile-badge.png" alt="Cried but did the thing anyways" />
      </div>
    </section>
  )
}
