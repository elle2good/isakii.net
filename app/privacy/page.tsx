import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | isakii",
  description: "The isakii.net privacy policy.",
}

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <header className="privacy-header">
        <Link className="privacy-wordmark" href="/" aria-label="isakii home">isakii</Link>
        <Link className="privacy-back" href="/">← Back home</Link>
      </header>

      <article className="privacy-policy">
        <p className="privacy-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last Updated on <strong>09/12/2026</strong></p>

        <p>
          This Privacy policy (“Policy”) will help you understand how <strong>LISA KIM</strong> (“Provider”)
          uses and protects the data you provide to LISA KIM when you visit the website at <strong>isakii.net</strong> (“Website”),
          use our goods or services, or otherwise interact with isakii.net (collective “Services”).
        </p>
        <p>
          LISA KIM reserves the right to change this Policy at any given time, of which you will be promptly updated.
          If you want to make sure that you are up to date with the latest changes, LISA KIM advises you to frequently visit this page.
        </p>

        <section>
          <h2>LISA KIM COLLECTS</h2>
          <p>LISA KIM collects the following data:</p>
          <ul>
            <li>Your IP address;</li>
            <li>Your contact information and email address;</li>
            <li>Your browser and device information;</li>
            <li>Data regarding your online behavior on the Website; and</li>
            <li>Other information you volunteer to LISA KIM.</li>
          </ul>
        </section>

        <section>
          <h2>WHY LISA KIM COLLECTS YOUR DATA</h2>
          <p>Provider collects your data for the following several reasons:</p>
          <ul>
            <li>To provide you Services.</li>
            <li>To process payments.</li>
            <li>To better understand your needs.</li>
            <li>To improve Services.</li>
            <li>To send updates and marketing communications.</li>
            <li>To respond to support inquiries.</li>
            <li>To contact you to fill out surveys and participate in other types of market research.</li>
            <li>To customize Website according to your online behavior and personal preferences.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2>HOW WE SHARE YOUR INFORMATION</h2>
          <p>We may share your data with the following:</p>
          <ul>
            <li>Service providers (e.g., payment processors, cloud services);</li>
            <li>Legal authorities or to comply with the legal process;</li>
            <li>Affiliates and subsidiaries, if any;</li>
            <li>Upon merger or acquisition; and</li>
            <li>Other entities with your consent.</li>
          </ul>
        </section>

        <section>
          <h2>SAFEGUARDING AND SECURITY THE DATA</h2>
          <p>
            LISA KIM is committed to securing your data and keeping it confidential. LISA KIM reasonably prevents data theft,
            unauthorized access and disclosure by implementing the latest technologies and software, which help us safeguard all
            the information LISA KIM collects online. However, no method of transmission or storage is 100% secure.
          </p>
        </section>

        <section>
          <h2>DATA RETENTION</h2>
          <p>
            LISA KIM retains your personal information only as long as necessary to fulfill the purposes outlined in this Policy,
            unless a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2>OUR COOKIE POLICY</h2>
          <p>
            LISA KIM uses cookies and similar technology (collectively “Cookies”) to collect data regarding your online behavior,
            such as analyzing web traffic, web pages you visit and on which you spend time. Company uses Cookies to:
          </p>
          <ul>
            <li>Enhance your browsing experience;</li>
            <li>Measure site usage; and</li>
            <li>Serve targeted advertisements with your consent.</li>
          </ul>
          <p>
            You can manage Cookies by adjusting your preferences as your browser or device permits. However, if you adjust your
            preferences, Services may not work properly.
          </p>
          <p>
            The online advertising industry also provides websites from which you may opt out of receiving targeted ads from
            organizations that participate in self-regulatory programs. You can access these and learn more about targeted advertising
            and consumer choice and privacy by visiting the Network Advertising Initiative, the Digital Advertising Alliance, the
            European Digital Advertising Alliance, and the Digital Advertising Alliance of Canada.
          </p>
        </section>

        <section>
          <h2>LINKS TO OTHER WEBSITES</h2>
          <p>
            isakii.net contains links that lead to other websites. If you click on these links, LISA KIM is not held responsible for
            your data and privacy protection. Visiting those websites is not governed by this Policy. Make sure you read the Privacy
            policy documentation of the website you visit.
          </p>
        </section>

        <section>
          <h2>YOUR RIGHTS AND CHOICES</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the data LISA KIM holds about you.</li>
            <li>Correct or delete your information.</li>
            <li>Object to data processing.</li>
            <li>Withdraw consent.</li>
            <li>Port your data.</li>
            <li>Erase your data.</li>
          </ul>
          <p>To exercise these rights, contact LISA KIM at <a href="mailto:smkim@isakii.net">smkim@isakii.net</a>.</p>
        </section>

        <section>
          <h2>INTERNATIONAL DATA TRANSFERS</h2>
          <p>
            If you are located outside the United States, your data may be transferred and processed in the U.S. or other countries
            where our service providers are located.
          </p>
        </section>

        <section>
          <h2>CONTACT US</h2>
          <p>
            If you have any questions or comments about this Policy, contact LISA KIM at{" "}
            <a href="mailto:smkim@isakii.net">smkim@isakii.net</a>.
          </p>
        </section>
      </article>
    </main>
  )
}
