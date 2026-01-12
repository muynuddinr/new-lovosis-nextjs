'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Strategic Ads',
    description: 'Enhance your business with our AI-powered advertising solutions for better reach and results.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Brand Identity',
    description: 'Get amazing art and visuals with our innovative branding solutions for your business.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Human Resources',
    description: 'Get amazing HR solutions with our innovative management tools for your business.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Project Management',
    description: 'Enhance your business with our AI-powered project tracking solutions for better efficiency.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Design',
    description: 'Get amazing art and visuals with our innovative design solutions for your business.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Search Optimization',
    description: 'Enhance your business with our AI-powered SEO solutions for better online visibility.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Our Services</h2>
            <p className="text-slate-600 max-w-2xl">
              Empowering European digital marketing agencies to market their business with advanced AI tools for better results.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-400 hover:bg-red-500 text-slate-900 px-6 py-2 font-semibold transition-colors"
          >
            Get Started
          </motion.button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isHovered = hoveredCard === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="perspective-1000"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  animate={{
                    rotateX: isHovered ? -5 : 0,
                    rotateY: isHovered ? 5 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative p-8 overflow-hidden cursor-pointer bg-white"
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: isHovered
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Background Image - Slides in from right */}
                  <motion.div
                    animate={{
                      x: isHovered ? 0 : '100%',
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-0"
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-red-800/90"></div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-14 h-14 flex items-center justify-center mb-6 transition-colors ${
                        isHovered
                          ? 'bg-white text-red-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {service.icon}
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      animate={{
                        x: isHovered ? 5 : 0,
                      }}
                      className={`text-xl font-bold mb-3 transition-colors ${
                        isHovered ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {service.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      animate={{
                        x: isHovered ? 5 : 0,
                      }}
                      transition={{ delay: 0.05 }}
                      className={`text-sm leading-relaxed mb-6 transition-colors ${
                        isHovered ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      {service.description}
                    </motion.p>

                    {/* Learn More Link */}
                    <motion.div
                      animate={{
                        x: isHovered ? 10 : 0,
                      }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isHovered ? 'text-white' : 'text-red-600'
                        }`}
                      >
                        Learn more
                      </span>
                      <motion.span
                        animate={{
                          x: isHovered ? 5 : 0,
                        }}
                        className={`text-lg transition-colors ${
                          isHovered ? 'text-white' : 'text-red-600'
                        }`}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}