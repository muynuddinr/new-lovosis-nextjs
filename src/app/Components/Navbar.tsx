'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import logo from '../../../public/logo0bg.png';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

interface SuperSubCategory {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<{ [key: string]: SubCategory[] }>({});
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);
  const [superSubCategories, setSuperSubCategories] = useState<{ [key: string]: SuperSubCategory[] }>({});
  const [hoveredSuperSubCategory, setHoveredSuperSubCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState({ sub: false, superSub: false, products: false });
  
  // Mobile menu states
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<string | null>(null);
  const [mobileSelectedSubCategory, setMobileSelectedSubCategory] = useState<string | null>(null);
  const [mobileSelectedSuperSubCategory, setMobileSelectedSuperSubCategory] = useState<string | null>(null);
  
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
        setHoveredCategory(null);
        setHoveredSubCategory(null);
        setHoveredSuperSubCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch subcategories when category is hovered
  const handleCategoryHover = async (categorySlug: string) => {
    setHoveredCategory(categorySlug);
    setHoveredSubCategory(null);
    setHoveredSuperSubCategory(null);
    
    if (!subCategories[categorySlug]) {
      setLoading(prev => ({ ...prev, sub: true }));
      try {
        const response = await fetch(`/api/categories/${categorySlug}`);
        if (response.ok) {
          const data = await response.json();
          setSubCategories(prev => ({
            ...prev,
            [categorySlug]: data.subCategories || []
          }));
          // Store products directly under this category
          if (data.products && data.products.length > 0) {
            setProducts(prev => ({
              ...prev,
              [`category-${categorySlug}`]: data.products
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setLoading(prev => ({ ...prev, sub: false }));
      }
    }
  };

  // Fetch super subcategories when subcategory is hovered
  const handleSubCategoryHover = async (subCategorySlug: string) => {
    setHoveredSubCategory(subCategorySlug);
    setHoveredSuperSubCategory(null);
    
    if (!superSubCategories[subCategorySlug]) {
      setLoading(prev => ({ ...prev, superSub: true }));
      try {
        const response = await fetch(`/api/subcategories/${subCategorySlug}`);
        if (response.ok) {
          const data = await response.json();
          setSuperSubCategories(prev => ({
            ...prev,
            [subCategorySlug]: data.superSubCategories || []
          }));
          // Store products directly under this subcategory
          if (data.products && data.products.length > 0) {
            setProducts(prev => ({
              ...prev,
              [`subcategory-${subCategorySlug}`]: data.products
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch super subcategories:', error);
      } finally {
        setLoading(prev => ({ ...prev, superSub: false }));
      }
    }
  };

  // Fetch products when super subcategory is hovered
  const handleSuperSubCategoryHover = async (superSubCategorySlug: string) => {
    setHoveredSuperSubCategory(superSubCategorySlug);
    
    if (!products[superSubCategorySlug]) {
      setLoading(prev => ({ ...prev, products: true }));
      try {
        const response = await fetch(`/api/super-subcategories/${superSubCategorySlug}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(prev => ({
            ...prev,
            [superSubCategorySlug]: data.products || []
          }));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    }
  };

  // Mobile menu handlers
  const handleMobileCategoryClick = async (categorySlug: string) => {
    setMobileSelectedCategory(categorySlug);
    setMobileSelectedSubCategory(null);
    setMobileSelectedSuperSubCategory(null);
    
    if (!subCategories[categorySlug]) {
      setLoading(prev => ({ ...prev, sub: true }));
      try {
        const response = await fetch(`/api/categories/${categorySlug}`);
        if (response.ok) {
          const data = await response.json();
          setSubCategories(prev => ({
            ...prev,
            [categorySlug]: data.subCategories || []
          }));
          // Store products directly under this category
          if (data.products && data.products.length > 0) {
            setProducts(prev => ({
              ...prev,
              [`category-${categorySlug}`]: data.products
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setLoading(prev => ({ ...prev, sub: false }));
      }
    }
  };

  const handleMobileSubCategoryClick = async (subCategorySlug: string) => {
    setMobileSelectedSubCategory(subCategorySlug);
    setMobileSelectedSuperSubCategory(null);
    
    if (!superSubCategories[subCategorySlug]) {
      setLoading(prev => ({ ...prev, superSub: true }));
      try {
        const response = await fetch(`/api/subcategories/${subCategorySlug}`);
        if (response.ok) {
          const data = await response.json();
          setSuperSubCategories(prev => ({
            ...prev,
            [subCategorySlug]: data.superSubCategories || []
          }));
          // Store products directly under this subcategory
          if (data.products && data.products.length > 0) {
            setProducts(prev => ({
              ...prev,
              [`subcategory-${subCategorySlug}`]: data.products
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch super subcategories:', error);
      } finally {
        setLoading(prev => ({ ...prev, superSub: false }));
      }
    }
  };

  const handleMobileSuperSubCategoryClick = async (superSubCategorySlug: string) => {
    setMobileSelectedSuperSubCategory(superSubCategorySlug);
    
    if (!products[superSubCategorySlug]) {
      setLoading(prev => ({ ...prev, products: true }));
      try {
        const response = await fetch(`/api/super-subcategories/${superSubCategorySlug}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(prev => ({
            ...prev,
            [superSubCategorySlug]: data.products || []
          }));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    }
  };

  const handleMobileBack = () => {
    if (mobileSelectedSuperSubCategory) {
      setMobileSelectedSuperSubCategory(null);
    } else if (mobileSelectedSubCategory) {
      setMobileSelectedSubCategory(null);
    } else if (mobileSelectedCategory) {
      setMobileSelectedCategory(null);
    } else {
      setMobileProductsOpen(false);
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/Services', label: 'Services' },
    { href: '/Certificates', label: 'Certificates' },
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
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo.src}
              alt="Lovosis Logo"
              className="w-24 h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.label === 'Products') {
                return (
                  <div key={item.href} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProductsOpen(!productsOpen)}
                      onMouseEnter={() => {
                        setProductsOpen(true);
                        // Auto-select first category when dropdown opens
                        if (categories.length > 0 && !hoveredCategory) {
                          handleCategoryHover(categories[0].slug);
                        }
                      }}
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
                        className="absolute top-full left-3/2 -translate-x-1/2 mt-6 bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 w-[900px] md:w-[1000px] lg:w-[1100px] xl:w-[1200px] max-w-[90vw] overflow-hidden"
                        onMouseLeave={() => {
                          setProductsOpen(false);
                          setHoveredCategory(null);
                          setHoveredSubCategory(null);
                          setHoveredSuperSubCategory(null);
                        }}
                      >
                        <div className="flex min-h-[350px] md:min-h-[400px] lg:min-h-[420px] max-h-[450px] md:max-h-[500px] lg:max-h-[520px] overflow-x-auto">
                          {/* Column 1 - Categories (always visible) */}
                          <div className="w-56 bg-gradient-to-br from-slate-50 via-white to-slate-50 py-3 md:py-4 flex-shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border-r border-gray-100">
                            <div className="px-3 md:px-4 lg:px-5 mb-2 md:mb-3">
                              <h3 className="text-[10px] md:text-xs font-bold text-gray-800 mb-0.5">
                                Categories
                              </h3>
                              <p className="text-[10px] md:text-[11px] text-gray-500">Browse products</p>
                            </div>
                            
                            <Link
                              href="/products"
                              className="flex items-center justify-between px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-[10px] md:text-xs text-gray-900 hover:bg-red-50 hover:text-red-600 transition-all font-semibold group mx-2 md:mx-2.5 rounded-lg"
                              onClick={() => setProductsOpen(false)}
                            >
                              <span>View All Products</span>
                              <ChevronRight size={14} className="md:size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            
                            <div className="my-2 md:my-3 lg:my-4 border-t border-gray-200 mx-2 md:mx-3" />
                            
                            {categories.length > 0 ? (
                              <div className="space-y-0.5 px-2 md:px-2.5">
                                {categories.map((category) => (
                                  <div
                                    key={category.id}
                                    onMouseEnter={() => handleCategoryHover(category.slug)}
                                    className={`group relative transition-all duration-200 rounded-md ${
                                      hoveredCategory === category.slug
                                        ? 'bg-gradient-to-r from-red-50 to-red-50/50'
                                        : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <Link
                                      href={`/products/${category.slug}`}
                                      onClick={() => setProductsOpen(false)}
                                      className="flex items-center gap-2 px-2 md:px-2.5 lg:px-3 py-2 md:py-2.5 text-[10px] md:text-xs"
                                    >
                                      {category.image_url && (
                                        <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                          <img 
                                            src={category.image_url} 
                                            alt={category.name} 
                                            className="w-full h-full object-cover" 
                                          />
                                        </div>
                                      )}
                                      <span className={`font-medium transition-colors flex-1 ${
                                        hoveredCategory === category.slug
                                          ? 'text-red-600'
                                          : 'text-gray-700 group-hover:text-gray-900'
                                      }`}>
                                        {category.name}
                                      </span>
                                      <ChevronRight 
                                        size={12} 
                                        className={`md:size-3.5 transition-all flex-shrink-0 ${
                                          hoveredCategory === category.slug
                                            ? 'text-red-600 translate-x-1'
                                            : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                      />
                                    </Link>
                                    {hoveredCategory === category.slug && (
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-full" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="px-6 py-8 text-center">
                                <p className="text-sm text-gray-400">No categories available</p>
                              </div>
                            )}
                          </div>

                          {/* Column 2 - Subcategories with Images */}
                          {hoveredCategory && (
                            <div className="w-72 bg-white px-3 md:px-4 lg:px-5 py-3 md:py-4 max-h-[450px] md:max-h-[500px] lg:max-h-[520px] overflow-y-auto animate-slideIn scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border-r border-gray-100 flex-shrink-0">
                              <div className="mb-2 md:mb-3">
                                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">
                                  {categories.find(c => c.slug === hoveredCategory)?.name}
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-500">Select subcategory</p>
                              </div>
                              
                              {loading.sub ? (
                                <div className="flex items-center justify-center py-20">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                              ) : subCategories[hoveredCategory]?.length > 0 ? (
                                <div className="space-y-1">
                                  {subCategories[hoveredCategory].map((subCategory) => (
                                    <div
                                      key={subCategory.id}
                                      onMouseEnter={() => handleSubCategoryHover(subCategory.slug)}
                                      className="group cursor-pointer"
                                    >
                                      <Link
                                        href={`/products/${hoveredCategory}/${subCategory.slug}`}
                                        onClick={() => setProductsOpen(false)}
                                        className={`flex items-center gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-all ${
                                          hoveredSubCategory === subCategory.slug
                                            ? 'bg-red-50 text-red-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                      >
                                        {subCategory.image_url && (
                                          <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img 
                                              src={subCategory.image_url} 
                                              alt={subCategory.name} 
                                              className="w-full h-full object-cover" 
                                            />
                                          </div>
                                        )}
                                        <span className="text-xs md:text-sm font-medium flex-1">{subCategory.name}</span>
                                        <ChevronRight 
                                          size={14} 
                                          className={`md:size-4 transition-transform group-hover:translate-x-1 flex-shrink-0 ${
                                            hoveredSubCategory === subCategory.slug ? 'text-red-600' : 'text-gray-400'
                                          }`}
                                        />
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              ) : products[`category-${hoveredCategory}`]?.length > 0 ? (
                                <div className="space-y-1">
                                  <div className="mb-3 px-2">
                                    <p className="text-xs text-gray-500">Products in this category</p>
                                  </div>
                                  {products[`category-${hoveredCategory}`].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      onClick={() => setProductsOpen(false)}
                                      className="group block"
                                    >
                                      <div className="flex items-center gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-all hover:bg-red-50">
                                        {product.image_url && (
                                          <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-red-600 flex-1">{product.name}</span>
                                        <ChevronRight 
                                          size={14} 
                                          className="md:size-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-red-600 flex-shrink-0"
                                        />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ChevronRight className="text-gray-300" size={32} />
                                  </div>
                                  <p className="text-sm text-gray-500 font-medium">No items available</p>
                                  <p className="text-xs text-gray-400 mt-1">Try exploring other categories</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Column 3 - Super Subcategories with Images */}
                          {hoveredSubCategory && (
                            <div className="w-72 bg-white px-3 md:px-4 lg:px-5 py-3 md:py-4 max-h-[450px] md:max-h-[500px] lg:max-h-[520px] overflow-y-auto border-l border-gray-100 animate-slideIn scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-shrink-0">
                              <div className="mb-2 md:mb-3">
                                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">
                                  {subCategories[hoveredCategory!]?.find(s => s.slug === hoveredSubCategory)?.name}
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-500">Select product series</p>
                              </div>
                              
                              {loading.superSub ? (
                                <div className="flex items-center justify-center py-20">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                              ) : superSubCategories[hoveredSubCategory]?.length > 0 ? (
                                <div className="space-y-1">
                                  {superSubCategories[hoveredSubCategory].map((superSub) => (
                                    <div
                                      key={superSub.id}
                                      onMouseEnter={() => handleSuperSubCategoryHover(superSub.slug)}
                                      className="group cursor-pointer"
                                    >
                                      <Link
                                        href={`/products/${hoveredCategory}/${hoveredSubCategory}/${superSub.slug}`}
                                        onClick={() => setProductsOpen(false)}
                                        className={`flex items-center gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-all ${
                                          hoveredSuperSubCategory === superSub.slug
                                            ? 'bg-red-50 text-red-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                      >
                                        {superSub.image_url && (
                                          <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img 
                                              src={superSub.image_url} 
                                              alt={superSub.name} 
                                              className="w-full h-full object-cover" 
                                            />
                                          </div>
                                        )}
                                        <span className="text-xs md:text-sm font-medium flex-1">{superSub.name}</span>
                                        <ChevronRight 
                                          size={14} 
                                          className={`md:size-4 transition-transform group-hover:translate-x-1 flex-shrink-0 ${
                                            hoveredSuperSubCategory === superSub.slug ? 'text-red-600' : 'text-gray-400'
                                          }`}
                                        />
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              ) : products[`subcategory-${hoveredSubCategory}`]?.length > 0 ? (
                                <div className="space-y-1">
                                  <div className="mb-3 px-2">
                                    <p className="text-xs text-gray-500">Products in this subcategory</p>
                                  </div>
                                  {products[`subcategory-${hoveredSubCategory}`].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      onClick={() => setProductsOpen(false)}
                                      className="group block"
                                    >
                                      <div className="flex items-center gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-all hover:bg-red-50">
                                        {product.image_url && (
                                          <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-red-600 flex-1">{product.name}</span>
                                        <ChevronRight 
                                          size={14} 
                                          className="md:size-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-red-600 flex-shrink-0"
                                        />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ChevronRight className="text-gray-300" size={32} />
                                  </div>
                                  <p className="text-sm text-gray-500 font-medium">No items available</p>
                                  <p className="text-xs text-gray-400 mt-1">Try another subcategory</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Column 4 - Products with Images */}
                          {hoveredSuperSubCategory && (
                            <div className="w-72 bg-white px-3 md:px-4 lg:px-5 py-3 md:py-4 max-h-[450px] md:max-h-[500px] lg:max-h-[520px] overflow-y-auto border-l border-gray-100 animate-slideIn scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-shrink-0">
                              <div className="mb-2 md:mb-3">
                                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">
                                  Products
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-500">Available items</p>
                              </div>
                              
                              {loading.products ? (
                                <div className="flex items-center justify-center py-20">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                              ) : products[hoveredSuperSubCategory]?.length > 0 ? (
                                <div className="space-y-1">
                                  {products[hoveredSuperSubCategory].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      onClick={() => setProductsOpen(false)}
                                      className="group block"
                                    >
                                      <div className="flex items-center gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-all hover:bg-gray-50 text-gray-700">
                                        {product.image_url && (
                                          <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span className="text-xs md:text-sm font-medium group-hover:text-red-600 flex-1">{product.name}</span>
                                        <ChevronRight 
                                          size={14} 
                                          className="md:size-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-red-600 flex-shrink-0"
                                        />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ChevronRight className="text-gray-300" size={24} />
                                  </div>
                                  <p className="text-sm text-gray-500 font-medium">No products available</p>
                                  <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${isActive(item.href) ? activeClass : linkClass
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
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
          <div className={`lg:hidden pb-4 border-t transition-colors ${scrolled ? 'border-red-500/20 bg-slate-800/50' : 'border-gray-100'}`}>
            <div className="space-y-1 pt-4">
              {navItems.map((item) => {
                if (item.label === 'Products') {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                          isProductsActive 
                            ? scrolled ? 'text-red-400 bg-white/10' : 'text-red-600 bg-red-50'
                            : linkClass
                        }`}
                      >
                        <span>Products</span>
                        <ChevronDown size={18} className={`transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {mobileProductsOpen && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          {/* Categories Level */}
                          {!mobileSelectedCategory && (
                            <div className="py-2">
                              <div className="px-4 py-2">
                                <Link
                                  href="/products"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setMobileProductsOpen(false);
                                  }}
                                  className="block text-xs font-semibold text-red-600 hover:text-red-700 mb-2"
                                >
                                  View All Products →
                                </Link>
                                <p className="text-[10px] text-gray-500 mb-2">Select a category:</p>
                              </div>
                              {categories.length > 0 ? (
                                <div className="space-y-1 px-2">
                                  {categories.map((category) => (
                                    <button
                                      key={category.id}
                                      onClick={() => handleMobileCategoryClick(category.slug)}
                                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {category.image_url && (
                                          <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span>{category.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <p className="px-4 py-4 text-sm text-gray-400 text-center">No categories available</p>
                              )}
                            </div>
                          )}

                          {/* Subcategories Level */}
                          {mobileSelectedCategory && !mobileSelectedSubCategory && (
                            <div className="py-2">
                              <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                <button
                                  onClick={handleMobileBack}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <ChevronRight size={16} className="rotate-180" />
                                </button>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {categories.find(c => c.slug === mobileSelectedCategory)?.name}
                                  </p>
                                  <p className="text-[10px] text-gray-500">Select subcategory:</p>
                                </div>
                              </div>
                              {loading.sub ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                </div>
                              ) : subCategories[mobileSelectedCategory]?.length > 0 ? (
                                <div className="space-y-1 px-2 py-2">
                                  {subCategories[mobileSelectedCategory].map((subCategory) => (
                                    <button
                                      key={subCategory.id}
                                      onClick={() => handleMobileSubCategoryClick(subCategory.slug)}
                                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {subCategory.image_url && (
                                          <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={subCategory.image_url} alt={subCategory.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span>{subCategory.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                  ))}
                                </div>
                              ) : products[`category-${mobileSelectedCategory}`]?.length > 0 ? (
                                <div className="space-y-1 px-2 py-2">
                                  <div className="mb-3 px-2">
                                    <p className="text-xs text-gray-500">Products in this category</p>
                                  </div>
                                  {products[`category-${mobileSelectedCategory}`].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      onClick={() => {
                                        setIsOpen(false);
                                        setMobileProductsOpen(false);
                                        setMobileSelectedCategory(null);
                                        setMobileSelectedSubCategory(null);
                                        setMobileSelectedSuperSubCategory(null);
                                      }}
                                      className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {product.image_url && (
                                          <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span>{product.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-red-600" />
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="px-4 py-8 text-sm text-gray-400 text-center">No subcategories available</p>
                              )}
                            </div>
                          )}

                          {/* Super Subcategories Level */}
                          {mobileSelectedSubCategory && !mobileSelectedSuperSubCategory && (
                            <div className="py-2">
                              <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                <button
                                  onClick={handleMobileBack}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <ChevronRight size={16} className="rotate-180" />
                                </button>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {subCategories[mobileSelectedCategory!]?.find(s => s.slug === mobileSelectedSubCategory)?.name}
                                  </p>
                                  <p className="text-[10px] text-gray-500">Select product series:</p>
                                </div>
                              </div>
                              {loading.superSub ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                </div>
                              ) : superSubCategories[mobileSelectedSubCategory]?.length > 0 ? (
                                <div className="space-y-1 px-2 py-2">
                                  {superSubCategories[mobileSelectedSubCategory].map((superSub) => (
                                    <button
                                      key={superSub.id}
                                      onClick={() => handleMobileSuperSubCategoryClick(superSub.slug)}
                                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {superSub.image_url && (
                                          <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={superSub.image_url} alt={superSub.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span>{superSub.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                  ))}
                                </div>
                              ) : products[`subcategory-${mobileSelectedSubCategory}`]?.length > 0 ? (
                                <div className="space-y-1 px-2 py-2">
                                  <div className="mb-3 px-2">
                                    <p className="text-xs text-gray-500">Products in this subcategory</p>
                                  </div>
                                  {products[`subcategory-${mobileSelectedSubCategory}`].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      onClick={() => {
                                        setIsOpen(false);
                                        setMobileProductsOpen(false);
                                        setMobileSelectedCategory(null);
                                        setMobileSelectedSubCategory(null);
                                        setMobileSelectedSuperSubCategory(null);
                                      }}
                                      className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {product.image_url && (
                                          <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span>{product.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-red-600" />
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="px-4 py-8 text-sm text-gray-400 text-center">No product series available</p>
                              )}
                            </div>
                          )}

                          {/* Products Level */}
                          {mobileSelectedSuperSubCategory && (
                            <div className="py-2">
                              <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                <button
                                  onClick={handleMobileBack}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <ChevronRight size={16} className="rotate-180" />
                                </button>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900">Products</p>
                                  <p className="text-[10px] text-gray-500">Available items:</p>
                                </div>
                              </div>
                              {loading.products ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                </div>
                              ) : products[mobileSelectedSuperSubCategory]?.length > 0 ? (
                                <div className="space-y-1 px-2 py-2">
                                  {products[mobileSelectedSuperSubCategory].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      onClick={() => {
                                        setIsOpen(false);
                                        setMobileProductsOpen(false);
                                        setMobileSelectedCategory(null);
                                        setMobileSelectedSubCategory(null);
                                        setMobileSelectedSuperSubCategory(null);
                                      }}
                                      className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {product.image_url && (
                                          <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <span>{product.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-red-600" />
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="px-4 py-8 text-sm text-gray-400 text-center">No products available</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? scrolled ? 'text-red-400 bg-white/10' : 'text-red-600 bg-red-50'
                        : linkClass
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive(item.href) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/Contact"
                onClick={() => setIsOpen(false)}
                className="block mt-4 mx-4 px-4 py-3 text-sm font-semibold text-center text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}