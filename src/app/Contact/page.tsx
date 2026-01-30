import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Contact from "./Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Lovosis - Educational & Electronic Trainer Kits Supplier",
  description:
    "Get in touch with Lovosis for educational trainer kits, electronic trainer kits, power supply, and test & measuring instruments. Contact us for inquiries and support in India.",
  keywords: [
    // Core Products
    "educational trainer kits",
    "electronic trainer kits",
    "engineering trainer kits",
    "laboratory equipment",
    "test measuring instrument",

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

    // Educational & Lab Equipment
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
  ],
  openGraph: {
    title: "Contact Lovosis - Educational & Electronic Trainer Kits Supplier",
    description: "Contact Lovosis for trainer kits and test instruments",
    url: "https://lovosis.in/Contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Contact />
    </>
  );
}
