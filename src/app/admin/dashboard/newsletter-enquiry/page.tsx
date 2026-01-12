'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Mail,
    Trash2,
    CheckCircle,
    XCircle,
    UserPlus
} from 'lucide-react';

interface NewsletterSubscription {
    id: string;
    email: string;
    status: 'active' | 'unsubscribed';
    created_at: string;
}

const getStatusBadge = (status: string) => {
    if (status === 'active') {
        return (
            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium">
                <CheckCircle size={12} /> Active
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-500 rounded-full text-xs font-medium">
            <XCircle size={12} /> Unsubscribed
        </span>
    );
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

export default function NewsletterEnquiryPage() {
    const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/newsletter');
            if (!response.ok) throw new Error('Failed to fetch subscriptions');
            const data = await response.json();
            setSubscriptions(data || []);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load subscriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscription?')) return;

        try {
            const response = await fetch(`/api/newsletter/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSubscriptions(subscriptions.filter(s => s.id !== id));
            } else {
                alert('Failed to delete subscription');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete subscription');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/newsletter/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
            }
        } catch (error) {
            console.error('Status update error:', error);
        }
    };

    const activeCount = subscriptions.filter(s => s.status === 'active').length;

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
                        <Mail size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
                        <p className="text-gray-500 text-sm">Manage newsletter subscriptions</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-gray-500 text-sm">
                        Active: <span className="text-emerald-600 font-semibold">{activeCount}</span> / {subscriptions.length}
                    </div>
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

            {/* Stats cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <UserPlus size={20} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Subscribers</p>
                                <p className="text-xl font-bold text-gray-900">{subscriptions.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle size={20} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Active</p>
                                <p className="text-xl font-bold text-gray-900">{activeCount}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <XCircle size={20} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Unsubscribed</p>
                                <p className="text-xl font-bold text-gray-900">{subscriptions.length - activeCount}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
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
                    <p className="text-gray-600 mt-4">Loading subscriptions...</p>
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && subscriptions.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-gray-200 rounded-2xl p-12 text-center"
                >
                    <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No subscribers yet</p>
                </motion.div>
            )}

            {/* Table */}
            {!loading && subscriptions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">#</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Email Address</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Subscribed Date</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Status</th>
                                    <th className="text-left px-6 py-4 text-gray-600 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map((subscription, index) => (
                                    <motion.tr
                                        key={subscription.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400">{index + 1}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                                                    {subscription.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-gray-900 font-medium">{subscription.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400 text-sm">{formatDate(subscription.created_at)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={subscription.status}
                                                onChange={(e) => handleStatusChange(subscription.id, e.target.value)}
                                                className="px-2 py-1 rounded border border-gray-200 text-xs cursor-pointer"
                                            >
                                                <option value="active">Active</option>
                                                <option value="unsubscribed">Unsubscribed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(subscription.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
