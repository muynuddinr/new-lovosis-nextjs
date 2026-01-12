'use client';

import Image from 'next/image';

export default function ImageText() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Advanced Electronics Circuit Board"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Cutting-Edge
                <span className="block text-red-600">Electronics Innovation</span>
              </h2>
              <div className="w-20 h-1 bg-red-600 mt-4"></div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              Our team of expert engineers combines decades of experience with the latest technology to deliver
              innovative electronics solutions. From concept to production, we ensure every component meets the
              highest standards of quality and performance.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600"></div>
                  <span className="font-semibold text-gray-900">Custom Design</span>
                </div>
                <p className="text-sm text-gray-600">Tailored solutions for your specific needs</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600"></div>
                  <span className="font-semibold text-gray-900">Quality Assurance</span>
                </div>
                <p className="text-sm text-gray-600">Rigorous testing and certification</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600"></div>
                  <span className="font-semibold text-gray-900">Rapid Prototyping</span>
                </div>
                <p className="text-sm text-gray-600">Fast turnaround for proof of concepts</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600"></div>
                  <span className="font-semibold text-gray-900">Full Production</span>
                </div>
                <p className="text-sm text-gray-600">Scalable manufacturing solutions</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                View Our Work
              </button>
              <button className="px-8 py-3 border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition-all duration-300">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
