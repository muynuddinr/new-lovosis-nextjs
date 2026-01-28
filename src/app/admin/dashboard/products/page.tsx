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
    Image as ImageIcon,
    CheckSquare,
    Square,
    Download,
    FileSpreadsheet
} from 'lucide-react';
import { useNotification } from '@/app/Components/Notification';

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
    const { showNotification, showConfirm } = useNotification();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [superSubCategories, setSuperSubCategories] = useState<SuperSubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSubCategory, setFilterSubCategory] = useState('');
    const [filterSuperSubCategory, setFilterSuperSubCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterFeatured, setFilterFeatured] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [categoryLevel, setCategoryLevel] = useState<'category' | 'sub_category' | 'super_sub_category'>('category');
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [bulkUploading, setBulkUploading] = useState(false);
    const [csvPreview, setCsvPreview] = useState<any[]>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
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
                showNotification('Failed to upload', 'error');
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
            showNotification('Please upload a PDF file', 'error');
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
                showNotification('Failed to upload PDF', 'error');
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
                showNotification(data.error || 'Failed to save', 'error');
            }
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await showConfirm('Delete this product?');
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (response.ok) await fetchProducts();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const toggleProductSelection = (id: string) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedProducts(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.size === 0) return;
        
        const confirmed = await showConfirm(`Are you sure you want to delete ${selectedProducts.size} product(s)?`);
        if (!confirmed) return;

        setBulkDeleting(true);
        try {
            const deletePromises = Array.from(selectedProducts).map(id =>
                fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
            );
            
            await Promise.all(deletePromises);
            
            showNotification(`Successfully deleted ${selectedProducts.size} product(s)`, 'success');
            setSelectedProducts(new Set());
            await fetchProducts();
        } catch (error) {
            console.error('Failed to bulk delete:', error);
            showNotification('Failed to delete some products', 'error');
        } finally {
            setBulkDeleting(false);
        }
    };

    // Download CSV template
    const downloadTemplate = () => {
        const csvContent = [
            'name,slug,description,key_features,category_id,sub_category_id,super_sub_category_id,image_url,image_url_2,image_url_3,catalogue_pdf_url,featured,status',
            'Sample Product,sample-product,"Product description","Feature 1; Feature 2; Feature 3",category-id-here,,,https://example.com/image.jpg,,,https://example.com/catalogue.pdf,false,active',
            'Another Product,another-product,"Another description","Feature A; Feature B",,sub-category-id-here,,https://example.com/image2.jpg,,,,,true,active'
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product-template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Parse CSV file
    const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvFile(file);
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                showNotification('CSV file is empty or invalid', 'error');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim());
            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                const row: any = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                return row;
            });

            setCsvPreview(data);
        };

        reader.readAsText(file);
    };

    // Upload bulk products
    const handleBulkUpload = async () => {
        if (csvPreview.length === 0) {
            showNotification('No data to upload', 'error');
            return;
        }

        const confirmed = await showConfirm(`Upload ${csvPreview.length} product(s)?`);
        if (!confirmed) return;

        setBulkUploading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            for (const row of csvPreview) {
                try {
                    const productData = {
                        name: row.name,
                        slug: row.slug,
                        description: row.description || '',
                        key_features: row.key_features || '',
                        category_id: row.category_id || null,
                        sub_category_id: row.sub_category_id || null,
                        super_sub_category_id: row.super_sub_category_id || null,
                        image_url: row.image_url || '',
                        image_url_2: row.image_url_2 || '',
                        image_url_3: row.image_url_3 || '',
                        catalogue_pdf_url: row.catalogue_pdf_url || '',
                        featured: row.featured === 'true' || row.featured === '1',
                        status: row.status || 'active'
                    };

                    const response = await fetch('/api/admin/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productData),
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    errorCount++;
                }
            }

            showNotification(
                `Upload complete: ${successCount} successful, ${errorCount} failed`,
                errorCount === 0 ? 'success' : 'warning'
            );

            if (successCount > 0) {
                await fetchProducts();
                setShowBulkUpload(false);
                setCsvPreview([]);
                setCsvFile(null);
            }
        } catch (error) {
            console.error('Bulk upload error:', error);
            showNotification('Bulk upload failed', 'error');
        } finally {
            setBulkUploading(false);
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

    const filteredProducts = products.filter(p => {
        // Search term filter
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category hierarchy filter - check if product belongs to selected category at any level
        let matchesCategory = true;
        if (filterCategory) {
            // Direct category match
            if (p.category_id === filterCategory) {
                matchesCategory = true;
            }
            // Check through subcategory
            else if (p.sub_category_id) {
                const subCat = subCategories.find(sc => sc.id === p.sub_category_id);
                matchesCategory = subCat?.category?.id === filterCategory;
            }
            // Check through super subcategory
            else if (p.super_sub_category_id) {
                const superSubCat = superSubCategories.find(ssc => ssc.id === p.super_sub_category_id);
                const subCat = superSubCat?.sub_category;
                matchesCategory = subCat?.category?.id === filterCategory;
            }
            else {
                matchesCategory = false;
            }
        }
        
        // Subcategory filter - check if product belongs to selected subcategory
        let matchesSubCategory = true;
        if (filterSubCategory) {
            // Direct subcategory match
            if (p.sub_category_id === filterSubCategory) {
                matchesSubCategory = true;
            }
            // Check through super subcategory
            else if (p.super_sub_category_id) {
                const superSubCat = superSubCategories.find(ssc => ssc.id === p.super_sub_category_id);
                matchesSubCategory = superSubCat?.sub_category?.id === filterSubCategory;
            }
            else {
                matchesSubCategory = false;
            }
        }
        
        // Super subcategory filter - direct match only
        const matchesSuperSubCategory = !filterSuperSubCategory || 
            p.super_sub_category_id === filterSuperSubCategory;
        
        // Status filter
        const matchesStatus = !filterStatus || p.status === filterStatus;
        
        // Featured filter
        const matchesFeatured = !filterFeatured || 
            (filterFeatured === 'featured' ? p.featured : !p.featured);
        
        return matchesSearch && matchesCategory && matchesSubCategory && 
               matchesSuperSubCategory && matchesStatus && matchesFeatured;
    });

    // Get subcategories for selected category
    const availableSubCategories = filterCategory 
        ? subCategories.filter(sc => sc.category?.id === filterCategory)
        : [];

    // Get super subcategories for selected subcategory
    const availableSuperSubCategories = filterSubCategory
        ? superSubCategories.filter(ssc => ssc.sub_category?.id === filterSubCategory)
        : [];

    // Clear child filters when parent changes
    const handleCategoryFilterChange = (categoryId: string) => {
        setFilterCategory(categoryId);
        setFilterSubCategory('');
        setFilterSuperSubCategory('');
    };

    const handleSubCategoryFilterChange = (subCategoryId: string) => {
        setFilterSubCategory(subCategoryId);
        setFilterSuperSubCategory('');
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterSubCategory('');
        setFilterSuperSubCategory('');
        setFilterStatus('');
        setFilterFeatured('');
    };

    const hasActiveFilters = searchTerm || filterCategory || filterSubCategory || 
                             filterSuperSubCategory || filterStatus || filterFeatured;

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
                    <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Package size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-500 text-sm">{products.length} products {selectedProducts.size > 0 && `• ${selectedProducts.size} selected`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {selectedProducts.size > 0 && (
                        <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            {bulkDeleting ? 'Deleting...' : `Delete ${selectedProducts.size}`}
                        </motion.button>
                    )}
                    <button 
                        onClick={() => setShowBulkUpload(true)} 
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <FileSpreadsheet size={18} /> Bulk Upload
                    </button>
                    <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg">
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </motion.div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl" />
            </div>

            {/* Filters */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-4"
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <X size={14} />
                            Clear All
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => handleCategoryFilterChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sub Category Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Sub Category</label>
                        <select
                            value={filterSubCategory}
                            onChange={(e) => handleSubCategoryFilterChange(e.target.value)}
                            disabled={!filterCategory}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">All Sub Categories</option>
                            {availableSubCategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Super Sub Category Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Series</label>
                        <select
                            value={filterSuperSubCategory}
                            onChange={(e) => setFilterSuperSubCategory(e.target.value)}
                            disabled={!filterSubCategory}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">All Series</option>
                            {availableSuperSubCategories.map(ssc => (
                                <option key={ssc.id} value={ssc.id}>{ssc.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Featured Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Featured</label>
                        <select
                            value={filterFeatured}
                            onChange={(e) => setFilterFeatured(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Products</option>
                            <option value="featured">Featured Only</option>
                            <option value="non-featured">Non-Featured</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs text-gray-500 font-medium">Active:</span>
                            {filterCategory && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs">
                                    {categories.find(c => c.id === filterCategory)?.name}
                                    <button onClick={() => handleCategoryFilterChange('')} className="hover:bg-red-100 rounded">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {filterSubCategory && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                                    {subCategories.find(s => s.id === filterSubCategory)?.name}
                                    <button onClick={() => handleSubCategoryFilterChange('')} className="hover:bg-blue-100 rounded">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {filterSuperSubCategory && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                                    {superSubCategories.find(s => s.id === filterSuperSubCategory)?.name}
                                    <button onClick={() => setFilterSuperSubCategory('')} className="hover:bg-purple-100 rounded">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {filterStatus && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs capitalize">
                                    {filterStatus}
                                    <button onClick={() => setFilterStatus('')} className="hover:bg-gray-200 rounded">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {filterFeatured && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs capitalize">
                                    {filterFeatured.replace('-', ' ')}
                                    <button onClick={() => setFilterFeatured('')} className="hover:bg-amber-100 rounded">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            <span className="text-xs text-gray-500 ml-auto">
                                Showing {filteredProducts.length} of {products.length} products
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Grid - Compact Table View */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-12">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="hover:bg-gray-200 p-1 rounded transition-colors"
                                        title={selectedProducts.size === filteredProducts.length ? 'Deselect All' : 'Select All'}
                                    >
                                        {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? (
                                            <CheckSquare size={18} className="text-gray-700" />
                                        ) : (
                                            <Square size={18} className="text-gray-500" />
                                        )}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        selectedProducts.has(product.id) ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleProductSelection(product.id)}
                                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                                        >
                                            {selectedProducts.has(product.id) ? (
                                                <CheckSquare size={18} className="text-blue-600" />
                                            ) : (
                                                <Square size={18} className="text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={20} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {product.featured && (
                                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Featured</span>
                                                    )}
                                                    {product.catalogue_pdf_url && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <FileText size={10} /> PDF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-600 truncate max-w-xs">{getProductCategory(product)}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            product.status === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
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

            {/* Bulk Upload Modal */}
            <AnimatePresence>
                {showBulkUpload && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => !bulkUploading && setShowBulkUpload(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-50 to-white">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Bulk Upload Products</h2>
                                    <p className="text-sm text-gray-500 mt-1">Upload multiple products using CSV file</p>
                                </div>
                                <button onClick={() => !bulkUploading && setShowBulkUpload(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                {/* Download Template */}
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-blue-900 mb-1">Download CSV Template</h3>
                                            <p className="text-sm text-blue-700">Start with our template to ensure correct formatting</p>
                                        </div>
                                        <button
                                            onClick={downloadTemplate}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Download size={18} />
                                            Download
                                        </button>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition-colors">
                                        <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-3" />
                                        <p className="text-gray-600 mb-2">
                                            {csvFile ? csvFile.name : 'Choose a CSV file or drag it here'}
                                        </p>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleCsvFileChange}
                                            className="hidden"
                                            id="csv-upload"
                                            disabled={bulkUploading}
                                        />
                                        <label
                                            htmlFor="csv-upload"
                                            className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            Select File
                                        </label>
                                    </div>
                                </div>

                                {/* Preview */}
                                {csvPreview.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            Preview ({csvPreview.length} products)
                                        </h3>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="max-h-96 overflow-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 sticky top-0">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Slug</th>
                                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Featured</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {csvPreview.map((row, index) => (
                                                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                                                                <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                                                                <td className="px-4 py-2 text-gray-900">{row.name || '-'}</td>
                                                                <td className="px-4 py-2 text-gray-600">{row.slug || '-'}</td>
                                                                <td className="px-4 py-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                                        {row.status || 'active'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    {(row.featured === 'true' || row.featured === '1') ? (
                                                                        <Check size={16} className="text-green-600" />
                                                                    ) : (
                                                                        <X size={16} className="text-gray-400" />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    {csvPreview.length > 0 ? `Ready to upload ${csvPreview.length} products` : 'Upload a CSV file to begin'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => !bulkUploading && setShowBulkUpload(false)}
                                        disabled={bulkUploading}
                                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBulkUpload}
                                        disabled={csvPreview.length === 0 || bulkUploading}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {bulkUploading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={18} />
                                                Upload Products
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
