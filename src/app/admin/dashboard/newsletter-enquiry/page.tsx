'use client';

import { motion } from 'framer-motion';
import {
    Mail,
    Trash2,
    CheckCircle,
    XCircle,
    UserPlus
} from 'lucide-react';

// Demo data for newsletter enquiries
const newsletterEnquiries = [
    {
        id: '1',
        email: 'john.doe@example.com',
        subscribed_at: '2024-01-10T10:30:00Z',
        status: 'active',
    },
    {
        id: '2',
        email: 'jane.smith@example.com',
        subscribed_at: '2024-01-09T14:20:00Z',
        status: 'active',
    },
    {
        id: '3',
        email: 'bob.wilson@example.com',
        subscribed_at: '2024-01-08T09:15:00Z',
        status: 'unsubscribed',
    },
    {
        id: '4',
        email: 'alice.brown@example.com',
        subscribed_at: '2024-01-07T16:45:00Z',
        status: 'active',
    },
    {
        id: '5',
        email: 'charlie.davis@example.com',
        subscribed_at: '2024-01-06T11:30:00Z',
        status: 'active',
    },
    {
        id: '6',
        email: 'eva.martinez@example.com',
        subscribed_at: '2024-01-05T13:00:00Z',
        status: 'unsubscribed',
    },
    {
        id: '7',
        email: 'frank.johnson@example.com',
        subscribed_at: '2024-01-04T08:00:00Z',
        status: 'active',
    },
    {
        id: '8',
        email: 'grace.lee@example.com',
        subscribed_at: '2024-01-03T15:30:00Z',
        status: 'active',
    },
];

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
    const activeCount = newsletterEnquiries.filter(e => e.status === 'active').length;

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
                        Active: <span className="text-emerald-600 font-semibold">{activeCount}</span> / {newsletterEnquiries.length}
                    </div>
                </div>
            </motion.div>

            {/* Stats cards */}
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
                            <p className="text-xl font-bold text-gray-900">{newsletterEnquiries.length}</p>
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
                            <p className="text-xl font-bold text-gray-900">{newsletterEnquiries.length - activeCount}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Table */}
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
                            {newsletterEnquiries.map((enquiry, index) => (
                                <motion.tr
                                    key={enquiry.id}
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
                                                {enquiry.email.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-gray-900 font-medium">{enquiry.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-400 text-sm">{formatDate(enquiry.subscribed_at)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(enquiry.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
