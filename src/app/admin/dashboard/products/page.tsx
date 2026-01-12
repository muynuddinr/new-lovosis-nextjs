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
    ChevronRight,
    Eye,
    DollarSign,
    Tag
} from 'lucide-react';

interface SuperSubCategory {
    id: string;
    name: string;
    slug: string;
    sub_category: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
        };
    };
}

interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    sale_price: number | null;
    stock: number;
    super_sub_category_id: string;
    super_sub_category: SuperSubCategory;
    image_url: string | null;
    featured: boolean;
    status: string;
    created_at: string;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [superSubCategories, setSuperSubCategories] = useState<SuperSubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        description: '',
        price: '',
        sale_price: '',
        stock: '0',
        super_sub_category_id: '',
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

    const fetchSuperSubCategories = async () => {
        try {
            const response = await fetch('/api/admin/super-sub-categories');
            if (response.ok) {
                const data = await response.json();
                setSuperSubCategories(data.superSubCategories || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchSuperSubCategories();
        fetchProducts();
    }, []);

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/products';
            const method = editingProduct ? 'PUT' : 'POST';
            const body = editingProduct
                ? { ...formData, id: editingProduct.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchProducts();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/products?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchProducts();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            sku: product.sku || '',
            description: product.description || '',
            price: product.price.toString(),
            sale_price: product.sale_price?.toString() || '',
            stock: product.stock.toString(),
            super_sub_category_id: product.super_sub_category_id || '',
            featured: product.featured,
            status: product.status
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '', slug: '', sku: '', description: '',
            price: '', sale_price: '', stock: '0',
            super_sub_category_id: '', featured: false, status: 'active'
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = products.filter(p => p.status === 'active').length;
    const onSaleCount = products.filter(p => p.sale_price).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

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
                        <Package size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-500 text-sm">{products.length} products</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total</p>
                            <p className="text-xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Tag size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active</p>
                            <p className="text-xl font-bold text-gray-900">{activeCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <DollarSign size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">On Sale</p>
                            <p className="text-xl font-bold text-gray-900">{onSaleCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Out of Stock</p>
                            <p className="text-xl font-bold text-gray-900">{outOfStockCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
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
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Product</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">SKU</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Category</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Price</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Stock</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Status</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                                <Package size={18} className="text-red-500" />
                                            </div>
                                            <div>
                                                <span className="text-gray-900 font-medium block">{product.name}</span>
                                                {product.featured && <span className="text-xs text-amber-500">★ Featured</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-500 font-mono text-sm">{product.sku || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className="text-red-500">{product.super_sub_category?.sub_category?.category?.name}</span>
                                            <ChevronRight size={10} className="text-gray-300" />
                                            <span className="text-gray-500">{product.super_sub_category?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.sale_price ? (
                                            <div>
                                                <span className="text-emerald-600 font-medium">{formatPrice(product.sale_price)}</span>
                                                <span className="text-gray-400 line-through text-sm ml-2">{formatPrice(product.price)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 font-medium">{formatPrice(product.price)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 20 ? 'text-amber-500' : 'text-gray-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-500">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editingProduct ? 'Edit Product' : 'Add Product'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: editingProduct ? formData.slug : generateSlug(e.target.value)
                                            })}
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
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                        <input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-mono focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={formData.super_sub_category_id}
                                            onChange={(e) => setFormData({ ...formData, super_sub_category_id: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                        >
                                            <option value="">Select category</option>
                                            {superSubCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.sub_category?.category?.name} → {cat.sub_category?.name} → {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.sale_price}
                                            onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Featured Product</span>
                                        </label>
                                    </div>
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
                                        {saving ? 'Saving...' : 'Save Product'}
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
