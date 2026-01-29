import Navbar from '../Components/Navbar';
import ServicesSection from './Services';
import Footer from '../Components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Services - Lovosis | Trainer Kits & Test Instruments Support",
  description: "Explore Lovosis services including technical support, training programs, and consulting for educational trainer kits, electronic trainer kits, and test & measuring instruments.",
  keywords: ["lovosis services", "technical support", "trainer kits support", "engineering training", "equipment consulting"],
  openGraph: {
    title: "Services - Lovosis | Trainer Kits & Test Instruments Support",
    description: "Comprehensive services for educational and electronic trainer kits",
    url: "https://lovosis.in/Services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <div>
     
      <ServicesSection />
  
    </div>
  );
}