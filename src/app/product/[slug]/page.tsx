'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Package,
    ChevronRight,
    Loader2,
    Home,
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Check,
    Truck,
    Shield,
    RotateCcw,
    Minus,
    Plus
} from 'lucide-react';

interface Breadcrumb {
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    sale_price: number | null;
    stock: number;
    image_url: string | null;
    featured: boolean;
    status: string;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<Breadcrumb[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [quantity, setQuantity] = useState(1);

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

    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(q => q + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
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

    const discount = product.sale_price
        ? Math.round((1 - product.sale_price / product.price) * 100)
        : 0;

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
                        {/* Product Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="aspect-square bg-gray-100 relative"
                        >
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-32 h-32 text-gray-300" />
                                </div>
                            )}
                            {product.sale_price && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                                    {discount}% OFF
                                </span>
                            )}
                            {product.featured && (
                                <span className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                                    <Star size={14} /> Featured
                                </span>
                            )}
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 lg:p-12"
                        >
                            {/* SKU */}
                            {product.sku && (
                                <p className="text-gray-400 text-sm mb-2">SKU: {product.sku}</p>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            {/* Rating Placeholder */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={18} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm">(5.0) · 24 Reviews</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6">
                                {product.sale_price ? (
                                    <>
                                        <span className="text-3xl font-bold text-red-600">
                                            {formatPrice(product.sale_price)}
                                        </span>
                                        <span className="text-xl text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                                            Save {formatPrice(product.price - product.sale_price)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {product.stock > 0 ? (
                                    <>
                                        <Check size={18} className="text-emerald-500" />
                                        <span className="text-emerald-600 font-medium">In Stock</span>
                                        <span className="text-gray-400">({product.stock} available)</span>
                                    </>
                                ) : (
                                    <span className="text-red-500 font-medium">Out of Stock</span>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-gray-700 font-medium">Quantity:</span>
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity >= product.stock}
                                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-8">
                                <button
                                    disabled={product.stock === 0}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button className="p-4 border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-xl transition-colors">
                                    <Heart size={20} className="text-gray-600" />
                                </button>
                                <button className="p-4 border border-gray-200 hover:border-gray-300 rounded-xl transition-colors">
                                    <Share2 size={20} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Truck size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                                        <p className="text-xs text-gray-500">On orders over $50</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Shield size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Warranty</p>
                                        <p className="text-xs text-gray-500">1 Year Warranty</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                        <RotateCcw size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                                        <p className="text-xs text-gray-500">30-Day Returns</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
