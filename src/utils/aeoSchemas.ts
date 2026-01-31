// AEO/GEO/AIO Schemas for Lovosis
// These are additional schemas for AI optimization, not replacing existing SEO

// FAQ Schema for FAQ Component
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are educational trainer kits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Educational trainer kits are comprehensive hands-on learning tools designed specifically for engineering students and professionals. They include electronic components, circuit boards, power supplies, and measurement instruments that allow users to build, test, and understand real-world electronic systems. Our kits cover topics from basic electronics to advanced power systems and measurement techniques."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide power supply solutions in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer a complete range of power supply solutions across India. Our manufacturing facilities in Bangalore and Kerala produce AC and DC regulated power supplies, industrial power systems, and custom power solutions. We serve educational institutions, research labs, and industrial clients nationwide with reliable, high-quality power equipment."
      }
    },
    {
      "@type": "Question",
      "name": "What test and measuring instruments do you offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide professional-grade test and measuring instruments including digital storage oscilloscopes (DSO), multimeters, signal generators, spectrum analyzers, and other laboratory equipment. Our instruments are essential for engineering education, research, and quality control in electronics manufacturing."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact Lovosis for inquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can reach us through multiple channels: email us at info@lovosis.in, call +91 7012970281, use our website contact form, or connect via WhatsApp at +91 9747745544. Our technical support team is available Monday to Friday, 9 AM to 6 PM IST, and we typically respond within 24 hours."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer custom educational equipment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! We specialize in custom educational trainer kits and laboratory equipment. Whether you need specific circuit designs, custom power supplies, or specialized measurement tools, our engineering team can design and manufacture solutions tailored to your curriculum requirements and technical specifications."
      }
    },
    {
      "@type": "Question",
      "name": "What is the warranty on your products?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer comprehensive warranty coverage on all our products. Educational trainer kits and laboratory equipment come with a 1-year warranty against manufacturing defects. Power supplies and test instruments have a 2-year warranty. Extended warranty options are available, and our technical support team provides lifetime assistance for proper usage and maintenance."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide training and support for your equipment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer extensive training and support services. This includes user manuals, video tutorials, online documentation, and hands-on training sessions for educators. Our technical support team provides guidance on equipment setup, usage, troubleshooting, and integration into your curriculum. We also offer customized training programs for faculty and students."
      }
    },
    {
      "@type": "Question",
      "name": "Can you deliver to my location in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide nationwide delivery across India with reliable logistics partners. Standard delivery typically takes 3-7 business days depending on your location. Express delivery options are available for urgent requirements. We also offer installation and commissioning services for larger laboratory setups."
      }
    }
  ]
};

// Product Schema Template
export const createProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price?: string;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
  sku?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "Lovosis"
  },
  "category": product.category || "Educational Equipment",
  "offers": {
    "@type": "Offer",
    "price": product.price || "Contact for pricing",
    "priceCurrency": product.currency || "INR",
    "availability": product.availability || "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Lovosis Technologies Pvt Ltd"
    }
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Lovosis Technologies Pvt Ltd"
  }
});

// Service Schema
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Educational Equipment and Training Solutions",
  "description": "Comprehensive educational equipment, trainer kits, power supplies, and test instruments for engineering education and professional training.",
  "provider": {
    "@type": "Organization",
    "name": "Lovosis Technologies Pvt Ltd",
    "url": "https://lovosis.in"
  },
  "serviceType": "Educational Technology",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Product Catalog",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Educational Trainer Kits",
          "description": "Custom educational trainer kits for engineering students"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Power Supply Solutions",
          "description": "AC and DC power supplies for laboratories and industries"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Test & Measuring Instruments",
          "description": "Professional testing equipment and measurement tools"
        }
      }
    ]
  }
};

// Breadcrumb Schema Template
export const createBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

// Local Business Schema (Enhanced Organization)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lovosis Technologies Pvt Ltd",
  "description": "Leading provider of educational equipment, trainer kits, and testing instruments in India",
  "url": "https://lovosis.in",
  "logo": "https://lovosis.in/logo0bg.png",
  "image": "https://lovosis.in/logo0bg.png",
  "telephone": "+91 7012970281",
  "email": "info@lovosis.in",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4-72/2, Swathi Building, 3rd Floor, Opp. Singapura Garden, 1st Main Lakshmipura Road",
    "addressLocality": "Abbigere",
    "addressRegion": "Karnataka",
    "postalCode": "560013",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "13.0827",
    "longitude": "77.4841"
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "priceRange": "$$",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "currenciesAccepted": "INR",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Product Catalog",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Educational Trainer Kits"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Power Supply Systems"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Test & Measuring Instruments"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/p/LovosisTechnology-61572576592724/",
    "https://www.instagram.com/lovosis_technology?igsh=cmt3b2JnYTRhd3gx",
    "https://www.linkedin.com/company/lovosis-technology-private-limited/posts/?feedView=all",
    "https://www.youtube.com/@LovosisTechnology",
    "https://api.whatsapp.com/send/?phone=%2B919747745544&text&type=phone_number&app_absent=0"
  ]
};

// How-To Schema Template (for product usage guides)
export const createHowToSchema = (guide: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": guide.name,
  "description": guide.description,
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Educational Trainer Kit"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Multimeter"
    }
  ],
  "step": guide.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "image": step.image
  }))
});

// Q&A Schema for Product Pages
export const createQASchema = (questions: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "QAPage",
  "mainEntity": questions.map(q => ({
    "@type": "Question",
    "name": q.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer
    }
  }))
});