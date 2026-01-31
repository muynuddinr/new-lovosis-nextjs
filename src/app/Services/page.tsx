import Navbar from "../Components/Navbar";
import ServicesSection from "./Services";
import Footer from "../Components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Lovosis | Trainer Kits & Test Instruments Support",
  description:
    "Explore Lovosis services including technical support, training programs, and consulting for educational trainer kits, electronic trainer kits, and test & measuring instruments.",
  keywords: [
    "educational trainer kits",
    "electronic trainer kits",
    "engineering trainer kits",
    "laboratory equipment",
    "test measuring instrument",

    "power supply india",
    "AC power supply manufacturers in Bangalore",
    "DC power supply manufacturers in Bangalore",
    "AC power supply manufacturers in Kerala",
    "DC power supply manufacturers in Kerala",
    "AC DC regulated power supply manufacturers in Bangalore",
    "AC power supply supplier in Bangalore",
    "DC power supply supplier in Bangalore",

    "Digital storage oscilloscope manufacturers in Bangalore",
    "DSO manufacturers in Bangalore",
    "Buy DSO in Bangalore",

    "educational equipment manufacturers in Bangalore",
    "educational equipment suppliers in Bangalore",
    "best educational equipment supplier in Bangalore",

    "engineering educational equipment manufacturers in Bangalore",
    "engineering lab equipment manufacturers in Bangalore",
    "electronics lab equipment manufacturers in Bangalore",

    "educational equipment suppliers in Kerala",

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
  ],
  openGraph: {
    title: "Services - Lovosis | Trainer Kits & Test Instruments Support",
    description:
      "Comprehensive services for educational and electronic trainer kits",
    url: "https://lovosis.in/Services",
    type: "website",
  },
   alternates: {
      canonical: "https://lovosis.in/services",
    },
     other: {
      'alternate-url-1': 'https://educationaltrainerkits.com/services',
      'alternate-url-2': 'https://electricaltrainerkits.com/services',
    },
};

export default function ServicesPage() {
  return (
    <div>
      <ServicesSection />
    </div>
  );
}
