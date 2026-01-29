import Navbar from './Components/Navbar';
import Loader from './Components/Loader';
// import Hero from './Components/Herosection';
import Banner from './Components/Banner';
import Image from './Components/Imagetext';
import Why from './Components/Whychooseus';
import Services from './Components/Ourservices';
import ShuffleHero from './Components/ShuffleHero';
import Faq from './Components/Faq';
import Footer from './Components/Footer';
import FeaturedProducts from './Components/FeaturedProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
  description: "Discover premium educational trainer kits, electronic trainer kits, power supply solutions in India, and advanced test & measuring instruments. Perfect for engineering education and professional training.",
  keywords: ["educational trainer kits", "electronic trainer kits", "power supply india", "test measuring instrument", "engineering trainer kits", "laboratory equipment"],
  openGraph: {
    title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
    description: "Premium quality trainer kits and test instruments for engineering education in India",
    url: "https://lovosis.in",
    type: "website",
  },
};

export default function Home() {
  return (
    <div>
      <Loader />

      <Banner />
       <FeaturedProducts />
      {/* <ShuffleHero /> */}
      {/* <Hero /> */}
      <Image />
         <Services />
     
      <Why />
      <Faq />

    </div>
  );
}
