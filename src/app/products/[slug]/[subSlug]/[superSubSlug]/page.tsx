'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Loader2, Home, ShoppingCart } from 'lucide-react';

interface SuperSubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    sub_category: {
        id: string;
        name: string;
        slug: string;
        category: {
            id: string;
            name: string;
            slug: string;
        };
    };
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price: number | null;
    stock: number;
    image_url: string | null;
    featured: boolean;
}

export default function SuperSubCategoryPage() {
    const params = useParams();
    const categorySlug = params.slug as string;
    const subCategorySlug = params.subSlug as string;
    const superSubSlug = params.superSubSlug as string;

    const [superSubCategory, setSuperSubCategory] = useState<SuperSubCategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSuperSubCategory = async () => {
            try {
                const response = await fetch(`/api/super-subcategories/${superSubSlug}`);
                if (response.ok) {
                    const data = await response.json();
                    setSuperSubCategory(data.superSubCategory);
                    setProducts(data.products || []);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Failed to fetch super subcategory:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (superSubSlug) fetchSuperSubCategory();
    }, [superSubSlug]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (error || !superSubCategory) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
                <Link href="/products" className="text-red-600 hover:text-red-700">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-red-100 text-sm mb-6 flex-wrap">
                        <Link href="/" className="hover:text-white flex items-center gap-1">
                            <Home size={14} /> Home
                        </Link>
                        <ChevronRight size={14} />
                        <Link href="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={14} />
                        <Link href={`/products/${categorySlug}`} className="hover:text-white">
                            {superSubCategory.sub_category?.category?.name || categorySlug}
                        </Link>
                        <ChevronRight size={14} />
                        <Link href={`/products/${categorySlug}/${subCategorySlug}`} className="hover:text-white">
                            {superSubCategory.sub_category?.name || subCategorySlug}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-white font-medium">{superSubCategory.name}</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">{superSubCategory.name}</h1>
                        <p className="text-red-100 text-lg max-w-2xl">
                            {superSubCategory.description || `Browse all ${superSubCategory.name} products`}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                    <span className="text-gray-500">{products.length} products</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Product Image */}
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                                {product.sale_price && (
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        Sale
                                    </span>
                                )}
                                {product.featured && (
                                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        ★ Featured
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                    {product.description || 'No description available'}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                    {product.sale_price ? (
                                        <>
                                            <span className="text-lg font-bold text-red-600">
                                                {formatPrice(product.sale_price)}
                                            </span>
                                            <span className="text-sm text-gray-400 line-through">
                                                {formatPrice(product.price)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                    <button
                                        disabled={product.stock === 0}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
                        <p className="text-gray-400">Products will appear here once added</p>
                    </div>
                )}
            </div>
        </div>
    );
}
