import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultMetadata, organizationSchema } from "../utils/seo";
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
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  keywords: defaultMetadata.keywords,
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
    title:
      "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
    description:
      "Buy educational trainer kits, electronic trainer kits, power supply in India, and test & measuring instruments. Premium quality learning equipment for engineering students.",
    images: [
      {
        url: "/logo0bg.png",
        width: 1200,
        height: 630,
        alt: "Lovosis - Trainer Kits and Test Instruments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
    description:
      "Buy educational trainer kits, electronic trainer kits, power supply in India, and test & measuring instruments.",
    images: ["/logo0bg.png"],
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
        <link rel="icon" href="/favicon.ico" />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
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
