'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderTree, ChevronRight } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
}

interface ProductsPageClientProps {
    categories: Category[];
}

export default function ProductsPageClient({ categories }: ProductsPageClientProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Our Products</h1>
                        <p className="text-red-100 text-base sm:text-lg max-w-2xl mx-auto">
                            Explore our wide range of products across various categories
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/products/${category.slug}`}>
                                <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer h-full">
                                    {/* Category Image */}
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                        {category.image_url ? (
                                            <img
                                                src={category.image_url}
                                                alt={category.name}
                                                className="w-full h-full object-contain p-2 sm:p-4 transition-all duration-200"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FolderTree className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Category Info */}
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                                {category.name}
                                            </h3>
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">
                                            {category.description || 'Explore products in this category'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <FolderTree className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No categories yet</h3>
                        <p className="text-gray-400 text-sm sm:text-base">Categories will appear here once added</p>
                    </div>
                )}
            </div>
        </div>
    );
}