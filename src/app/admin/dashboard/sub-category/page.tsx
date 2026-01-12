'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
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
    description: string;
    category_id: string;
    category: Category;
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

export default function SubCategoryPage() {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_id: '',
        description: '',
        status: 'active'
    });

    const fetchSubCategories = async () => {
        try {
            const response = await fetch('/api/admin/sub-categories');
            if (response.ok) {
                const data = await response.json();
                setSubCategories(data.subCategories || []);
            }
        } catch (error) {
            console.error('Failed to fetch sub categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/sub-categories';
            const method = editingSubCategory ? 'PUT' : 'POST';
            const body = editingSubCategory
                ? { ...formData, id: editingSubCategory.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchSubCategories();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save sub category');
            }
        } catch (error) {
            console.error('Failed to save sub category:', error);
            alert('Failed to save sub category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sub category?')) return;

        try {
            const response = await fetch(`/api/admin/sub-categories?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                await fetchSubCategories();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const openEditModal = (subCategory: SubCategory) => {
        setEditingSubCategory(subCategory);
        setFormData({
            name: subCategory.name,
            slug: subCategory.slug,
            category_id: subCategory.category_id,
            description: subCategory.description || '',
            status: subCategory.status
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingSubCategory(null);
        setFormData({ name: '', slug: '', category_id: '', description: '', status: 'active' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSubCategory(null);
        setFormData({ name: '', slug: '', category_id: '', description: '', status: 'active' });
    };

    const filteredSubCategories = subCategories.filter(subCat =>
        subCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subCat.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get selected category name for display
    const getSelectedCategoryName = () => {
        const cat = categories.find(c => c.id === formData.category_id);
        return cat?.name || 'None selected';
    };

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Layers size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sub Categories</h1>
                        <p className="text-gray-500 text-sm">{subCategories.length} sub categories</p>
                    </div>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-500/30">
                    <Plus size={18} />
                    Add Sub Category
                </button>
            </motion.div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search sub categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Sub Category</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Parent Category</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Description</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Status</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Created</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubCategories.map((subCat) => (
                                <tr key={subCat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900 font-medium">{subCat.name}</span>
                                        <span className="block text-xs text-gray-400 font-mono">{subCat.slug}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-red-500 font-medium">{subCat.category?.name}</span>
                                            <ChevronRight size={14} className="text-gray-300" />
                                            <span>{subCat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <span className="text-gray-500 text-sm line-clamp-1">{subCat.description || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${subCat.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {subCat.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-400 text-sm">{formatDate(subCat.created_at)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(subCat)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-500"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(subCat.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredSubCategories.length === 0 && (
                <div className="text-center py-12">
                    <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No sub categories found</h3>
                    <p className="text-gray-400">Create a category first, then add sub categories</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">{editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}</h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-500" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Step 1: Select Parent Category */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Step 1: Select Parent Category
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-white"
                                        required
                                    >
                                        <option value="">-- Select a Category --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {formData.category_id && (
                                        <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                                            <Check size={14} /> Selected: {getSelectedCategoryName()}
                                        </p>
                                    )}
                                </div>

                                {/* Step 2: Sub Category Details (only show if category selected) */}
                                {formData.category_id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4"
                                    >
                                        <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Step 2: Sub Category Details
                                            </label>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                        slug: editingSubCategory ? formData.slug : generateSlug(e.target.value)
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                                    placeholder="Sub category name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-red-500"
                                                    placeholder="sub-category-slug"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-red-500"
                                                    rows={2}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                                <select
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" disabled={saving || !formData.category_id} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
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
