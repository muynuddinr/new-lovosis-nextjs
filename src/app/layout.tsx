import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "./Components/ConditionalNavbar";
import ConditionalFooter from "./Components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
  description: "Buy educational trainer kits, electronic trainer kits, power supply in India, and test & measuring instruments. Premium quality learning equipment for engineering students and professionals.",
  keywords: ["educational trainer kits", "electronic trainer kits", "power supply in india", "test measuring instrument", "trainer kits", "engineering equipment"],
  authors: [{ name: "Lovosis" }],
  creator: "Lovosis",
  publisher: "Lovosis",
  robots: "index, follow",
  alternates: {
    canonical: "https://lovosis.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lovosis.in",
    siteName: "Lovosis",
    title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
    description: "Buy educational trainer kits, electronic trainer kits, power supply in India, and test & measuring instruments. Premium quality learning equipment for engineering students.",
    images: [
      {
        url: "https://lovosis.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lovosis - Trainer Kits and Test Instruments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
    description: "Buy educational trainer kits, electronic trainer kits, power supply in India, and test & measuring instruments.",
    images: ["https://lovosis.in/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Lovosis",
              "url": "https://lovosis.in",
              "logo": "https://lovosis.in/logo0bg.png",
              "description": "Leading supplier of educational trainer kits, electronic trainer kits, power supply systems, and test & measuring instruments for engineering education in India",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "areaServed": "IN"
              },
              "sameAs": [
                "https://www.facebook.com/lovosis",
                "https://www.linkedin.com/company/lovosis"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
