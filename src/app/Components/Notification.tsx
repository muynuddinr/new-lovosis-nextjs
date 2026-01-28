'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning';

interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

interface ConfirmDialog {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
    showConfirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [nextId, setNextId] = useState(1);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

    const showNotification = useCallback((message: string, type: NotificationType) => {
        const id = nextId;
        setNextId(id + 1);
        setNotifications(prev => [...prev, { id, message, type }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, [nextId]);

    const showConfirm = useCallback((message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmDialog({
                message,
                onConfirm: () => {
                    setConfirmDialog(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <XCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getStyles = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-500 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-500 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-500 text-yellow-800';
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirm }}>
            {children}
            
            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmDialog && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={confirmDialog.onCancel}
                        />
                        
                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">localhost:3000 says</h3>
                                <p className="text-gray-700 text-sm whitespace-pre-line">
                                    {confirmDialog.message}
                                </p>
                            </div>
                            
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={confirmDialog.onCancel}
                                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDialog.onConfirm}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg backdrop-blur-sm ${getStyles(notification.type)}`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium whitespace-pre-line break-words">
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() => dismissNotification(notification.id)}
                                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
}
