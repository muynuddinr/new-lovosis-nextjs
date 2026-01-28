'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, FileText, Trash2, Download, AlertCircle, Upload, ImageIcon, FileIcon, Music, CheckSquare, Square } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { useNotification } from '@/app/Components/Notification';

interface StorageFile {
    name: string;
    size: number;
    created_at: string;
    url: string;
}

interface BucketInfo {
    name: string;
    files: StorageFile[];
    totalSize: number;
}

export default function StoragePage() {
    const { showNotification, showConfirm } = useNotification();
    const [buckets, setBuckets] = useState<BucketInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalStorageUsed, setTotalStorageUsed] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    useEffect(() => {
        fetchStorageInfo();
    }, []);

    const fetchStorageInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch from the new API endpoint
            const response = await fetch('/api/storage/list');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch storage info');
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch storage');
            }

            // Convert API response to bucket format
            const formattedFiles = data.files.map((f: any) => ({
                name: f.name,
                size: f.size,
                created_at: f.created_at,
                url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${f.name}`
            }));

            // Set bucket info
            setBuckets([{
                name: 'images',
                files: formattedFiles,
                totalSize: data.totalSize
            }]);

            setTotalStorageUsed(data.totalSize);
            
            if (data.totalFiles === 0) {
                console.log('No files found in storage');
            } else {
                console.log(`Loaded ${data.totalFiles} files from storage`);
            }
        } catch (err) {
            console.error('Storage fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch storage info');
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
            return <ImageIcon size={16} className="text-red-500" />;
        }
        if (extension === 'pdf') {
            return <FileIcon size={16} className="text-red-600" />;
        }
        return <FileText size={16} className="text-red-400" />;
    };

    const getFileType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
            return 'Image';
        }
        if (extension === 'pdf') {
            return 'PDF';
        }
        return 'File';
    };

    const getFolderName = (filePath: string) => {
        const parts = filePath.split('/');
        if (parts.length > 1) {
            return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace('-', ' ');
        }
        return 'Root';
    };

    const getFolderColor = (folderName: string) => {
        const colors: { [key: string]: string } = {
            'Products': 'bg-blue-100 text-blue-700',
            'Categories': 'bg-purple-100 text-purple-700',
            'Sub categories': 'bg-green-100 text-green-700',
            'Super sub categories': 'bg-orange-100 text-orange-700',
            'Catalogues': 'bg-pink-100 text-pink-700',
            'Root': 'bg-gray-100 text-gray-700'
        };
        return colors[folderName] || 'bg-red-100 text-red-700';
    };

    const handleDeleteFile = async (bucketName: string, fileName: string) => {
        const confirmed = await showConfirm('Are you sure you want to delete this file?');
        if (!confirmed) return;

        try {
            if (!supabase) {
                throw new Error('Supabase not configured');
            }

            const { error } = await supabase
                .storage
                .from(bucketName)
                .remove([fileName]);

            if (error) throw error;
            showNotification('File deleted successfully', 'success');
            fetchStorageInfo();
        } catch (err) {
            showNotification('Failed to delete file: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
        }
    };

    const toggleFileSelection = (fileName: string) => {
        const newSelected = new Set(selectedFiles);
        if (newSelected.has(fileName)) {
            newSelected.delete(fileName);
        } else {
            newSelected.add(fileName);
        }
        setSelectedFiles(newSelected);
    };

    const toggleSelectAll = (files: StorageFile[]) => {
        if (selectedFiles.size === files.length) {
            setSelectedFiles(new Set());
        } else {
            setSelectedFiles(new Set(files.map(f => f.name)));
        }
    };

    const handleBulkDelete = async (bucketName: string) => {
        if (selectedFiles.size === 0) return;
        
        const confirmed = await showConfirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`);
        if (!confirmed) return;

        setBulkDeleting(true);
        try {
            if (!supabase) {
                throw new Error('Supabase not configured');
            }

            const { error } = await supabase
                .storage
                .from(bucketName)
                .remove(Array.from(selectedFiles));

            if (error) throw error;
            
            showNotification(`Successfully deleted ${selectedFiles.size} file(s)`, 'success');
            setSelectedFiles(new Set());
            fetchStorageInfo();
        } catch (err) {
            showNotification('Failed to delete files: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
        } finally {
            setBulkDeleting(false);
        }
    };

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setUploadError(null);

        try {
            const file = files[0];
            const fileName = `${Date.now()}-${file.name}`;

            if (!supabase) {
                throw new Error('Supabase not configured');
            }

            const { error } = await supabase
                .storage
                .from('images')
                .upload(fileName, file);

            if (error) throw error;

            showNotification('File uploaded successfully', 'success');
            e.target.value = ''; // Reset input
            fetchStorageInfo(); // Refresh list
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to upload file';
            setUploadError(errorMsg);
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
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
                    <div className="w-12 h-12 bg-linear-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                        <HardDrive size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Storage Management</h1>
                        <p className="text-gray-500 text-sm">Manage your Supabase storage buckets</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50" style={{ opacity: uploading ? 0.5 : 1 }}>
                        <Upload size={16} />
                        <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                        <input
                            type="file"
                            onChange={handleUploadFile}
                            disabled={uploading}
                            className="hidden"
                            accept="image/*,.pdf"
                        />
                    </label>
                    <button
                        onClick={fetchStorageInfo}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </motion.div>

            {/* Storage Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-linear-to-br from-white to-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                        whileHover={{ translateY: -4 }}
                        className="bg-linear-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-100 shadow-md"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-red-700 text-sm font-bold uppercase tracking-wide">Storage Used</p>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <HardDrive size={20} className="text-red-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-red-700">{formatBytes(totalStorageUsed)}</p>
                        <p className="text-red-500 text-xs mt-2">Current usage</p>
                    </motion.div>
                    <motion.div 
                        whileHover={{ translateY: -4 }}
                        className="bg-linear-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-100 shadow-md"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-red-700 text-sm font-bold uppercase tracking-wide">Free Limit</p>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertCircle size={20} className="text-red-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-gray-900">1 GB</p>
                        <p className="text-red-500 text-xs mt-2">Total capacity</p>
                    </motion.div>
                    <motion.div 
                        whileHover={{ translateY: -4 }}
                        className="bg-linear-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-100 shadow-md"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-red-700 text-sm font-bold uppercase tracking-wide">Remaining</p>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <HardDrive size={20} className="text-green-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-red-600">{formatBytes(Math.max(0, 1073741824 - totalStorageUsed))}</p>
                        <p className="text-red-500 text-xs mt-2">Available space</p>
                    </motion.div>
                </div>

                {/* Storage Usage Bar */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-gray-800 text-sm font-bold">Storage Capacity</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-red-600">{Math.round((totalStorageUsed / 1073741824) * 100)}%</span>
                            <span className="text-gray-500 text-xs">of 1GB</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((totalStorageUsed / 1073741824) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-6 rounded-full transition-all flex items-center justify-end pr-2 ${(totalStorageUsed / 1073741824) * 100 > 80
                                ? 'bg-linear-to-r from-red-600 to-red-500'
                                : (totalStorageUsed / 1073741824) * 100 > 50
                                    ? 'bg-linear-to-r from-red-500 to-red-400'
                                    : 'bg-linear-to-r from-red-400 to-orange-400'
                                }`}
                        >
                            {(totalStorageUsed / 1073741824) * 100 > 15 && (
                                <span className="text-white font-bold text-xs">{Math.round((totalStorageUsed / 1073741824) * 100)}%</span>
                            )}
                        </motion.div>
                    </div>
                </div>

                {(totalStorageUsed / 1073741824) * 100 > 80 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl flex items-start gap-3"
                    >
                        <AlertCircle className="text-red-700 mt-0.5 shrink-0" size={20} />
                        <div>
                            <p className="text-red-900 font-bold">Storage Limit Warning</p>
                            <p className="text-red-800 text-sm mt-1">You are using over 80% of your free storage quota. Consider upgrading your plan.</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-800 shadow-md flex items-start gap-3"
                >
                    <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </motion.div>
            )}

            {/* Upload Error State */}
            {uploadError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-800 shadow-md flex items-start gap-3"
                >
                    <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold">Upload Error</p>
                        <p className="text-sm">{uploadError}</p>
                    </div>
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg"
                >
                    <div className="inline-block mb-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
                    </div>
                    <p className="text-gray-700 font-semibold">Loading storage information...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your files</p>
                </motion.div>
            )}

            {/* Buckets */}
            {!loading && buckets.map((bucket, index) => (
                <motion.div
                    key={bucket.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-xl"
                >
                    {/* Bucket Header */}
                    <div className="p-8 bg-linear-to-r from-red-600 via-red-500 to-red-400 border-b-2 border-red-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <HardDrive size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white capitalize">{bucket.name} Bucket</h3>
                                    <p className="text-red-100 text-sm mt-2">{bucket.files.length} {bucket.files.length === 1 ? 'file' : 'files'} • {formatBytes(bucket.totalSize)}</p>
                                    {selectedFiles.size > 0 && (
                                        <p className="text-white text-sm mt-1 font-semibold">{selectedFiles.size} file(s) selected</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedFiles.size > 0 && (
                                    <motion.button
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBulkDelete(bucket.name)}
                                        disabled={bulkDeleting}
                                        className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        {bulkDeleting ? 'Deleting...' : `Delete ${selectedFiles.size}`}
                                    </motion.button>
                                )}
                                <div className="text-right bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-red-100 text-xs font-semibold uppercase tracking-widest mb-1">Total Size</p>
                                    <p className="text-3xl font-bold text-white">{formatBytes(bucket.totalSize)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Files List */}
                    {bucket.files.length === 0 ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText size={48} className="text-red-300" />
                                </div>
                                <p className="text-gray-700 font-semibold text-lg">No Files Yet</p>
                                <p className="text-gray-500 text-sm mt-2">Upload your first file to get started</p>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-red-200 bg-linear-to-r from-red-50 to-white">
                                        <th className="text-center px-4 py-4 text-red-700 text-sm font-bold w-12">
                                            <button
                                                onClick={() => toggleSelectAll(bucket.files)}
                                                className="hover:bg-red-100 p-1 rounded transition-colors"
                                                title={selectedFiles.size === bucket.files.length ? 'Deselect All' : 'Select All'}
                                            >
                                                {selectedFiles.size === bucket.files.length ? (
                                                    <CheckSquare size={20} className="text-red-600" />
                                                ) : (
                                                    <Square size={20} className="text-red-600" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="text-left px-6 py-4 text-red-700 text-sm font-bold">File</th>
                                        <th className="text-left px-6 py-4 text-red-700 text-sm font-bold">Folder</th>
                                        <th className="text-left px-6 py-4 text-red-700 text-sm font-bold">Type</th>
                                        <th className="text-left px-6 py-4 text-red-700 text-sm font-bold">Size</th>
                                        <th className="text-left px-6 py-4 text-red-700 text-sm font-bold">Uploaded</th>
                                        <th className="text-center px-6 py-4 text-red-700 text-sm font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bucket.files.map((file, fileIndex) => (
                                        <motion.tr 
                                            key={fileIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: fileIndex * 0.05 }}
                                            className={`border-b border-red-100 hover:bg-red-50 transition-colors duration-200 ${
                                                selectedFiles.has(file.name) ? 'bg-red-50' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => toggleFileSelection(file.name)}
                                                    className="hover:bg-red-100 p-1 rounded transition-colors"
                                                >
                                                    {selectedFiles.has(file.name) ? (
                                                        <CheckSquare size={20} className="text-red-600" />
                                                    ) : (
                                                        <Square size={20} className="text-gray-400" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                                        {getFileIcon(file.name)}
                                                    </div>
                                                    <span className="text-gray-900 font-medium truncate max-w-sm">{file.name.split('/').pop()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getFolderColor(getFolderName(file.name))}`}>
                                                    📁 {getFolderName(file.name)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                                    {getFileType(file.name)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-800 font-semibold">{formatBytes(file.size)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 text-sm">{formatDate(file.created_at)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <motion.a
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700 font-semibold shadow-sm"
                                                        title="Download"
                                                    >
                                                        <Download size={18} />
                                                    </motion.a>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDeleteFile(bucket.name, file.name)}
                                                        className="p-2.5 hover:bg-red-200 rounded-lg transition-colors text-red-600 hover:text-red-700 font-semibold shadow-sm"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
