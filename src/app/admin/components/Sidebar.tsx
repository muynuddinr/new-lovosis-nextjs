'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    MessageSquare,
    Mail,
    LogOut,
    ChevronRight,
    FolderTree,
    Layers,
    Grid3X3,
    Package,
    FileText
} from 'lucide-react';

const navItems = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Category',
        href: '/admin/dashboard/category',
        icon: FolderTree,
    },
    {
        title: 'Sub Category',
        href: '/admin/dashboard/sub-category',
        icon: Layers,
    },
    {
        title: 'Super Sub Category',
        href: '/admin/dashboard/super-sub-category',
        icon: Grid3X3,
    },
    {
        title: 'Products',
        href: '/admin/dashboard/products',
        icon: Package,
    },
    {
        title: 'Catalogue Requests',
        href: '/admin/dashboard/catalogue-requests',
        icon: FileText,
    },
    {
        title: 'Contact Enquiry',
        href: '/admin/dashboard/contact-enquiry',
        icon: MessageSquare,
    },
    {
        title: 'Newsletter Enquiry',
        href: '/admin/dashboard/newsletter-enquiry',
        icon: Mail,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin');
    };

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm"
        >
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                        Lovosis Admin
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-red-50 border border-red-200 text-red-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon
                                    size={18}
                                    className={`transition-colors ${isActive ? 'text-red-500' : 'group-hover:text-red-500'
                                        }`}
                                />
                                <span className="flex-1 font-medium text-sm">{item.title}</span>
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <ChevronRight size={14} className="text-red-500" />
                                    </motion.div>
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-100">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Logout</span>
                </motion.button>
            </div>
        </motion.aside>
    );
}
