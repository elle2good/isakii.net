import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms & Conditions | isakii",
  description: "The official terms and conditions of use for isakii.net.",
}

type TermsSubsection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  after?: string[]
  bulletHeading?: string
  secondBulletHeading?: string
  secondBullets?: string[]
}

type TermsSection = {
  heading: string
  paragraphs?: string[]
  subsections?: TermsSubsection[]
}

const termsSections: TermsSection[] = [
  {
    heading: "General Provisions",
    paragraphs: [
      "This website is owned and operated by Company.",
      "You must be at least eighteen years of age to use Our website. Use of this website is at Your own risk. We host Our site on a reputable platform and take reasonable efforts to maintain and host the site. However, We make no explicit representations or warranties as to the safety of Your individual use of the website. The Terms and Conditions contained on this page are subject to change at any time.",
    ],
  },
  {
    heading: "Terms of Site & Purchaser Agreement",
    paragraphs: [
      "All Offerings are owned and provided by Company. These Terms and Conditions of Use govern and define how You are allowed to use and access Company’s Offering. We reserve the right to update and change these Terms and Conditions of Use at any time, and will update them accordingly with the ‘date last updated’ at the top of this page.",
      "You are legally bound to these Terms and Conditions of Use whether or not You have read them. If You do not agree with any of Our Terms and Conditions of Use, please email Us at the contact details listed at the top of this agreement, and We will make reasonable efforts to remove Your name, email, and access to Our Offering and website(s).",
    ],
    subsections: [
      {
        heading: "Your Product or Course Use and Consent",
        paragraphs: [
          "When You purchased Our Offering, You were given a reasonable notice that these Terms and Conditions of Use existed. By moving forward with Your purchase of the Offering and further access of the Offering, You implicitly agreed and continue to agree to abide by these Terms and Conditions of Use, as well as any disclaimers and privacy disclosures contained in these Terms and Conditions of Use.",
          "You agree You are at least 18 years old or of the age of majority in Your applicable jurisdiction to access the Offering. Access of Our Offering and related materials by a minor is a violation of use, and We reserve the right to terminate Your access if such an issue is discovered.",
        ],
      },
    ],
  },
  {
    heading: "Intellectual Property Notice",
    paragraphs: [
      "All images, text, designs, graphics, trademarks, and service marks are owned by and property of Company, or the properly attributed party. It is a violation of applicable law to use any of Our intellectual property in whole or in part, and modification of any materials contained on this site is illegal and may be prosecuted to the fullest extent permissible should We choose to do so, including asking for financial penalties (damages) and/or an injunction forcing You to stop using Our intellectual property immediately.",
      "You may NOT use Our intellectual property in any way, which includes republishing any text, image, design, or other property on another website, or posting a quote or image from Our site to any third-party website including social media. We have spent a great deal of time and money building the intellectual property located on this site and in order to maintain the integrity of it, We cannot allow any third party use.",
    ],
    subsections: [
      {
        heading: "Your Materials and Contributions",
        paragraphs: ["By submitting a comment, photo, video, or other material(s) onto any website or platform owned or maintained by Us, including but not limited to third-party access sites, such as Our Facebook group(s) or online software platforms that We use to distribute Our Offering and related materials, You agree that We have a non-revocable, commercial license to re-publish Your submission in whole or in part unless You explicitly state that We may not do so with said submission. You have no right to privacy by accessing Our Offering or related materials, and We reserve the right to disclose Your participation in the same."],
      },
      {
        heading: "Product Reviews",
        paragraphs: ["We may ask You to leave a rating and/or review of Your purchase. If You choose to write a review, You must comply with the following guidelines:"],
        bullets: [
          "You have used and/or accessed the product(s) sufficiently to speak with reasonable knowledge as to its effectiveness, value, aesthetics or utility; and",
          "You do not use any offensive language, such as profanity, hateful or racist speech; and",
          "Your submission does not discriminate on the basis of race, gender, religion, nationality, age or disability; and",
          "You have not used your purchase in an illegal way, or made any implied or express claims to the same; and",
          "You are not related to anyone who owns any part of Our site; and",
          "You are not claiming any false or misleading statements; and",
          "You are not affiliated with or working for any site or company we deem a competitor, at our sole discretion; and",
          "You do not organize a campaign encouraging others to leave reviews, whether good or bad, unless otherwise authorized to do so.",
        ],
        after: ["We reserve the right to accept or reject Your review at our sole discretion. Reviews are not Our opinions or beliefs. We do not assume any liability for any review or for any claim, issue, liability or loss resulting from any posted review. By posting a review, You hereby grant to Us a perpetual, non-exclusive, worldwide, royalty-free, fully-paid, assignable, and sublicensable right and license to reproduce, modify, translate, transmit by any means, display, perform, and/or distribute all content relating to reviews."],
      },
      {
        heading: "Model Release",
        paragraphs: ["You must own the copyright to any image(s) You use by default or voluntarily on Our platforms or in Our Offering or related materials. You grant Us a commercial license to any image(s) You submit to Us by default, such as a Facebook profile photo or other profile image You voluntarily provide in accessing the Offering, or voluntarily upon Our request. Such a default or voluntary release of Your image and likeness may be used for any reasonable future business use."],
      },
      {
        heading: "Notification of Use",
        paragraphs: ["We are not obligated to notify You or anyone in photographs of Our publication or other use of any image or images You submit by default or voluntarily."],
      },
    ],
  },
  {
    heading: "Intellectual Property",
    subsections: [
      {
        heading: "Limited License",
        paragraphs: [
          "Any and all materials, paid or free, that You access on this or any related domains that contain Our Offering are under the sole ownership or licensed use of Company.",
          "To be clear, We own Our page layout and design, overall look and appearance, individual graphics, icons, videos, logos, taglines, and trademarks (common law or federally registered). You are not allowed to reproduce any part of Our website(s), program(s), product(s), service materials, or related communications.",
          "You are only receiving a limited, non-transferable, non-exclusive, revocable license for non-commercial use only in order to access any content or materials in the Offering You have paid for or opted to receive. If You exceed the scope of this license, as determined by a legal authority such as a court of law or the Trademark Trials and Appeals Board, You have committed infringement in a manner that materially harms Us, and We have the right to seek damages and/or an injunction to remedy the situation until We are made whole.",
        ],
        bulletHeading: "You may:",
        bullets: [
          "Access the Offering for Your personal use (if additional members of Your team need to access the Offering, You must purchase additional Offerings at one per each team member).",
          "Download and/or print any Offering materials for Your personal use in Your business (if additional members of Your team need to download and/or print any materials from the Offering, You must purchase additional Offerings at one per each team member).",
          "Use Our trademarks and copyrighted materials with Our consent and proper credit and marking, namely, using © with our Company name as the source of the materials and marking any federally registered trademarks with ® or common law trademarks with ™.",
        ],
        secondBulletHeading: "You may not:",
        secondBullets: [
          "Re-sell or trade Your access to the Offering.",
          "Share the Offering with anyone else who has not yet purchased it or opted in to receive it.",
          "Reprint or republish any of the Offering, in part or in whole.",
          "Distribute any of the materials contained in the Offering or related materials and/or communications as Your own, otherwise known as stealing.",
          "Reproduce and tweak any part or whole of the Offering for distribution as Your own work.",
          "Claim ownership or use over any of Our intellectual property without Our prior consent, which includes (but is not limited to): copyrights such as course materials, worksheets, workbooks, lessons, videos, and more; trademarks such as names, logos, taglines, or other unique source identifiers; or trade dress including the look and feel of the Offering (and its related communications and materials).",
          "Use Our Offering or any related materials and/or communications in an unlawful way or for any illegal or unlawful purpose(s).",
        ],
      },
      {
        heading: "Request for Permission to Use Content",
        paragraphs: ["If You wish to use, publish, or access any of Our content, Offering(s), or related materials, You must do so by requesting permission prior to commencing use of the same by emailing Us."],
      },
      {
        heading: "Civil and Criminal Penalties",
        paragraphs: ["Even though Our Offering is not necessarily something You can physically hold in Your hand and walk away with, it is nevertheless considered theft to steal, infringe, or otherwise violate these Terms and Conditions of Use. We reserve the right to prosecute infringers to the fullest extent allowed by criminal or civil statute in any jurisdiction allowed. You explicitly consent to personal jurisdiction in Our location by opting into or purchasing any Offering or accessing its related communications and/or materials."],
      },
    ],
  },
  {
    heading: "Security and Assumption of Risk",
    subsections: [
      {
        heading: "Security",
        paragraphs: ["It is Your responsibility to secure Your username and password from theft or any other means of unauthorized use that would violate these Terms and Conditions of Use. To the best of Our abilities, We do not store any whole credit card numbers or payment information, and instead, these are processed through third-party processors such as Stripe, Paypal, or other third party payment processors, as selected by You at checkout. By utilizing these payment processors to gain access to the Offering, You indemnify Us and instead assume any and all risk or liability for the security of the payment details, and agree to be bound by the third-party payment processor’s applicable terms and conditions of use."],
      },
      { heading: "Confidentiality", paragraphs: ["You have no right to confidentiality unless otherwise explicitly stated, such as in a subsequent client agreement, or otherwise implicitly agreed upon as mandated by law or fiduciary duty."] },
      { heading: "Assumption of Risk", paragraphs: ["By accessing Our Offering and/or related materials, whether paid or unpaid, You assume all the risk of Your access and any subsequent actions You choose to take as a result of the influence, information, or educational materials provided to You."] },
    ],
  },
  {
    heading: "Your Communications",
    paragraphs: [
      "Any communications made through Our ‘contact’, blog, blog comments, newsletter sign up, or other related pages, or directly to Our phones or mailing or email addresses is not held privileged or confidential and is subject to viewing and distribution by third parties. We own any and all communications displayed on Our website, servers, comments, emails, or other media as allowed by Our jurisdiction’s laws, and will not give credit or pay royalties for unsolicited user-generated content such as blog comments or emails. For more information on when and how We store and use Your communications or any data provided by You in those communications, please refer to Our Privacy Policy.",
      "We maintain a right to republish any submission in whole or in part as reasonably necessary in the course of Our business. You agree not to submit any content or communications that could be illegal or serve an unlawful purpose, including, but not limited to communications that are potentially libelous or maliciously false, obscene, abusive, negligent, or otherwise harmful or inappropriate.",
    ],
  },
  {
    heading: "Disclaimers",
    paragraphs: [
      "Our website and related materials are provided for educational and informational use only. You agree to indemnify and hold harmless Our website and company for any direct or indirect loss or conduct incurred as a result of Your use of Our website and any related communications, including as a result of any consequences incurred from technological failures such as a payment processor error(s) or system failure(s).",
      "While We may reference certain results, outcomes or situations on this website, You understand and acknowledge that We make no guarantee as to the accuracy of third-party statements contained herein or the likelihood of success for You as a result of these statements or any other statements anywhere on this website. If You have medical, legal, or financial questions, You should consult a medical professional, lawyer, or CPA and/or CFP respectively. We expressly disclaim any and all responsibility for any actions or omissions You choose to make as a result of using this website, related materials, products, courses, or the materials contained herein.",
      "This website is updated on a regular basis and while We try to make accurate statements in a timely and effective manner, We cannot guarantee that all materials and related media contained herein are entirely accurate, complete, or up to date. You expressly acknowledge and understand that any information or knowledge You gain as a result of using this website is used at Your own risk. If You should see any errors or omissions and would like to let Us know, please email Us.",
    ],
    subsections: [
      { heading: "Earnings Disclaimer", paragraphs: ["You agree that You understand individual outcomes will vary. Case studies or testimonials are not indicative of typical results. Each individual approaches Our Offering(s) with different backgrounds, disposable income levels, motivation, and other factors that are outside of Our control. Therefore, We cannot guarantee Your success merely upon access or purchase of Our Offering(s) or related material(s)."] },
      { heading: "General Disclaimer", paragraphs: ["To the fullest extent permitted by law, We expressly exclude any liability for any direct, indirect, or consequential loss or damage incurred by You or others in connection with Our Offering(s), including without limitation any liability for any accidents, delays, injuries, harm, loss, damage, death, lost profits, personal or business interruptions, misapplication of information, physical or mental disease, condition or issue, physical, mental, emotional, or spiritual injury or harm, loss of income or revenue, loss of business, loss of profits or contracts, anticipated savings, loss of data, loss of goodwill, wasted time, and for any other loss or damage of any kind, however and whether caused by negligence, breach of contract, or otherwise, even if foreseeable. We are not medical, legal, financial, or other professionals, or if We are, during the course of this Offering and related material(s), We are not offering Our professional services and You expressly agree We are not acting in any professional capacity, including medical, legal, financial, or otherwise during the course of this Offering. This Offering is for educational and entertainment purposes only. None of the Offering or its related material(s) should be construed as medical, legal, or financial advice."] },
      { heading: "Third-Party Disclaimer", paragraphs: ["You acknowledge and agree that We are not liable for any defamatory, offensive, or illegal conduct of any other participant or user, including You."] },
      { heading: "Warranties Disclaimer", paragraphs: ["WE MAKE NO WARRANTIES AS TO OUR PROGRAMS, PRODUCTS, SERVICES, OR PROGRAM MATERIALS. YOU AGREE THAT PROGRAMS, PRODUCTS, SERVICES, OR PROGRAM MATERIALS ARE PROVIDED “AS IS” AND WITHOUT WARRANTIES OF ANY KIND EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PROGRAMS, PRODUCTS, SERVICES, OR PROGRAM MATERIALS WILL BE FUNCTIONAL, UNINTERRUPTED, CORRECT, COMPLETE, APPROPRIATE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT ANY PART OF THE WEBSITE, OR CONTENT ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE USE OR THE RESULTS OF THE USE OF OUR PROGRAM, PRODUCT, OR SERVICES MATERIALS, OR ON THIRD-PARTY WEBSITES IN TERMS OF THEIR CORRECTNESS, ACCURACY, TIMELINESS, RELIABILITY, OR OTHERWISE."] },
      { heading: "Technology Disclaimer", paragraphs: ["We make reasonable efforts to provide You with modern, reliable technology, software, and platforms from which to access Our Offering(s) and related material(s). However, in the event of a technological failure, You accept and acknowledge Our lack of responsibility for said failure, and while We will make reasonable efforts to support You, some technological issues are far outside Our control and will require You to access support from a third-party provider. To be clear, you hold Us and Flodesk, Inc. harmless from any claims arising out of any technological failure except in the unforeseen case of gross negligence, as determined by industry standards."] },
      { heading: "Errors and Omissions", paragraphs: ["We make no warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information in Our Offering(s). We are not liable for any inaccuracies, errors, or reliance on personal opinions contained in Our Offering(s) or related material(s)."] },
    ],
  },
  {
    heading: "Indemnification, Limitation of Liability, and Release of Claims",
    subsections: [
      { heading: "Indemnification", paragraphs: ["You agree at all times to indemnify and hold harmless Our Company, as well as any of Our affiliates, agents, contractors, officers, directors, shareholders, employees, joint venture partners, successors, transferees, assignees, and licensees, as applicable, from and against any and all claims, causes of action, damages, liabilities, costs, and expenses, including legal fees and expenses, arising out of or related to Our Offering(s) ."] },
      { heading: "Limitation of Liability", paragraphs: ["We will not be held responsible or liable in any way for the information, products, or materials that You request or receive through or in relation to Our Offering(s). We do not assume liability for any third party conduct, accidents, delays, harm, or other detrimental or negative outcomes as a result of Your access of Our Offering(s) and related material(s)."] },
      { heading: "Termination", paragraphs: ["If at any time We feel You have violated these Terms and Conditions, then We shall immediately terminate Your use of Our website and any related communications as We deem appropriate. It is within Our sole discretion to allow any user’s access of Our website, and We may revoke this access at any time without notice, and if necessary, block Your IP address from further visits to Our site(s)."] },
    ],
  },
  {
    heading: "Financial Considerations",
    subsections: [
      { heading: "Purchases and Payment", paragraphs: ["You authorize Us to charge your chosen payment provider for the total amount stated on Your checkout cart screen. You agree to abide by the terms and conditions of Your card issuer agreement and any other applicable third party agreement that may affect Your purchase with Us. You agree to provide current, accurate and complete details as requested to process your payment. If necessary, You agree to update your payment information in a timely manner so We can complete any outstanding orders and/or contact You as needed.", "We reserve the right to change our prices for new purchases at any time.", "You agree to pay any applicable shipping and/or handling fees as stated on your checkout cart screen."] },
      { heading: "You May Be Charged Upon Renewal", paragraphs: ["If You purchased or signed up for an Offering that is recurring or which Offering renews automatically, by providing your payment information, You authorize Company to charge your card for future payments of such Offering.", "Cancellation. You may cancel any Offering that is recurring or which renews automatically by contacting Company."] },
      { heading: "Errors or Mistakes in Pricing", paragraphs: ["We reserve the right to correct any errors or mistakes in pricing, even if We have already received payment. Any such changes will be conveyed in writing via email to notify You of Our correction and to allow You to take the most appropriate action in the event of such a correction or mistake."] },
      { heading: "Refunds and Return Policy", paragraphs: ["Due to the nature of the services and/or products provided, refunds will not be given unless otherwise specified in writing."] },
      { heading: "Promotional Pricing Devices and Price Adjustments", paragraphs: ["We are not able to accommodate a price adjustment after Your purchase."] },
      { heading: "Chargebacks", paragraphs: ["You agree to make every attempt to file a refund prior to attempting a chargeback with Your financial institution. In the event of a chargeback attempt, You expressly agree to forfeit any and all of Our bonuses, affiliate bonuses, or other materials afforded to You in exchange for Your original purchase of Our Offering. We reserve the right to present proof of Your access and these Terms and Conditions of Use to the financial institution investigating the dispute."] },
      { heading: "Revocation of Access", paragraphs: ["You have the unilateral right to terminate Your use and access to any of Our Offering(s). Please send an email to Us to initiate this process. Termination will not excuse You of further payment. Upon confirmation of Your termination, any and all outstanding balances will become immediately due and payable. Any existing balance that remains after 14 days from the date of termination will be sent to a collections agency, and You agree to be responsible for any additional charges, fees, or costs associated with such a collection effort, including but not limited to reasonable attorney’s fees and court costs."] },
      { heading: "Currency", paragraphs: ["All payments will be processed in the local currency, or if not specified at checkout, in US Dollars."] },
      { heading: "Taxes", paragraphs: ["Sales taxes will be applied to your order as required by law in either Your or Our local area(s)."] },
      { heading: "Order Reversal or Cancellation", paragraphs: ["We reserve the right to refuse to fulfill any order placed on Our website, in part or in full, and will issue a refund accordingly. We reserve the right to limit or cancel quantities purchased by any given user or household at our sole discretion. We may restrict order quantities based on personal data provided by You, such as orders placed under the same customer account, orders placed on the same payment method, and/or orders that use the same billing and/or shipping address."] },
      { heading: "No Reselling or Distribution of Our Offering", paragraphs: ["We expressly prohibit orders that, in Our sole discretion, appear to be placed in an attempt to resell Our Offering. We expressly prohibit orders placed by resellers, dealers, distributors or wholesalers and will ban Your access to Our site in any lawful way possible if we discover your prohibited use(s)."] },
      { heading: "Dispute Resolution", paragraphs: ["If You and Our Company cannot find a resolution to a dispute or potential claim by means of good-faith negotiation, then You explicitly agree to make a reasonable attempt to resolve any such dispute through Alternative Dispute Resolution or Mediation before filing a civil cause of action."] },
      { heading: "Non-Disparagement", paragraphs: [] },
    ],
  },
]

function TermsSubsection({ subsection }: { subsection: TermsSubsection }) {
  return (
    <div className="terms-subsection">
      <h3>{subsection.heading}</h3>
      {subsection.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {subsection.bulletHeading && <p>{subsection.bulletHeading}</p>}
      {subsection.bullets && <ul>{subsection.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {subsection.secondBulletHeading && <p>{subsection.secondBulletHeading}</p>}
      {subsection.secondBullets && <ul>{subsection.secondBullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {subsection.after?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  )
}

export default function TermsPage() {
  return (
    <main className="privacy-page">
      <header className="privacy-header">
        <Link className="privacy-wordmark" href="/" aria-label="isakii home">isakii</Link>
        <Link className="privacy-back" href="/">← Back home</Link>
      </header>

      <article className="privacy-policy terms-policy">
        <p className="privacy-eyebrow">Legal</p>
        <h1>Terms &amp; Conditions of Use</h1>
        <p className="privacy-updated">Last Updated on <strong>12/09/2026</strong>.</p>
        <p>These are the official Terms and Conditions of Use for ISAKII.NET located at Seoul, South Korea (06348), herein known and referenced as “Company,” “Our,” “We,” and “Us.”</p>
        <p>Our email is <a href="mailto:smkim@isakii.net">smkim@isakii.net</a>. “You” and “Your” refers to users of this Company’s website, communications, products, services and related materials, herein known as “Offering.”</p>
        <p><strong>NOTICE: These Terms and Conditions of Use are legally binding.</strong> It is Your responsibility to read these Terms and Conditions of Use carefully prior to purchase, use, or access of any of Our products, including online courses.</p>

        {termsSections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.subsections?.map((subsection) => (
              <TermsSubsection subsection={subsection} key={subsection.heading} />
            ))}
          </section>
        ))}
      </article>
    </main>
  )
}
