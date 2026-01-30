'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Package,
    FolderTree,
    Layers,
    Grid3X3,
    ChevronRight,
    Loader2,
    Home,
} from 'lucide-react';

interface Breadcrumb {
    name: string;
    slug: string;
}

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url?: string | null;
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

interface ApiResponse {
    type: 'category' | 'sub_category' | 'super_sub_category';
    data: CategoryData;
    subCategories?: CategoryData[];
    superSubCategories?: CategoryData[];
    products: Product[];
    breadcrumb: Breadcrumb[];
}

interface ProductsSlugClientProps {
    slugArray: string[];
}

const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price not available';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(numPrice);
};

export default function ProductsSlugClient({ slugArray }: ProductsSlugClientProps) {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const slugPath = slugArray.join('/');
                const response = await fetch(`/api/products/${slugPath}`);
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
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
        if (slugArray?.length > 0) fetchData();
    }, [slugArray]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h1>
                <Link href="/products" className="text-red-600 hover:text-red-700">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    // Build the current path for child links
    const currentPath = `/products/${slugArray.join('/')}`;

    // Get subcategories or super-subcategories to display
    const childCategories = data.subCategories || data.superSubCategories || [];
    const hasProducts = data.products.length > 0;
    const hasChildren = childCategories.length > 0;

    // Icon based on type
    const getIcon = () => {
        switch (data.type) {
            case 'category': return <FolderTree className="w-7 h-7 text-red-500" />;
            case 'sub_category': return <Layers className="w-7 h-7 text-blue-500" />;
            case 'super_sub_category': return <Grid3X3 className="w-7 h-7 text-amber-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1 sm:gap-2 text-red-100 text-xs sm:text-sm mb-4 sm:mb-6 flex-wrap">
                        <Link href="/" className="hover:text-white flex items-center gap-1">
                            <Home size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Home</span>
                        </Link>
                        <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                        <Link href="/products" className="hover:text-white">Products</Link>
                        {data.breadcrumb.map((crumb, index) => (
                            <span key={crumb.slug} className="flex items-center gap-1 sm:gap-2">
                                <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                                {index === data.breadcrumb.length - 1 ? (
                                    <span className="text-white font-medium">{crumb.name}</span>
                                ) : (
                                    <Link
                                        href={`/products/${data.breadcrumb.slice(0, index + 1).map(b => b.slug).join('/')}`}
                                        className="hover:text-white"
                                    >
                                        {crumb.name}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">{data.data.name}</h1>
                        <p className="text-red-100 text-base sm:text-lg max-w-2xl">
                            {data.data.description || `Browse ${data.data.name}`}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Child Categories Grid */}
                {hasChildren && (
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                            {data.type === 'category' ? 'Sub Categories' : 'Categories'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {childCategories.map((child, index) => (
                                <motion.div
                                    key={child.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`${currentPath}/${child.slug}`}>
                                        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer h-full">
                                            {/* Category Image */}
                                            <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                                {child.image_url ? (
                                                    <img
                                                        src={child.image_url}
                                                        alt={child.name}
                                                        className="w-full h-full object-contain p-2 sm:p-4 transition-all duration-200"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        {data.type === 'category' ? (
                                                            <Layers className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                                                        ) : (
                                                            <Grid3X3 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Category Info */}
                                            <div className="p-4 sm:p-5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                                        {child.name}
                                                    </h3>
                                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                                </div>
                                                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">
                                                    {child.description || 'View products'}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {hasProducts && (
                    <div>
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h2>
                            <span className="text-gray-500 text-sm sm:text-base">{data.products.length} products</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {data.products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/product/${product.slug}`} className="block bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                        {/* Product Image */}
                                        <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-2 sm:p-4 transition-all duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                                                </div>
                                            )}
                                            {product.sale_price && (
                                                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                    Sale
                                                </span>
                                            )}
                                            {product.featured && (
                                                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                    ★ Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-3 sm:p-4">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors text-sm sm:text-base">
                                                {product.name}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!hasChildren && !hasProducts && (
                    <div className="text-center py-8 sm:py-12">
                        <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No items yet</h3>
                        <p className="text-gray-400 text-sm sm:text-base">Content will appear here once added</p>
                    </div>
                )}
            </div>
        </div>
    );
}