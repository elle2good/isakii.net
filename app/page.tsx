import HomeHeader from "@/components/HomeHeader"
import SmoothScroll from "@/components/SmoothScroll"

export default function Home() {
  return (
    <main className="home-page">
      <SmoothScroll intensity={10} />
      <HomeHeader />
      <div id="overlay" />
    </main>
  )
}
