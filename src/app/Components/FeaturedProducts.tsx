"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  sub_category?: {
    id: string;
    name: string;
    slug: string;
  };
  super_sub_category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Get products rotated based on day of year
  const getRotatedProducts = (allProducts: Product[], count: number = 8) => {
    if (allProducts.length === 0) return [];
    
    // Get day of year to rotate products daily
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Rotate array based on day of year
    const rotateBy = dayOfYear % allProducts.length;
    const rotated = [...allProducts.slice(rotateBy), ...allProducts.slice(0, rotateBy)];
    
    return rotated.slice(0, count);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Get all products with images and rotate them daily
        const productsWithImages = data.products.filter((product: Product) => product.image_url);
        const rotatedProducts = getRotatedProducts(productsWithImages, 8);
        
        setProducts(rotatedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-scroll functionality with infinite loop
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 324;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const newPosition = container.scrollLeft + cardWidth;

        if (newPosition >= maxScroll - 10) {
          // Seamlessly jump back to start
          container.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          container.scrollTo({ left: newPosition, behavior: 'smooth' });
        }
      }
    }, 3000); // Slide every 3 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, products.length]);

  const updateScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 324; // 300px width + 24px gap
      const rawIndex = Math.round(container.scrollLeft / cardWidth);
      // Normalize index to original products array length (8 products)
      const index = rawIndex % products.length;
      setCurrentIndex(index);
    }
  }, [products.length]);

  const scroll = (direction: 'left' | 'right', isAuto: boolean = false) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 324;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      let newScrollPosition;
      
      if (direction === 'right') {
        newScrollPosition = container.scrollLeft + cardWidth;
        // Loop back to start
        if (newScrollPosition >= maxScroll && isAuto) {
          newScrollPosition = 0;
        }
      } else {
        newScrollPosition = Math.max(0, container.scrollLeft - cardWidth);
      }
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });

      // Pause auto-play when user manually scrolls
      if (!isAuto) {
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-28 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Section Header - Minimal & Bold */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-transparent"></div>
            <span className="text-red-600 font-bold text-sm uppercase tracking-widest">Our Products</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-5 leading-[0.95]">
            Discover Our<br />
            <span className="text-red-600">Latest Collection</span>
          </h2>
          <p className="text-gray-600 text-base max-w-2xl">
            Explore cutting-edge educational equipment and innovative technology solutions that transform learning experiences
          </p>
        </div>

        {/* Carousel with Minimal Navigation */}
        <div className="relative">
          {/* Minimalist Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <button
                onClick={() => scroll('left', false)}
                className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-red-600 hover:bg-red-50 transition-all duration-300 group"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-red-600" strokeWidth={2} />
              </button>
              <button
                onClick={() => scroll('right', false)}
                className="w-14 h-14 rounded-full bg-red-600 border-2 border-red-600 flex items-center justify-center hover:bg-red-700 transition-all duration-300 group"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-white" strokeWidth={2} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900">{String(currentIndex + 1).padStart(2, '0')}</span>
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / products.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-400">{String(products.length).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Products Slider - Simple & Elegant */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollPosition}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Show products once */}
            {products.map((product, index) => (
              <Link 
                key={`${product.id}-${index}`}
                href={`/product/${product.slug}`}
                className="group flex-shrink-0 w-[300px] animate-fade-in-up"
                style={{ animationDelay: `${(index % products.length) * 100}ms` }}
              >
                <div className="h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Image Section */}
                  <div className="relative h-[260px] overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-lg">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 min-h-[44px] group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Simple CTA */}
                    <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs">
                      <span>View Product</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = 324; // 300px + 24px gap
                  scrollContainerRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: 'smooth'
                  });
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index 
                  ? 'w-10 h-2 bg-red-600' 
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Ready to explore more?</h3>
            <p className="text-gray-300 text-base">Browse our complete product catalog</p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-base hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl whitespace-nowrap"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FeaturedProducts;
