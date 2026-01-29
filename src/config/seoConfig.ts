/**
 * SEO Configuration for Lovosis
 * Site: https://lovosis.in
 * Main Keywords: educational trainer kits, electronic trainer kits, power supply in india, test & measuring instrument
 */

export const seoConfig = {
  siteName: "Lovosis",
  siteUrl: "https://lovosis.in",
  defaultTitle: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
  defaultDescription: "Buy educational trainer kits, electronic trainer kits, power supply in India, and test & measuring instruments. Premium quality learning equipment for engineering students and professionals.",
  keywords: [
    "educational trainer kits",
    "electronic trainer kits",
    "power supply in india",
    "test measuring instrument",
    "trainer kits",
    "engineering equipment",
    "laboratory instruments",
    "educational equipment",
  ],
  author: "Lovosis",
  locale: "en_IN",
  image: "https://lovosis.in/og-image.jpg",
  
  // Category Keywords
  categories: {
    educational: {
      keywords: ["educational trainer kits", "learning equipment", "engineering education"],
      description: "Educational trainer kits designed for engineering students and institutions"
    },
    electronic: {
      keywords: ["electronic trainer kits", "electronics learning", "circuit trainer kits"],
      description: "Advanced electronic trainer kits for hands-on electronics education"
    },
    powerSupply: {
      keywords: ["power supply in india", "industrial power supply", "laboratory power supply"],
      description: "Reliable and efficient power supply systems for various applications in India"
    },
    testInstruments: {
      keywords: ["test measuring instrument", "laboratory instruments", "electronic test equipment"],
      description: "Professional test and measuring instruments for laboratories and research"
    }
  },

  // Internal Links Strategy
  internalLinks: {
    products: "/products",
    about: "/Aboutus",
    services: "/Services",
    gallery: "/Gallery",
    contact: "/Contact"
  },

  // Open Graph Settings
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Lovosis"
  },

  // Twitter Card Settings
  twitter: {
    cardType: "summary_large_image",
    handle: "@lovosis"
  },

  // Structured Data
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lovosis",
    "url": "https://lovosis.in",
    "logo": "https://lovosis.in/logo0bg.png",
    "description": "Leading supplier of educational trainer kits, electronic trainer kits, power supply systems, and test & measuring instruments in India"
  }
};

// SEO Best Practices for Content
export const seoBestPractices = {
  titleLength: "Keep between 50-60 characters",
  descriptionLength: "Keep between 150-160 characters",
  headingHierarchy: "Use H1 once, H2-H6 for subheadings",
  imageAlt: "Always include descriptive alt text for images",
  internalLinks: "Link to related pages naturally within content",
  keywords: "Include main keywords in first 100 words",
  mobileOptimized: "Ensure responsive design for mobile devices",
  pageSpeed: "Optimize images and minimize CSS/JS",
  schema: "Include structured data markup",
  canonical: "Define canonical URLs to avoid duplicates"
};
