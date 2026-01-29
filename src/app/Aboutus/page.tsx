import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import About from './Aboutus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Lovosis - Educational & Electronic Trainer Kits Manufacturer",
  description: "Learn about Lovosis, a leading provider of educational trainer kits, electronic trainer kits, power supply solutions, and test & measuring instruments for engineering education in India.",
  keywords: ["about Lovosis", "trainer kits manufacturer", "electronic equipment supplier", "power supply provider"],
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