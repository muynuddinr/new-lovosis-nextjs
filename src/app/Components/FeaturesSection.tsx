'use client';

import { useState } from 'react';

export default function FeaturesSection() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance with blazing fast load times and smooth interactions.',
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee and data encryption.',
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, responsive design that works perfectly on all devices and browsers.',
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Fully responsive and mobile-first approach for the best user experience.',
    },
    {
      icon: '🔧',
      title: 'Easy Integration',
      description: 'Simple APIs and comprehensive documentation for quick integration.',
    },
    {
      icon: '🚀',
      title: 'Scalable Solution',
      description: 'Built to scale with your business, handling millions of requests daily.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose
            <span className="block bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Lovosis
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver exceptional technology solutions with cutting-edge features and world-class support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:shadow-red-100/50 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Accent Line */}
              <div className="mt-6 h-1 w-0 bg-gradient-to-r from-red-600 to-red-400 group-hover:w-full transition-all duration-300 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform your business with Lovosis?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-200">
              Get Started Now
            </button>
            <button className="px-8 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-300">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
