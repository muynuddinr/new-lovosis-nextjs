'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm flex-wrap">
                        <Link href="/" className="text-gray-500 hover:text-red-600 flex items-center gap-1">
                            <Home size={14} /> Home
                        </Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <Link href="/products" className="text-gray-500 hover:text-red-600">Products</Link>
                        {breadcrumb.map((crumb, index) => (
                            <span key={crumb.slug} className="flex items-center gap-2">
                                <ChevronRight size={14} className="text-gray-300" />
                                <Link
                                    href={`/products/${breadcrumb.slice(0, index + 1).map(b => b.slug).join('/')}`}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    {crumb.name}
                                </Link>
                            </span>
                        ))}
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-6 lg:p-8">
                            {/* Main Image */}
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-square bg-gray-100 rounded-xl relative overflow-hidden mb-4 flex items-center justify-center"
                            >
                                {images.length > 0 ? (
                                    <img
                                        src={images[activeImage]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-32 h-32 text-gray-300" />
                                    </div>
                                )}
                                {product.featured && (
                                    <span className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <Star size={14} /> Featured
                                    </span>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-3">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-50 ${activeImage === index ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 lg:p-8 lg:border-l border-gray-100"
                        >
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">{product.name}</h1>

                            {/* Description */}
                            {product.description && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Key Features */}
                            {features.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h2>
                                    <ul className="space-y-2">
                                        {features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Request Catalogue Button */}
                            {product.catalogue_pdf_url && (
                                <button
                                    onClick={() => setShowCatalogueModal(true)}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all"
                                >
                                    <FileText size={20} />
                                    Request Catalogue
                                </button>
                            )}
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            {submitted ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                                    <p className="text-gray-500">Your catalogue is downloading...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <h2 className="text-xl font-semibold text-gray-900">Request Catalogue</h2>
                                        <button
                                            onClick={() => setShowCatalogueModal(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X size={20} className="text-gray-500" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCatalogueSubmit} className="p-6 space-y-4">
                                        {/* Product Name (readonly) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                                <Package size={18} className="text-gray-400" />
                                                <span className="text-gray-700 font-medium">{product.name}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-all"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={20} />
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
