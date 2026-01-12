'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Trash2,
    Search,
    Loader2,
    Download,
    Mail,
    Phone,
    User,
    Package,
    Clock,
    Eye
} from 'lucide-react';

interface CatalogueRequest {
    id: string;
    product_id: string | null;
    product_name: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    catalogue_pdf_url: string | null;
    status: string;
    created_at: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function CatalogueRequestsPage() {
    const [requests, setRequests] = useState<CatalogueRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/catalogue-request');
            if (response.ok) {
                const data = await response.json();
                setRequests(data.requests || []);
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this request?')) return;

        try {
            const response = await fetch(`/api/catalogue-request?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                await fetchRequests();
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const filteredRequests = requests.filter(req =>
        req.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.product_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Catalogue Requests</h1>
                        <p className="text-gray-500 text-sm">{requests.length} requests</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Requests</p>
                            <p className="text-xl font-bold text-gray-900">{requests.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Pending</p>
                            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Download size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">With PDF</p>
                            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.catalogue_pdf_url).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or product..."
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
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Customer</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Product</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Contact</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">PDF</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Date</th>
                                <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <User size={18} className="text-gray-500" />
                                            </div>
                                            <span className="text-gray-900 font-medium">{req.customer_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{req.product_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} className="text-gray-400" />
                                                <a href={`mailto:${req.customer_email}`} className="hover:text-red-600">{req.customer_email}</a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} className="text-gray-400" />
                                                <a href={`tel:${req.customer_phone}`} className="hover:text-red-600">{req.customer_phone}</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.catalogue_pdf_url ? (
                                            <a href={req.catalogue_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                                <Eye size={16} />
                                                View PDF
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">No PDF</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-400 text-sm">{formatDate(req.created_at)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDelete(req.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No catalogue requests</h3>
                    <p className="text-gray-400">Requests will appear here when customers submit them</p>
                </div>
            )}
        </div>
    );
}
