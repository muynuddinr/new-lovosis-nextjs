'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid3X3, ChevronRight, Loader2, Home } from 'lucide-react';

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

interface SuperSubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export default function SubCategoryPage() {
    const params = useParams();
    const categorySlug = params.slug as string;
    const subCategorySlug = params.subSlug as string;

    const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
    const [superSubCategories, setSuperSubCategories] = useState<SuperSubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSubCategory = async () => {
            try {
                const response = await fetch(`/api/subcategories/${subCategorySlug}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubCategory(data.subCategory);
                    setSuperSubCategories(data.superSubCategories || []);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Failed to fetch subcategory:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (subCategorySlug) fetchSubCategory();
    }, [subCategorySlug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (error || !subCategory) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Sub Category not found</h1>
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
                            {subCategory.category?.name || categorySlug}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-white font-medium">{subCategory.name}</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">{subCategory.name}</h1>
                        <p className="text-red-100 text-lg max-w-2xl">
                            {subCategory.description || `Browse products in ${subCategory.name}`}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Super Sub Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Categories</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {superSubCategories.map((superSub, index) => (
                        <motion.div
                            key={superSub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/products/${categorySlug}/${subCategorySlug}/${superSub.slug}`}>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                            <Grid3X3 className="w-7 h-7 text-amber-500" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                        {superSub.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {superSub.description || 'View products'}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {superSubCategories.length === 0 && (
                    <div className="text-center py-12">
                        <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No product categories yet</h3>
                        <p className="text-gray-400">Product categories will appear here once added</p>
                    </div>
                )}
            </div>
        </div>
    );
}
