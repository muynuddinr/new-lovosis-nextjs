'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderTree, ChevronRight, Loader2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
}

export default function ProductsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
                        <p className="text-red-100 text-lg max-w-2xl mx-auto">
                            Explore our wide range of products across various categories
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/products/${category.slug}`}>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <FolderTree className="w-7 h-7 text-red-500" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {category.description || 'Explore products in this category'}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories yet</h3>
                        <p className="text-gray-400">Categories will appear here once added</p>
                    </div>
                )}
            </div>
        </div>
    );
}
