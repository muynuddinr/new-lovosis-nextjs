import { Metadata } from "next";
import ProductsPageClient from "./ProductsClient";
import { createBreadcrumbSchema } from "../../utils/aeoSchemas";

export const dynamic = "force-dynamic";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
}

async function getCategories(): Promise<Category[]> {
  try {
    // Use relative URL for server-side fetches in Next.js
    // This automatically uses the correct domain in production
    const url = "/api/categories";

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/* ============================
   SEO METADATA
============================ */

export const metadata: Metadata = {
  title: "Product Categories | Lovosis Technologies Pvt. Ltd.",
  description:
    "Explore our wide range of product categories. Find high-quality industrial equipment and supplies at Lovosis Technology Pvt Ltd.",
  keywords:
    "industrial products, equipment categories, Lovosis Technology Pvt Ltd products, industrial supplies",
  openGraph: {
    title: "Product Categories | Lovosis Technologies Pvt. Ltd.",
    description:
      "Explore our wide range of product categories. Find high-quality industrial equipment and supplies at Lovosis Technology Pvt Ltd.",
    type: "website",
    locale: "en_US",
    siteName: "Lovosis Technologies Pvt. Ltd.",
    url: "https://lovosis.in/products",
    images: [
      {
        url: "/logo0bg.jpg", // Make sure to add an OG image in your public folder
        width: 1200,
        height: 630,
        alt: "Lovosis Technology Pvt Ltd Product Categories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Categories | Lovosis Technologies Pvt. Ltd.",
    description:
      "Explore our wide range of product categories. Find high-quality industrial equipment and supplies at Lovosis Technology Pvt Ltd.",
    images: ["/logo0bg.jpg"], // Same as OG image
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lovosis.in/products",
  },
  other: {
    "alternate-url-1": "https://educationaltrainerkits.com/products",
    "alternate-url-2": "https://electricaltrainerkits.com/products",
  },
};
/* ============================
   PAGE
============================ */

export default async function ProductsPage() {
  const categories = await getCategories();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://lovosis.in" },
    { name: "Products", url: "https://lovosis.in/products" }
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
      <ProductsPageClient categories={categories} />
    </>
  );
}
