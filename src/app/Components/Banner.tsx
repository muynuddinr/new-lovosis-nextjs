'use client';

import Image from 'next/image';
import Img from '../../../public/Banner 1.jpg'; 
import img2 from '../../../public/Banner 1.jpg'; 

export default function Banner() {
  return (
    <section className="relative w-full h-[50vh] md:h-screen overflow-hidden">
      {/* Desktop Banner */}
      <Image
        src={Img}
        alt="Banner Image"
        fill
        className="hidden md:block object-cover object-center"
        priority
      />
      {/* Mobile Banner */}
      <Image
        src={img2}
        alt="Banner Image Mobile"
        fill
        className="block md:hidden object-cover object-center"
        priority
      />
      {/* Optional overlay for text or effects */}
      <div className="absolute inset-0 bg-black/20"></div>
    </section>
  );
}