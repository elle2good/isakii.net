import Navigation from "@/components/Navigation"

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navigation />
      <section className="about-content">
        <div className="about-copy">
          <span className="about-kicker">ABOUT</span>
          <div className="about-rule" />
          <h1>Lisa Kim</h1>
          <div className="about-body">
            <p>Lisa Kim (b. 1996, Seoul) is a writer, artist, and GTM specialist.</p>
            <p>Having grown up across three continents, she was impacted at a young age by the different conventions of each world. English language connected them all, shaping her love for communication and writing.</p>
            <p>Lisa writes mostly in English for its fluidity, and then translates it into Korean.</p>
            <p>Before becoming nomadic in 2023, Lisa closed the retail business she had founded in Seoul as a college sophomore. Over the next two years, she traveled across 14 countries, taking in the world beyond what&apos;s shown in media.</p>
            <p>As a growth specialist, Lisa has helped numerous tech companies strengthen their communities. In 2025, she co-hosted a morning café rave in her hometown in partnership with Raydium Protocol and Unborn Sounds.</p>
          </div>
        </div>
        <img className="about-portrait" src="/lisa-kim.png" alt="Lisa Kim" />
      </section>
    </main>
  )
}
