import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import About from './Aboutus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Lovosis - Educational & Electronic Trainer Kits Manufacturer",
  description: "Learn about Lovosis, a leading provider of educational trainer kits, electronic trainer kits, power supply solutions, and test & measuring instruments for engineering education in India.",
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
  "power supply provider"
],
 openGraph: {
    title: "About Lovosis - Educational & Electronic Trainer Kits Manufacturer",
    description: "Leading manufacturer of educational and electronic trainer kits in India",
    url: "https://lovosis.in/Aboutus",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
    
        <About />

    </>
  );
}