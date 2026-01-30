'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ChevronRight,
    Loader2,
    Home,
    Star,
    Check,
    X,
    FileText,
    ChevronLeft,
    Download
} from 'lucide-react';

interface Breadcrumb {
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    key_features: string;
    image_url: string | null;
    image_url_2: string | null;
    image_url_3: string | null;
    catalogue_pdf_url: string | null;
    featured: boolean;
    status: string;
}

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<Breadcrumb[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [showCatalogueModal, setShowCatalogueModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/product/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data.product);
                    setBreadcrumb(data.breadcrumb || []);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Failed to fetch:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProduct();
    }, [slug]);

    // Get all available images
    const getImages = () => {
        if (!product) return [];
        const images = [];
        if (product.image_url) images.push(product.image_url);
        if (product.image_url_2) images.push(product.image_url_2);
        if (product.image_url_3) images.push(product.image_url_3);
        return images;
    };

    const images = getImages();

    const handleCatalogueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/catalogue-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product?.id,
                    product_name: product?.name,
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    customer_email: formData.email,
                    catalogue_pdf_url: product?.catalogue_pdf_url
                })
            });

            if (response.ok) {
                setSubmitted(true);
                // Download PDF
                if (product?.catalogue_pdf_url) {
                    const link = document.createElement('a');
                    link.href = product.catalogue_pdf_url;
                    link.download = `${product.name}-catalogue.pdf`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                // Reset after delay
                setTimeout(() => {
                    setShowCatalogueModal(false);
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '' });
                }, 2000);
            } else {
                alert('Failed to submit request');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
                <Link href="/products" className="text-red-600 hover:text-red-700">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    const features = product.key_features?.split('\n').filter(f => f.trim()) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <nav className="flex items-center gap-1 sm:gap-2 text-sm flex-wrap">
                        <Link href="/" className="text-gray-500 hover:text-red-600 flex items-center gap-1">
                            <Home size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Home</span>
                        </Link>
                        <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 text-gray-300" />
                        <Link href="/products" className="text-gray-500 hover:text-red-600">Products</Link>
                        {breadcrumb.map((crumb, index) => (
                            <span key={crumb.slug} className="flex items-center gap-1 sm:gap-2">
                                <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 text-gray-300" />
                                <Link
                                    href={`/products/${breadcrumb.slice(0, index + 1).map(b => b.slug).join('/')}`}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    {crumb.name}
                                </Link>
                            </span>
                        ))}
                        <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 text-gray-300" />
                        <span className="text-gray-900 font-medium text-sm sm:text-base">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Gallery - Left Side */}
                        <div className="p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-gray-50 via-white to-gray-50 lg:border-r border-gray-100">
                            {/* Main Image */}
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-square bg-white rounded-2xl relative overflow-hidden mb-4 lg:mb-6 flex items-center justify-center shadow-lg border border-gray-100"
                            >
                                {images.length > 0 ? (
                                    <img
                                        src={images[activeImage]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 sm:p-6 lg:p-8"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <Package className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 text-gray-200" />
                                    </div>
                                )}
                                {product.featured && (
                                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                                        <Star size={14} className="sm:w-4 sm:h-4 fill-current" /> Featured
                                    </span>
                                )}

                                {/* Image Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <ChevronLeft size={20} className="text-gray-700" />
                                        </button>
                                        <button
                                            onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <ChevronRight size={20} className="text-gray-700" />
                                        </button>
                                    </>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-3 sm:gap-4 justify-center">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-white shadow-md flex-shrink-0 hover:shadow-lg ${activeImage === index
                                                    ? 'border-red-500 ring-2 ring-red-500/20 scale-105'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-contain p-2" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Image Counter */}
                            {images.length > 1 && (
                                <div className="flex justify-center mt-4">
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {activeImage + 1} / {images.length} images
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Info - Right Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="p-4 sm:p-6 lg:p-10 flex flex-col"
                        >
                            {/* Status Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    In Stock
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                                {product.name}
                            </h1>

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6 lg:mb-8">
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Description</h2>
                                    <p className="text-gray-600 leading-relaxed text-base lg:text-lg">{product.description}</p>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4 lg:my-6"></div>

                            {/* Key Features */}
                            {features.length > 0 && (
                                <div className="mb-6 lg:mb-8 flex-1">
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Key Features</h2>
                                    <ul className="space-y-3">
                                        {features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check size={12} className="text-emerald-600" />
                                                </div>
                                                <span className="text-gray-700 text-base lg:text-lg">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-auto pt-6 lg:pt-8 border-t border-gray-100 space-y-3">
                                {/* Request Catalogue Button */}
                                {product.catalogue_pdf_url && (
                                    <button
                                        onClick={() => setShowCatalogueModal(true)}
                                        className="w-full flex items-center justify-center gap-3 py-4 lg:py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-red-500/25 transition-all text-base lg:text-lg hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5"
                                    >
                                        <FileText size={20} className="lg:w-6 lg:h-6" />
                                        Download Catalogue
                                    </button>
                                )}

                                {/* Contact Button */}
                                <Link
                                    href="/Contact"
                                    className="w-full flex items-center justify-center gap-3 py-4 lg:py-5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl lg:rounded-2xl transition-all text-base lg:text-lg hover:-translate-y-0.5"
                                >
                                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact for Inquiry
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Catalogue Request Modal */}
            <AnimatePresence>
                {showCatalogueModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => !submitting && setShowCatalogueModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg sm:rounded-2xl shadow-xl w-full max-w-md overflow-hidden mx-4"
                        >
                            {submitted ? (
                                <div className="p-6 sm:p-8 text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={24} className="sm:w-8 sm:h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                                    <p className="text-gray-500 text-sm sm:text-base">Your catalogue is downloading...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Request Catalogue</h2>
                                        <button
                                            onClick={() => setShowCatalogueModal(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X size={20} className="text-gray-500" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCatalogueSubmit} className="p-4 sm:p-6 space-y-4">
                                        {/* Product Name (readonly) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                                <Package size={16} className="sm:w-4.5 sm:h-4.5 text-gray-400" />
                                                <span className="text-gray-700 font-medium text-sm sm:text-base">{product.name}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-red-500 text-sm sm:text-base"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-red-500 text-sm sm:text-base"
                                                placeholder="+1 234 567 8900"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-red-500 text-sm sm:text-base"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg sm:rounded-xl disabled:opacity-50 transition-all text-sm sm:text-base"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={18} className="sm:w-5 sm:h-5" />
                                                    Download Catalogue
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}