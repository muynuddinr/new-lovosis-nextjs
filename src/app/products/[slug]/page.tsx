'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, ChevronRight, Loader2, Home } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
}

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`/api/categories/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setCategory(data.category);
                    setSubCategories(data.subCategories || []);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Failed to fetch category:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchCategory();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (error || !category) {
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
                    <nav className="flex items-center gap-2 text-red-100 text-sm mb-6">
                        <Link href="/" className="hover:text-white flex items-center gap-1">
                            <Home size={14} /> Home
                        </Link>
                        <ChevronRight size={14} />
                        <Link href="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={14} />
                        <span className="text-white font-medium">{category.name}</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                        <p className="text-red-100 text-lg max-w-2xl">
                            {category.description || `Explore subcategories in ${category.name}`}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Sub Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Sub Categories</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subCategories.map((subCat, index) => (
                        <motion.div
                            key={subCat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/products/${slug}/${subCat.slug}`}>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Layers className="w-7 h-7 text-blue-500" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                        {subCat.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {subCat.description || 'View sub category products'}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {subCategories.length === 0 && (
                    <div className="text-center py-12">
                        <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No sub categories yet</h3>
                        <p className="text-gray-400">Sub categories will appear here once added</p>
                    </div>
                )}
            </div>
        </div>
    );
}
