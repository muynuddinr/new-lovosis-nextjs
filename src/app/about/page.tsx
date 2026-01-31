import About from "./Aboutus";
import type { Metadata } from "next";
import { createBreadcrumbSchema } from "../../utils/aeoSchemas";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Lovosis - Educational & Electronic Trainer Kits Manufacturer",
    description:
      "Learn about Lovosis, a leading provider of educational trainer kits...",
    alternates: {
      canonical: "https://lovosis.in/about",
    },
    openGraph: {
      title: "About Lovosis - Educational & Electronic Trainer Kits Manufacturer",
      description:
        "Leading manufacturer of educational and electronic trainer kits in India",
      url: "https://lovosis.in/about",
      type: "website",
    },
    other: {
      'alternate-url-1': 'https://educationaltrainerkits.com/about',
      'alternate-url-2': 'https://electricaltrainerkits.com/about',
    },
  };
}

export default function AboutPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://lovosis.in" },
    { name: "About", url: "https://lovosis.in/about" }
  ]);

  return (
    <>
      {/* Breadcrumb Schema for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <About />
    </>
  );
}