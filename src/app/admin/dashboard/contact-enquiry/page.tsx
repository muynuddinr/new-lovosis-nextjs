'use client';

import { motion } from 'framer-motion';
import {
    MessageSquare,
    Eye,
    Trash2,
    CheckCircle,
    Clock,
    Archive
} from 'lucide-react';

// Demo data for contact enquiries
const contactEnquiries = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        message: 'I am interested in your services. Please contact me for more details about pricing.',
        status: 'pending',
        created_at: '2024-01-10T10:30:00Z',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 234 567 8901',
        message: 'Would like to schedule a consultation regarding your products.',
        status: 'resolved',
        created_at: '2024-01-09T14:20:00Z',
    },
    {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        phone: '+1 234 567 8902',
        message: 'Need assistance with my recent order. Order ID: #12345',
        status: 'pending',
        created_at: '2024-01-08T09:15:00Z',
    },
    {
        id: '4',
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        phone: '+1 234 567 8903',
        message: 'Inquiry about partnership opportunities.',
        status: 'archived',
        created_at: '2024-01-07T16:45:00Z',
    },
    {
        id: '5',
        name: 'Charlie Davis',
        email: 'charlie.davis@example.com',
        phone: '+1 234 567 8904',
        message: 'Technical support request for product configuration.',
        status: 'pending',
        created_at: '2024-01-06T11:30:00Z',
    },
    {
        id: '6',
        name: 'Eva Martinez',
        email: 'eva.martinez@example.com',
        phone: '+1 234 567 8905',
        message: 'Question about delivery timeline for international shipping.',
        status: 'resolved',
        created_at: '2024-01-05T13:00:00Z',
    },
];

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
                        <MessageSquare size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
                        <p className="text-gray-500 text-sm">Manage all contact form submissions</p>
                    </div>
                </div>
                <div className="text-gray-500 text-sm">
                    Total: <span className="text-gray-900 font-semibold">{contactEnquiries.length}</span> enquiries
                </div>
            </motion.div>

            {/* Table */}
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
                            {contactEnquiries.map((enquiry, index) => (
                                <motion.tr
                                    key={enquiry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900 font-medium">{enquiry.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{enquiry.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{enquiry.phone}</span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <span className="text-gray-500 line-clamp-2 text-sm">{enquiry.message}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(enquiry.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-400 text-sm">{formatDate(enquiry.created_at)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-500 hover:text-blue-600">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600">
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
        </div>
    );
}
