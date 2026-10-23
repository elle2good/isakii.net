import type { Metadata } from "next"

// Approved copy from the owner’s metadata spreadsheet, 23 October 2026.
const approved: Record<string, Metadata> = {
  "/": {
    "title": "Lisa Kim | Communications & Growth Consultant",
    "description": "Lisa Kim helps early-stage and midsize startups clarify their message and grow through communications, content, and events. Based in Seoul, South Korea.",
    "openGraph": {
      "title": "The Human Agent for Relationships | Lisa Kim",
      "description": "Helping brands find the right words, reach the right people, and build relationships that turn into measurable growth.",
      "images": [
        "https://isakii.net/isakii-preview-logo.png"
      ],
      "url": "https://isakii.net"
    },
    "twitter": {
      "title": "Lisa Kim | Communications & Growth Consultant",
      "description": "Helping brands find the right words, reach the right people, and build relationships that turn into measurable growth.",
      "images": [
        "https://isakii.net/isakii-preview-logo.png"
      ]
    }
  },
  "/grwm": {
    "title": "Take your relationships to the next level in 2027.",
    "description": "Sign up for a free consultation session with growth and communications consultant, Lisa Kim.",
    "openGraph": {
      "title": "Take your relationships to the next level in 2027.",
      "description": "Sign up for a free consultation session with Lisa Kim.",
      "images": [
        "https://isakii.net/consultation/grwm-preview.png"
      ],
      "url": "https://isakii.net/grwm"
    },
    "twitter": {
      "title": "Take your relationships to the next level in 2027.",
      "description": "Sign up for a free consultation session with Lisa Kim.",
      "images": [
        "https://isakii.net/consultation/grwm-preview.png"
      ]
    }
  },
  "/about": {
    "title": "About Lisa Kim",
    "description": "I began my career in consumer AI in 2019. As a natural people pleaser and analytical thinker, I enjoy the process of complex ideas transforming into clear, compelling experiences.",
    "openGraph": {
      "title": "About Lisa Kim",
      "description": "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics.",
      "images": [
        "https://isakii.net/isakii-preview-logo.png"
      ]
    },
    "twitter": {
      "title": "About Lisa Kim",
      "description": "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics.",
      "images": [
        "https://isakii.net/isakii-preview-logo.png"
      ]
    }
  },
  "/analytics-preferences": {
    "title": "Analytics preferences | isakii",
    "description": "Opt out of analytics from iskaii.net",
    "openGraph": {
      "title": "Analytics preferences | isakii",
      "description": "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics.",
      "images": [
        "https://isakii.net/isakii-preview-logo.png"
      ]
    },
    "twitter": {
      "title": "Analytics preferences | isakii",
      "description": "Lisa Kim provides 360° coverage across the non-technical side of tech—from strategy and marketing to community and data analytics.",
      "images": [
        "https://isakii.net/isakii-preview-logo.png"
      ]
    }
  },
  "/catalogue/abelian-community": {
    "title": "Abelian Foundation case study | Lisa Kim",
    "description": " Lisa helped the Abelian Foundation, a pre-revenue startup, turn early promise into real revenue.  [Free Consultation Available]",
    "openGraph": {
      "title": "Abelian Foundation case study | isakii",
      "description": "By bootstrapping a quantum-resistant blockchain community, this company turned early promise into real revenue. Read the full case study to see how.",
      "images": [
        "https://isakii.net/social/abelian-hero.jpg"
      ]
    },
    "twitter": {
      "title": "Abelian Foundation case study | Lisa Kim",
      "description": "By bootstrapping a quantum-resistant blockchain community, this company turned early promise into real revenue. Read the full case study to see how.",
      "images": [
        "https://isakii.net/social/abelian-hero.jpg"
      ]
    }
  },
  "/catalogue/algorand-korea-community": {
    "title": "Algorand Foundation case study | Lisa Kim",
    "description": "Rising competition signals growing interest. Turn that attention into community growth with a targeted campaign. [Free Consultation Available]",
    "openGraph": {
      "title": "Algorand Foundation case study | isakii",
      "description": "Rising competition signals growing interest. Turn that attention into community growth with a targeted campaign.",
      "images": [
        "https://isakii.net/social/algorand-hero.jpg"
      ]
    },
    "twitter": {
      "title": "Algorand Foundation case study | Lisa Kim",
      "description": "Rising competition signals growing interest. Turn that attention into community growth with a targeted campaign.",
      "images": [
        "https://isakii.net/social/algorand-hero.jpg"
      ]
    }
  },
  "/catalogue/cancelled-futures-dinner": {
    "title": "Crisis Resolution case study | Lisa Kim",
    "description": "A VIP event planned for Abu Dhabi Finance Week was cancelled just hours before it began. A case study on how the fallout was managed and lessons learned from it. [Free Consultation Available]",
    "openGraph": {
      "title": "Independent case study | isakii",
      "description": "A VIP event planned for Abu Dhabi Finance Week was cancelled just hours before it began. Managing the fallout sharpened my resilience, and changed how I approach new initiatives. Read the full case study.",
      "images": [
        "https://isakii.net/social/futures-dinner-hero.jpg"
      ]
    },
    "twitter": {
      "title": "Crisis Resolution case study | Lisa Kim",
      "description": "A VIP event planned for Abu Dhabi Finance Week was cancelled just hours before it began. Managing the fallout sharpened my resilience, and changed how I approach new initiatives. Read the full case study.",
      "images": [
        "https://isakii.net/social/futures-dinner-hero.jpg"
      ]
    }
  },
  "/catalogue/raydium-event": {
    "title": "Event Activation case study | isakii",
    "description": "A global protocoll hosted its first offline event in Asia targeting 3 different guest groups. Case study on event planning and operations by Lisa Kim [Free Consultation Available]",
    "openGraph": {
      "title": "Raydium case study | isakii",
      "description": "An anonymous DeFi protocol hosted its first offline event in Asia targeting 3 different guest groups. Read the full case study to find out how.",
      "images": [
        "https://isakii.net/social/raydium-hero.jpg"
      ]
    },
    "twitter": {
      "title": "Event Activation case study | isakii",
      "description": "An anonymous DeFi protocol hosted its first offline event in Asia targeting 3 different guest groups. Read the full case study to find out how.",
      "images": [
        "https://isakii.net/social/raydium-hero.jpg"
      ]
    }
  }
}

export function applyApprovedMetadata(path: string, base: Metadata): Metadata {
  const copy = approved[path.toLowerCase()]
  if (!copy) return base
  return { ...base, ...copy, openGraph: { ...base.openGraph, ...copy.openGraph }, twitter: { ...base.twitter, ...copy.twitter } }
}
