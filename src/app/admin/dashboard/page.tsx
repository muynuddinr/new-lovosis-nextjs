'use client';

import { motion } from 'framer-motion';
import {
    MessageSquare,
    Mail,
    TrendingUp,
    Users,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const stats = [
    {
        title: 'Contact Enquiries',
        value: '24',
        change: '+12%',
        icon: MessageSquare,
        color: 'from-red-500 to-red-600',
        href: '/admin/dashboard/contact-enquiry',
    },
    {
        title: 'Newsletter Subscribers',
        value: '156',
        change: '+8%',
        icon: Mail,
        color: 'from-red-400 to-red-500',
        href: '/admin/dashboard/newsletter-enquiry',
    },
    {
        title: 'This Month',
        value: '42',
        change: '+24%',
        icon: TrendingUp,
        color: 'from-emerald-500 to-emerald-600',
        href: '#',
    },
    {
        title: 'Total Users',
        value: '1,234',
        change: '+18%',
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        href: '#',
    },
];

const recentActivity = [
    { type: 'contact', name: 'John Doe', email: 'john@example.com', time: '5 min ago' },
    { type: 'newsletter', name: 'Jane Smith', email: 'jane@example.com', time: '15 min ago' },
    { type: 'contact', name: 'Bob Wilson', email: 'bob@example.com', time: '1 hour ago' },
    { type: 'newsletter', name: 'Alice Brown', email: 'alice@example.com', time: '2 hours ago' },
    { type: 'contact', name: 'Charlie Davis', email: 'charlie@example.com', time: '3 hours ago' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, <span className="text-red-500">Moin</span>! 👋
                </h1>
                <p className="text-gray-500">Here&apos;s what&apos;s happening with your enquiries today.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={stat.href}>
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-100 transition-all duration-300 group cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                            <ArrowUpRight size={16} />
                                            {stat.change}
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-2xl p-6"
            >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'contact'
                                        ? 'bg-red-100 text-red-500'
                                        : 'bg-blue-100 text-blue-500'
                                    }`}>
                                    {activity.type === 'contact' ? <MessageSquare size={18} /> : <Mail size={18} />}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{activity.name}</p>
                                    <p className="text-gray-500 text-sm">{activity.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-400 text-sm">{activity.time}</span>
                                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${activity.type === 'contact'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {activity.type === 'contact' ? 'Contact' : 'Newsletter'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
