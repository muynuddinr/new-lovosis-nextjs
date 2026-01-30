import { Metadata } from "next";

// ✅ Fully Optimized Metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://lovosis.in"),
  title: {
    default: "Lovosis Technologies Pvt Ltd",
    template: "%s | Lovosis Technologies",
  },
  description:
    "Lovosis Technologies - A leading provider of educational equipment, testing instruments, and digital solutions in India.",
  keywords: [
    // Brand & Company
    "Lovosis Technologies",
    "Bengaluru tech company",
    "digital solutions",

    // Core Products
    "educational trainer kits",
    "educational equipment",
    "educational tools manufacturer",
    "electronic trainer kits",
    "engineering trainer kits",
    "laboratory equipment",
    "laboratory instruments",
    "testing instruments",
    "test measuring instrument",
    "technical training equipment",

    // STEM & Education
    "STEM labs India",
    "science lab solutions",
    "educational technology",
    "technology training tools",
    "engineering lab equipment",
    "engineering lab equipment India",
    "lab equipment India",

    // Power Supply & Instruments
    "power supply india",
    "AC power supply manufacturers in Bangalore",
    "DC power supply manufacturers in Bangalore",
    "AC power supply manufacturers in Kerala",
    "DC power supply manufacturers in Kerala",
    "AC DC regulated power supply manufacturers in Bangalore",
    "AC power supply supplier in Bangalore",
    "DC power supply supplier in Bangalore",

    // Oscilloscopes
    "Digital storage oscilloscope manufacturers in Bangalore",
    "DSO manufacturers in Bangalore",
    "Buy DSO in Bangalore",

    // Educational & Lab Equipment (Location-based)
    "educational equipment manufacturers in Bangalore",
    "educational equipment suppliers in Bangalore",
    "best educational equipment supplier in Bangalore",
    "engineering educational equipment manufacturers in Bangalore",
    "engineering lab equipment manufacturers in Bangalore",
    "electronics lab equipment manufacturers in Bangalore",
    "educational equipment suppliers in Kerala",

    // Near Me Searches
    "engineering educational equipment manufacturers near me",
    "educational equipment suppliers near me",
    "electronics lab equipment suppliers near me",
    "college laboratory equipment suppliers near me",
    "school science lab equipment suppliers near me",

    // Services & Support
    "lovosis services",
    "technical support",
    "trainer kits support",
    "engineering training",
    "equipment consulting",

    // Contact & Inquiry
    "contact Lovosis",
    "trainer kits inquiry",
    "power supply contact",
    "equipment supplier contact",

    // Certifications & Standards
    "certificates",
    "quality certifications",
    "standards",
    "achievements",
    "ISO certifications",

    // About / Brand Identity
    "about Lovosis",
    "trainer kits manufacturer",
    "electronic equipment supplier",
    "power supply provider",
  ],
  authors: [{ name: "Lovosis Technologies Pvt Ltd" }],
  creator: "Lovosis Technologies Pvt Ltd",
  publisher: "Lovosis Technologies Pvt Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Lovosis Technologies Pvt Ltd",
    locale: "en_US",
    url: "https://lovosis.in",
    title: "Lovosis Technologies Pvt Ltd",
    description:
      "Discover cutting-edge educational and testing technology with Lovosis.",
    images: [
      {
        url: "/logo0bg.png",
        width: 1200,
        height: 630,
        alt: "Lovosis Technologies Pvt Ltd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovosis",
    creator: "@lovosis",
    title: "Lovosis Technologies Pvt Ltd",
    description:
      "Discover cutting-edge educational and testing technology with Lovosis.",
    images: ["/navbarlogo/lovosis-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lovosis.in",
    languages: {
      "en-US": "https://lovosis.in/",
      "hi-IN": "https://lovosis.in/",
      "as-IN": "https://lovosis.in/",
      "bn-IN": "https://lovosis.in/",
      "brx-IN": "https://lovosis.in/",
      "doi-IN": "https://lovosis.in/",
      "gu-IN": "https://lovosis.in/",
      "kn-IN": "https://lovosis.in/",
      "ks-IN": "https://lovosis.in/",
      "kok-IN": "https://lovosis.in/",
      "mai-IN": "https://lovosis.in/",
      "ml-IN": "https://lovosis.in/",
      "mni-IN": "https://lovosis.in/",
      "mr-IN": "https://lovosis.in/",
      "ne-IN": "https://lovosis.in/",
      "or-IN": "https://lovosis.in/",
      "pa-IN": "https://lovosis.in/",
      "sa-IN": "https://lovosis.in/",
      "sat-IN": "https://lovosis.in/",
      "sd-IN": "https://lovosis.in/",
      "ta-IN": "https://lovosis.in/",
      "te-IN": "https://lovosis.in/",
      "ur-IN": "https://lovosis.in/",
      "bo-IN": "https://lovosis.in/",
      "dog-IN": "https://lovosis.in/",
      "fr-IN": "https://lovosis.in/",
      "lus-IN": "https://lovosis.in/",
      "smn-IN": "https://lovosis.in/",
    },
  },
  verification: {
    google: "",
  },
  other: {
    "google-site-verification": "",
  },
  generator: "Lovosis Technologies Website",
  applicationName: "Lovosis Technologies",
  referrer: "origin-when-cross-origin",
  manifest: "/site.webmanifest",
};

// ✅ Organization Schema (JSON-LD)
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lovosis Technologies Pvt Ltd",
  description:
    "Leading provider of educational equipment and digital solutions",
  url: "https://lovosis.in",
  logo: "/logo0bg.png",
  foundingDate: "2025-01-16",
  founder: [
    { "@type": "Person", name: "Rasheedali Aliyarmanzil Safarali" },
    { "@type": "Person", name: "Samseeriali Chudchimade House" },
    { "@type": "Person", name: "Abdul Gafoor Abdurahiman" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 7012970281",
    contactType: "customer service",
    email: "info@lovosis.in",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "4-72/2, Swathi Building, 3rd Floor, Opp. Singapura Garden, 1st Main Lakshmipura Road",
    addressLocality: "Abbigere",
    addressRegion: "Karnataka",
    postalCode: "560090",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/p/LovosisTechnology-61572576592724/",
    "https://www.instagram.com/lovosis_technology?igsh=cmt3b2JnYTRhd3gx",
    "https://www.linkedin.com/company/lovosis-technology-private-limited/posts/?feedView=all",
    "https://www.youtube.com/@LovosisTechnology",
    "https://api.whatsapp.com/send/?phone=%2B919747745544&text&type=phone_number&app_absent=0",
  ],
  areaServed: {
    "@type": "Country",
    name: "India",
    alternateName: "IN",
  },
};

// ✅ Dynamic Content Schema (JSON-LD)
export const dynamicContentSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "WebPage",
        "@id": "https://lovosis.in/",
        name: "Home",
        description: "Lovosis Technologies Pvt Ltd - Home Page",
        url: "https://lovosis.in/",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "CollectionPage",
        "@id": "https://lovosis.in/products",
        name: "Products",
        description: "Our complete product catalog",
        url: "https://lovosis.in/products",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "CollectionPage",
        "@id": "https://lovosis.in/certificates",
        name: "Certificates",
        description: "Upcoming and past events",
        url: "https://lovosis.in/certificates",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "CollectionPage",
        "@id": "https://lovosis.in/services",
        name: "Services",
        description: "Our range of services",
        url: "https://lovosis.in/services",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "CollectionPage",
        "@id": "https://lovosis.in/about",
        name: "About",
        description: "Learn more about Lovosis Technologies",
        url: "https://lovosis.in/about",
      },
    },
   
  ],
};

// Helper function to generate dynamic metadata
export const generateDynamicMetadata = (
  type: "products" | "certificates" | "services" | "about" | "home",
  data: any,
): Metadata => {
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images:
        data.images && data.images.length > 0
          ? data.images
          : ["/logo0bg.png"],
      url: `https://lovosis.in/${type}/${data.slug}`,
    },
    alternates: {
      canonical: `https://lovosis.in/${type}/${data.slug}`,
    },
  };
};
