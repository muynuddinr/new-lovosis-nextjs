'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Grid3X3,
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    Loader2,
    Check,
    ChevronRight
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    category: Category;
}

interface SuperSubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    sub_category_id: string;
    sub_category: SubCategory;
    status: string;
    created_at: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function SuperSubCategoryPage() {
    const [superSubCategories, setSuperSubCategories] = useState<SuperSubCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSuperSub, setEditingSuperSub] = useState<SuperSubCategory | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sub_category_id: '',
        description: '',
        status: 'active'
    });

    const fetchSuperSubCategories = async () => {
        try {
            const response = await fetch('/api/admin/super-sub-categories');
            if (response.ok) {
                const data = await response.json();
                setSuperSubCategories(data.superSubCategories || []);
            }
        } catch (error) {
            console.error('Failed to fetch super sub categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await fetch('/api/admin/sub-categories');
            if (response.ok) {
                const data = await response.json();
                setSubCategories(data.subCategories || []);
            }
        } catch (error) {
            console.error('Failed to fetch sub categories:', error);
        }
    };

    useEffect(() => {
        fetchSubCategories();
        fetchSuperSubCategories();
    }, []);

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/super-sub-categories';
            const method = editingSuperSub ? 'PUT' : 'POST';
            const body = editingSuperSub
                ? { ...formData, id: editingSuperSub.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchSuperSubCategories();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will also delete all related products.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/super-sub-categories?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchSuperSubCategories();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const openEditModal = (item: SuperSubCategory) => {
        setEditingSuperSub(item);
        setFormData({
            name: item.name,
            slug: item.slug,
            sub_category_id: item.sub_category_id,
            description: item.description || '',
            status: item.status
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingSuperSub(null);
        setFormData({ name: '', slug: '', sub_category_id: '', description: '', status: 'active' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSuperSub(null);
    };

    const filteredItems = superSubCategories.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sub_category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sub_category?.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Grid3X3 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Super Sub Categories</h1>
                        <p className="text-gray-500 text-sm">{superSubCategories.length} items</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300"
                >
                    <Plus size={18} />
                    Add Super Sub Category
                </button>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
            >
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Name</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Hierarchy</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Description</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Status</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Created</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900 font-medium">{item.name}</span>
                                        <span className="block text-xs text-gray-400 font-mono">{item.slug}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm flex-wrap">
                                            <span className="text-red-500">{item.sub_category?.category?.name}</span>
                                            <ChevronRight size={12} className="text-gray-300" />
                                            <span className="text-blue-500">{item.sub_category?.name}</span>
                                            <ChevronRight size={12} className="text-gray-300" />
                                            <span className="text-gray-600">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <span className="text-gray-500 text-sm line-clamp-1">{item.description || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-400 text-sm">{formatDate(item.created_at)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-500"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                    <p className="text-gray-400">Create your first super sub category</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editingSuperSub ? 'Edit Super Sub Category' : 'Add Super Sub Category'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Sub Category</label>
                                    <select
                                        value={formData.sub_category_id}
                                        onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                        required
                                    >
                                        <option value="">Select a sub category</option>
                                        {subCategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.category?.name} → {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: editingSuperSub ? formData.slug : generateSlug(e.target.value)
                                            });
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-red-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
