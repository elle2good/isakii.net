import type { Metadata } from "next"
import AboutExperience from "@/components/AboutExperience"

export const metadata: Metadata = {
  title: "About Lisa Kim",
}

export default function AboutPage() {
  return <AboutExperience />
}
