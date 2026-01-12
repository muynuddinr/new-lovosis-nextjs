'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Server,
    Database,
    User,
    CheckCircle,
    XCircle,
    HardDrive
} from 'lucide-react';

interface StatusData {
    serverConnected: boolean;
    databaseConnected: boolean;
    storageConnected: boolean;
    adminInfo: { name: string; username: string } | null;
}

export default function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [status, setStatus] = useState<StatusData>({
        serverConnected: false,
        databaseConnected: false,
        storageConnected: false,
        adminInfo: null,
    });

    useEffect(() => {
        // Update time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Fetch status immediately and every 30 seconds
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/admin/status');
                const data = await response.json();
                setStatus(data);
            } catch {
                setStatus(prev => ({ ...prev, serverConnected: false, databaseConnected: false, storageConnected: false }));
            }
        };

        fetchStatus();
        const statusInterval = setInterval(fetchStatus, 30000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(statusInterval);
        };
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm"
        >
            {/* Date and Time */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} className="text-red-500" />
                    <span className="text-sm font-medium">{formatDate(currentTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} className="text-red-500" />
                    <span className="text-sm font-medium font-mono">{formatTime(currentTime)}</span>
                </div>
            </div>

            {/* Status indicators and Admin info */}
            <div className="flex items-center gap-4">
                {/* Server Status */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                    <Server size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Server:</span>
                    {status.serverConnected ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle size={12} />
                            <span className="text-xs font-medium">OK</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-red-500">
                            <XCircle size={12} />
                            <span className="text-xs font-medium">Down</span>
                        </div>
                    )}
                </motion.div>

                {/* Database Status */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                    <Database size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Database:</span>
                    {status.databaseConnected ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle size={12} />
                            <span className="text-xs font-medium">OK</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-amber-500">
                            <XCircle size={12} />
                            <span className="text-xs font-medium">Error</span>
                        </div>
                    )}
                </motion.div>

                {/* Storage Status */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                    <HardDrive size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Storage:</span>
                    {status.storageConnected ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle size={12} />
                            <span className="text-xs font-medium">OK</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-amber-500">
                            <XCircle size={12} />
                            <span className="text-xs font-medium">Error</span>
                        </div>
                    )}
                </motion.div>

                {/* Admin Info */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 pl-4 border-l border-gray-200"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                        <User size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {status.adminInfo?.name || 'Moin'}
                        </p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
}
