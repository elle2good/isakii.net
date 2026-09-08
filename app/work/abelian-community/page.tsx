import type { Metadata } from "next"
import AbelianCaseStudy from "@/components/AbelianCaseStudy"

export const metadata: Metadata = {
  title: "Abelian Foundation case study | isakii",
  description:
    "How Lisa Kim bootstrapped a global community around Abelian Foundation's quantum-resistant blockchain technology.",
}

export default function AbelianCommunityCaseStudyPage() {
  return <AbelianCaseStudy />
}
