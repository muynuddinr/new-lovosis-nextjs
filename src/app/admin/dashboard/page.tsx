'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    MessageSquare,
    Mail,
    TrendingUp,
    Users,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface ContactEnquiry {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

interface NewsletterSubscription {
    id: string;
    email: string;
    created_at: string;
}

export default function DashboardPage() {
    const [contactCount, setContactCount] = useState(0);
    const [newsletterCount, setNewsletterCount] = useState(0);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch contacts
            const contactRes = await fetch('/api/contact');
            const contacts: ContactEnquiry[] = await contactRes.json();
            setContactCount(contacts.length);

            // Fetch newsletter
            const newsletterRes = await fetch('/api/newsletter');
            const newsletters: NewsletterSubscription[] = await newsletterRes.json();
            setNewsletterCount(newsletters.length);

            // Combine and sort for recent activity
            const activity = [
                ...contacts.map(c => ({
                    type: 'contact',
                    name: `${c.first_name} ${c.last_name}`,
                    email: c.email,
                    created_at: c.created_at
                })),
                ...newsletters.map(n => ({
                    type: 'newsletter',
                    name: n.email.split('@')[0],
                    email: n.email,
                    created_at: n.created_at
                }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
             .slice(0, 5);

            setRecentActivity(activity);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const stats = [
        {
            title: 'Contact Enquiries',
            value: contactCount.toString(),
            icon: MessageSquare,
            color: 'from-red-500 to-red-600',
            href: '/admin/dashboard/contact-enquiry',
        },
        {
            title: 'Newsletter Subscribers',
            value: newsletterCount.toString(),
            icon: Mail,
            color: 'from-red-400 to-red-500',
            href: '/admin/dashboard/newsletter-enquiry',
        },
        {
            title: 'This Month',
            value: (contactCount + newsletterCount).toString(),
            icon: TrendingUp,
            color: 'from-emerald-500 to-emerald-600',
            href: '#',
        },
        {
            title: 'Total Activity',
            value: (contactCount + newsletterCount).toString(),
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            href: '#',
        },
    ];
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
                                        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stat.value}</p>
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
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    </div>
                ) : recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
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
                                    <span className="text-gray-400 text-sm">{formatTimeAgo(activity.created_at)}</span>
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
                )}
            </motion.div>
        </div>
    );
}
