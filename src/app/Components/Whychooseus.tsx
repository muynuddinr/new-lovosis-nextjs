'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Shield, Award, Headphones, Clock } from 'lucide-react';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}

const WhyChooseSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const features: FeatureCard[] = [
    {
      icon: <Package className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Fast & Free Shipping',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    },
    {
      icon: <Shield className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Warranty Protection',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint velit.',
      highlighted: true,
    },
    {
      icon: <Award className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Premium Materials',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqu.',
    },
    {
      icon: <Headphones className="w-8 h-8" strokeWidth={1.5} />,
      title: '24/7 Support',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    },
    {
      icon: <Clock className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Quick Delivery',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint velit.',
    },
  ];

  const redStartIndex = features.findIndex(f => f.highlighted);
  const redCount = Math.floor(scrollProgress * features.length);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = container.offsetHeight;

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.abs(rect.top) / (containerHeight - windowHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (rect.top > 0) {
        setScrollProgress(0);
      } else if (rect.bottom < windowHeight) {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCardStyle = (index: number) => {
    const totalCards = features.length;
    const cardProgress = (scrollProgress * totalCards) - index;
    
    let translateX = 0;
    let opacity = 0.2;
    let scale = 0.95;

    if (cardProgress >= 0 && cardProgress <= 1) {
      translateX = (1 - cardProgress) * (index % 2 === 0 ? -50 : 50);
      opacity = 0.2 + (cardProgress * 0.8);
      scale = 0.95 + (cardProgress * 0.05);
    } else if (cardProgress > 1) {
      translateX = 0;
      opacity = 1;
      scale = 1;
    }

    return { translateX, opacity, scale };
  };

  return (
    <div ref={containerRef} className="w-full min-h-[300vh] bg-white py-32 px-4">
      <div className="sticky top-32 max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-light text-center mb-20 text-gray-900 tracking-tight"
        >
          Why choose us?
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const { translateX, opacity, scale } = getCardStyle(index);
            const isRed = feature.highlighted;
            
            return (
              <div
                key={index}
                className={`transition-all duration-700 ease-out ${
                  index >= features.length - 1 ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''
                }`}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity: opacity,
                }}
              >
                <div
                  className={`p-8 transition-all duration-700 h-64 flex flex-col items-start justify-center hover:scale-105 ${
                    isRed
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className={`mb-5 p-3 ${isRed ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'}`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-lg font-semibold mb-3 uppercase tracking-wider text-sm ${
                    isRed ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed font-light ${
                    isRed ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center gap-2">
          {features.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 transition-all duration-500 ${
                scrollProgress >= index / features.length
                  ? 'bg-red-500 w-12'
                  : 'bg-gray-300 w-8'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;