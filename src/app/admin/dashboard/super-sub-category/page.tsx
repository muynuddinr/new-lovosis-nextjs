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
    ChevronRight,
    Upload
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
    category_id: string;
    category: Category;
}

interface SuperSubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSuperSub, setEditingSuperSub] = useState<SuperSubCategory | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sub_category_id: '',
        description: '',
        image_url: '',
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
            console.error('Failed to fetch:', error);
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
            console.error('Failed to fetch:', error);
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
            console.error('Failed to fetch:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
        fetchSuperSubCategories();
    }, []);

    const filteredSubCategoriesForDropdown = subCategories.filter(sub => sub.category_id === selectedCategoryId);
    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'super-sub-categories');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({ ...formData, image_url: data.url });
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to upload');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/super-sub-categories';
            const method = editingSuperSub ? 'PUT' : 'POST';
            const body = editingSuperSub ? { ...formData, id: editingSuperSub.id } : formData;

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
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;

        try {
            const response = await fetch(`/api/admin/super-sub-categories?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                await fetchSuperSubCategories();
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const openEditModal = (item: SuperSubCategory) => {
        setEditingSuperSub(item);
        setSelectedCategoryId(item.sub_category?.category_id || '');
        setFormData({
            name: item.name,
            slug: item.slug,
            sub_category_id: item.sub_category_id,
            description: item.description || '',
            image_url: item.image_url || '',
            status: item.status
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingSuperSub(null);
        setSelectedCategoryId('');
        setFormData({ name: '', slug: '', sub_category_id: '', description: '', image_url: '', status: 'active' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSuperSub(null);
        setSelectedCategoryId('');
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategoryId(catId);
        setFormData({ ...formData, sub_category_id: '' });
    };

    const filteredItems = superSubCategories.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSelectedCategoryName = () => categories.find(c => c.id === selectedCategoryId)?.name || '';
    const getSelectedSubCategoryName = () => subCategories.find(s => s.id === formData.sub_category_id)?.name || '';

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
                    <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Grid3X3 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Super Sub Categories</h1>
                        <p className="text-gray-500 text-sm">{superSubCategories.length} items</p>
                    </div>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-500/30">
                    <Plus size={18} />
                    Add Super Sub Category
                </button>
            </motion.div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
            </div>

            {/* Super Sub Categories Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Super Sub Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hierarchy</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Grid3X3 size={20} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-medium">{item.sub_category?.category?.name}</span>
                                            <ChevronRight size={12} className="text-gray-400" />
                                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">{item.sub_category?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">{item.slug}</code>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            item.status === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                title="Delete"
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
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
                                <h2 className="text-xl font-semibold text-gray-900">{editingSuperSub ? 'Edit' : 'Add'} Super Sub Category</h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-500" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Step 1: Category */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Step 1: Select Category</label>
                                    <select value={selectedCategoryId} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white" required>
                                        <option value="">-- Select Category --</option>
                                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {selectedCategoryId && <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1"><Check size={14} /> {getSelectedCategoryName()}</p>}
                                </div>

                                {/* Step 2: Sub Category */}
                                {selectedCategoryId && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 rounded-xl p-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Step 2: Select Sub Category</label>
                                        {filteredSubCategoriesForDropdown.length > 0 ? (
                                            <>
                                                <select value={formData.sub_category_id} onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white" required>
                                                    <option value="">-- Select Sub Category --</option>
                                                    {filteredSubCategoriesForDropdown.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                                </select>
                                                {formData.sub_category_id && <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1"><Check size={14} /> {getSelectedSubCategoryName()}</p>}
                                            </>
                                        ) : (
                                            <p className="text-amber-600 text-sm">No sub categories for this category</p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 3: Details */}
                                {formData.sub_category_id && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        {/* Image */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden">
                                                {formData.image_url ? (
                                                    <div className="relative aspect-video">
                                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50">
                                                        {uploading ? <Loader2 size={32} className="text-gray-400 animate-spin mb-2" /> : <Upload size={32} className="text-gray-400 mb-2" />}
                                                        <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: editingSuperSub ? formData.slug : generateSlug(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-mono text-sm" required />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none" rows={2} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" disabled={saving || uploading || !formData.sub_category_id} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
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
