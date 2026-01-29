import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Contact from "./Contact";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Lovosis - Educational & Electronic Trainer Kits Supplier",
  description: "Get in touch with Lovosis for educational trainer kits, electronic trainer kits, power supply, and test & measuring instruments. Contact us for inquiries and support in India.",
  keywords: ["contact Lovosis", "trainer kits inquiry", "power supply contact", "equipment supplier contact"],
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
