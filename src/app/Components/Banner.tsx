'use client';

import Image from 'next/image';
import bannerImage from '../../../public/Banner 1.jpg'; // Change this to your actual image path

export default function Banner() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Image
        src={bannerImage}
        alt="Banner Image"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Optional overlay for text or effects */}
      <div className="absolute inset-0 bg-black/20"></div>
    </section>
  );
}