'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import logo from '../../../public/logo0bg.png';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/Aboutus', label: 'About' },
    { href: '/Services', label: 'Services' },
    { href: '/Gallery', label: 'Gallery' },
  ];

  const isActive = (href: string) => pathname === href;
  const isProductsActive = pathname?.startsWith('/products');

  // Conditional styles
  const bgClass = scrolled
    ? 'bg-slate-900 border-red-500/20'
    : 'bg-white/95 border-gray-100/50';
  const textClass = scrolled ? 'text-white' : 'text-gray-900';
  const linkClass = scrolled
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-600 hover:text-red-600';
  const activeClass = scrolled ? 'text-red-400' : 'text-red-600';

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 border-b ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={logo.src}
              alt="Lovosis Logo"
              className="w-24 h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${isActive(item.href) ? activeClass : linkClass
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                onMouseEnter={() => setProductsOpen(true)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${isProductsActive ? activeClass : linkClass
                  }`}
              >
                Products
                <ChevronDown
                  size={16}
                  className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {productsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setProductsOpen(false)}
                  >
                    All Products
                  </Link>
                  {categories.length > 0 && (
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => setProductsOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/Contact"
              className="hidden md:inline-block px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-all"
            >
              Contact
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              aria-label="Menu"
            >
              <span
                className={`w-5 h-0.5 rounded-full transition-all ${scrolled ? 'bg-white' : 'bg-gray-700'
                  } ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
              />
              <span
                className={`w-5 h-0.5 rounded-full transition-all ${scrolled ? 'bg-white' : 'bg-gray-700'
                  } ${isOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`w-5 h-0.5 rounded-full transition-all ${scrolled ? 'bg-white' : 'bg-gray-700'
                  } ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`lg:hidden pb-4 border-t transition-colors ${scrolled ? 'border-blue-500/20 bg-slate-800/50' : 'border-gray-100'}`}>
            <div className="space-y-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                      ? scrolled ? 'text-red-400 bg-white/10' : 'text-red-600 bg-red-50'
                      : linkClass
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Products Section */}
              <div className="px-4 py-2">
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm font-medium mb-2 ${isProductsActive ? activeClass : linkClass}`}
                >
                  Products
                </Link>
                {categories.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`block text-sm py-1 ${linkClass}`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/Contact"
                onClick={() => setIsOpen(false)}
                className="block mt-3 mx-4 px-4 py-2 text-sm font-semibold text-center text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}