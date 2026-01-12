'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    Loader2,
    Check,
    Upload,
    FileText,
    Image as ImageIcon
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
    sub_category: SubCategory;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    key_features: string;
    category_id: string | null;
    sub_category_id: string | null;
    super_sub_category_id: string | null;
    image_url: string | null;
    image_url_2: string | null;
    image_url_3: string | null;
    catalogue_pdf_url: string | null;
    featured: boolean;
    status: string;
    created_at: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [superSubCategories, setSuperSubCategories] = useState<SuperSubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [categoryLevel, setCategoryLevel] = useState<'category' | 'sub_category' | 'super_sub_category'>('category');
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        key_features: '',
        category_id: '',
        sub_category_id: '',
        super_sub_category_id: '',
        image_url: '',
        image_url_2: '',
        image_url_3: '',
        catalogue_pdf_url: '',
        featured: false,
        status: 'active'
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const [catRes, subRes, superRes] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/sub-categories'),
                fetch('/api/admin/super-sub-categories')
            ]);

            if (catRes.ok) setCategories((await catRes.json()).categories || []);
            if (subRes.ok) setSubCategories((await subRes.json()).subCategories || []);
            if (superRes.ok) setSuperSubCategories((await superRes.json()).superSubCategories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'products');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, [field]: data.url }));
            } else {
                alert('Failed to upload');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        setUploading(prev => ({ ...prev, pdf: true }));
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'catalogues');

            const response = await fetch('/api/upload/pdf', {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, catalogue_pdf_url: data.url }));
            } else {
                alert('Failed to upload PDF');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(prev => ({ ...prev, pdf: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload: {
            id?: string;
            name: string;
            slug: string;
            description: string;
            key_features: string;
            category_id: string | null;
            sub_category_id: string | null;
            super_sub_category_id: string | null;
            image_url: string;
            image_url_2: string;
            image_url_3: string;
            catalogue_pdf_url: string;
            featured: boolean;
            status: string;
        } = {
            ...formData,
            category_id: categoryLevel === 'category' ? formData.category_id : null,
            sub_category_id: categoryLevel === 'sub_category' ? formData.sub_category_id : null,
            super_sub_category_id: categoryLevel === 'super_sub_category' ? formData.super_sub_category_id : null,
        };

        if (editingProduct) {
            payload.id = editingProduct.id;
        }

        try {
            const response = await fetch('/api/admin/products', {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchProducts();
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
        if (!confirm('Delete this product?')) return;

        try {
            const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (response.ok) await fetchProducts();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);

        if (product.super_sub_category_id) setCategoryLevel('super_sub_category');
        else if (product.sub_category_id) setCategoryLevel('sub_category');
        else setCategoryLevel('category');

        setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            key_features: product.key_features || '',
            category_id: product.category_id || '',
            sub_category_id: product.sub_category_id || '',
            super_sub_category_id: product.super_sub_category_id || '',
            image_url: product.image_url || '',
            image_url_2: product.image_url_2 || '',
            image_url_3: product.image_url_3 || '',
            catalogue_pdf_url: product.catalogue_pdf_url || '',
            featured: product.featured,
            status: product.status
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setCategoryLevel('category');
        setFormData({
            name: '', slug: '', description: '', key_features: '',
            category_id: '', sub_category_id: '', super_sub_category_id: '',
            image_url: '', image_url_2: '', image_url_3: '', catalogue_pdf_url: '',
            featured: false, status: 'active'
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProductCategory = (product: Product) => {
        if (product.super_sub_category_id) {
            const ss = superSubCategories.find(s => s.id === product.super_sub_category_id);
            if (ss) return `${ss.sub_category?.category?.name} → ${ss.sub_category?.name} → ${ss.name}`;
        }
        if (product.sub_category_id) {
            const sub = subCategories.find(s => s.id === product.sub_category_id);
            if (sub) return `${sub.category?.name} → ${sub.name}`;
        }
        if (product.category_id) {
            return categories.find(c => c.id === product.category_id)?.name || '';
        }
        return 'No category';
    };

    const ImageUploadBox = ({ field, label, required = false }: { field: string, label: string, required?: boolean }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden">
                {formData[field as keyof typeof formData] ? (
                    <div className="relative aspect-video">
                        <img src={formData[field as keyof typeof formData] as string} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, [field]: '' }))} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-50">
                        {uploading[field] ? <Loader2 size={24} className="text-gray-400 animate-spin" /> : <Upload size={24} className="text-gray-400" />}
                        <span className="text-xs text-gray-500 mt-1">{uploading[field] ? 'Uploading...' : 'Upload'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field)} className="hidden" disabled={uploading[field]} />
                    </label>
                )}
            </div>
        </div>
    );

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Package size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-500 text-sm">{products.length} products</p>
                    </div>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg">
                    <Plus size={18} /> Add Product
                </button>
            </motion.div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product, index) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><Package size={48} className="text-gray-300" /></div>
                            )}
                            {product.catalogue_pdf_url && (
                                <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                    <FileText size={12} /> PDF
                                </span>
                            )}
                            {product.featured && (
                                <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">★ Featured</span>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-gray-500 text-xs mb-3">{getProductCategory(product)}</p>
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                <button onClick={() => openEditModal(product)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-500">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No products found</h3>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-semibold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-500" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Images */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Product Images</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <ImageUploadBox field="image_url" label="Image 1" required />
                                        <ImageUploadBox field="image_url_2" label="Image 2" />
                                        <ImageUploadBox field="image_url_3" label="Image 3" />
                                    </div>
                                </div>

                                {/* Name & Slug */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: editingProduct ? formData.slug : generateSlug(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-mono text-sm" required />
                                    </div>
                                </div>

                                {/* Category Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Level</label>
                                    <div className="flex gap-2">
                                        {['category', 'sub_category', 'super_sub_category'].map((level) => (
                                            <button key={level} type="button" onClick={() => setCategoryLevel(level as any)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border ${categoryLevel === level ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-200 text-gray-600'}`}>
                                                {level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Selector */}
                                <div>
                                    {categoryLevel === 'category' && (
                                        <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required>
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    )}
                                    {categoryLevel === 'sub_category' && (
                                        <select value={formData.sub_category_id} onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required>
                                            <option value="">Select Sub Category</option>
                                            {subCategories.map((sub) => <option key={sub.id} value={sub.id}>{sub.category?.name} → {sub.name}</option>)}
                                        </select>
                                    )}
                                    {categoryLevel === 'super_sub_category' && (
                                        <select value={formData.super_sub_category_id} onChange={(e) => setFormData({ ...formData, super_sub_category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required>
                                            <option value="">Select Super Sub Category</option>
                                            {superSubCategories.map((ss) => <option key={ss.id} value={ss.id}>{ss.sub_category?.category?.name} → {ss.sub_category?.name} → {ss.name}</option>)}
                                        </select>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none" rows={3} />
                                </div>

                                {/* Key Features */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                                    <textarea value={formData.key_features} onChange={(e) => setFormData({ ...formData, key_features: e.target.value })} placeholder="Enter each feature on a new line" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none" rows={4} />
                                </div>

                                {/* PDF Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Catalogue PDF</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                                        {formData.catalogue_pdf_url ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <FileText size={20} className="text-red-600" />
                                                    </div>
                                                    <span className="text-sm text-gray-700">PDF Uploaded</span>
                                                </div>
                                                <button type="button" onClick={() => setFormData({ ...formData, catalogue_pdf_url: '' })} className="text-red-500 hover:text-red-600">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 py-4">
                                                {uploading.pdf ? <Loader2 size={24} className="text-gray-400 animate-spin" /> : <FileText size={24} className="text-gray-400" />}
                                                <span className="text-sm text-gray-500 mt-2">{uploading.pdf ? 'Uploading...' : 'Upload PDF Catalogue'}</span>
                                                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" disabled={uploading.pdf} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Status & Featured */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-red-500 rounded" />
                                            <span className="text-sm font-medium text-gray-700">Featured Product</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
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
