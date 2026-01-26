'use client';

import Image from 'next/image';

export default function Banner() {
  return (
    <section className="relative w-full h-[50vh] md:h-screen overflow-hidden">
      {/* Desktop Banner */}
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
        alt="Banner Image"
        fill
        className="hidden md:block object-cover object-center"
        priority
      />
      {/* Mobile Banner */}
      <Image
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=768&h=1024&fit=crop"
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