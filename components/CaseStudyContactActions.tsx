import Image from "next/image"
import "./case-study-contact-actions.css"

export default function CaseStudyContactActions() {
  return <div className="case-study-contact-actions" aria-label="Contact Lisa">
    <a href="https://calendar.app.google/GYAJYPauZoJfZQ4F9" target="_blank" rel="noopener noreferrer" aria-label="Book a call" title="Book a call">
      <Image src="/case-studies/shared/call.svg" alt="" width={13} height={13} aria-hidden="true" />
    </a>
    <a href="mailto:smkim@isakii.net" aria-label="Email smkim@isakii.net" title="Email Lisa">
      <span className="case-study-mail-icon" aria-hidden="true"><Image src="/case-studies/shared/mail-fold.svg" alt="" width={11.7001} height={4.69544} /></span>
    </a>
  </div>
}
