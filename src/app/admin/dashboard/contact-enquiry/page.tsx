'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    MessageSquare,
    Eye,
    Trash2,
    CheckCircle,
    Clock,
    Archive,
    CheckSquare,
    Square,
    Loader2
} from 'lucide-react';
import { useNotification } from '@/app/Components/Notification';

interface ContactEnquiry {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    message: string;
    business?: string;
    status: 'pending' | 'resolved' | 'archived';
    created_at: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">
                    <Clock size={12} /> Pending
                </span>
            );
        case 'resolved':
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium">
                    <CheckCircle size={12} /> Resolved
                </span>
            );
        case 'archived':
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                    <Archive size={12} /> Archived
                </span>
            );
        default:
            return null;
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function ContactEnquiryPage() {
    const { showNotification, showConfirm } = useNotification();
    const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/contact');
            if (!response.ok) throw new Error('Failed to fetch enquiries');
            const data = await response.json();
            setEnquiries(data || []);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;

        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setEnquiries(enquiries.filter(e => e.id !== id));
            } else {
                alert('Failed to delete enquiry');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete enquiry');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
            }
        } catch (error) {
            console.error('Status update error:', error);
        }
    };

    const toggleItemSelection = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === enquiries.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(enquiries.map(item => item.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedItems.size === 0) return;
        
        const confirmed = await showConfirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`);
        if (!confirmed) return;

        setBulkDeleting(true);
        try {
            const results = await Promise.all(
                Array.from(selectedItems).map(async (id) => {
                    const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
                    if (!response.ok) {
                        const data = await response.json();
                        return { id, error: data.error };
                    }
                    return { id, success: true };
                })
            );
            
            const errors = results.filter(r => r.error);
            const successes = results.filter(r => r.success);
            
            if (errors.length > 0) {
                showNotification(`Deleted ${successes.length} item(s).\n\nFailed to delete ${errors.length}`, 'warning');
            } else {
                showNotification(`Successfully deleted ${selectedItems.size} item(s)`, 'success');
            }
            
            setSelectedItems(new Set());
            await fetchEnquiries();
        } catch (error) {
            console.error('Failed to bulk delete:', error);
            showNotification('Failed to delete items', 'error');
        } finally {
            setBulkDeleting(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <MessageSquare size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
                        <p className="text-gray-500 text-sm">Manage all contact form submissions</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-gray-500 text-sm">
                        Total: <span className="text-gray-900 font-semibold">{enquiries.length}</span> enquiries
                    </div>
                    {selectedItems.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bulkDeleting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Trash2 size={16} />
                            )}
                            Delete {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
                >
                    {error}
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 text-center"
                >
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                    <p className="text-gray-600 mt-4">Loading enquiries...</p>
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && enquiries.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-gray-200 rounded-2xl p-12 text-center"
                >
                    <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No enquiries yet</p>
                </motion.div>
            )}

            {/* Table */}
            {!loading && enquiries.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-6 py-4 text-gray-600 text-sm font-medium">
                                        <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                            {selectedItems.size === enquiries.length && enquiries.length > 0 ? (
                                                <CheckSquare size={18} className="text-red-500" />
                                            ) : (
                                                <Square size={18} className="text-gray-400" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Name</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Email</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Phone</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Message</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Status</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Date</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map((enquiry, index) => (
                                    <motion.tr
                                        key={enquiry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedItems.has(enquiry.id) ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleItemSelection(enquiry.id)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                                {selectedItems.has(enquiry.id) ? (
                                                    <CheckSquare size={18} className="text-red-500" />
                                                ) : (
                                                    <Square size={18} className="text-gray-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-medium">{enquiry.first_name} {enquiry.last_name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600">{enquiry.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600">{enquiry.phone || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <span className="text-gray-500 line-clamp-2 text-sm">{enquiry.message}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={enquiry.status}
                                                onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                                                className="px-2 py-1 rounded border border-gray-200 text-xs cursor-pointer"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400 text-sm">{formatDate(enquiry.created_at)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(enquiry.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600"
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
            )}
        </div>
    );
}
