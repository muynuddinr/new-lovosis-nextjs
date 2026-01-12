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

export default function Home() {
  return (
    <div>
      <Loader />

      <Banner />
      <ShuffleHero />
      {/* <Hero /> */}
      <Image />
         <Services />
      <Why />
      <Faq />

    </div>
  );
}
