"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import img1 from '../../../public/1.webp';
import img2 from '../../../public/2.jpg';
import img3 from '../../../public/3.jpg';
import img4 from '../../../public/4.jpg';
import img5 from '../../../public/5.webp';
import img6 from '../../../public/6.webp';
import img7 from '../../../public/7.webp';
import img8 from '../../../public/8.webp';
import img9 from '../../../public/9.webp';

interface GalleryImage {
    _id: string;
    title: string;
    description?: string;
    images: string[];
    category: string;
    date: string;
}

const SAMPLE_CERTIFICATES: GalleryImage[] = [
    {
        _id: '1',
        title: 'Company Recognition Certificate',
        description: 'Official recognition for outstanding achievements in business excellence and industry leadership.',
        images: [img1.src],
        category: 'Recognition',
        date: '2023-01-15'
    },
    {
        _id: '2',
        title: 'Karnataka Startup Certificate',
        description: 'Recognized by the Karnataka Startup Cell under the Karnataka Startup Policy for innovative solutions.',
        images: [img2.src],
        category: 'Startup',
        date: '2023-02-20'
    },
    {
        _id: '3',
        title: 'IEC 61058-1 Compliance',
        description: 'International compliance certification for electrical safety in switch components and appliances.',
        images: [img3.src],
        category: 'Compliance',
        date: '2023-03-10'
    },
    {
        _id: '4',
        title: 'IEC 61010-1 Compliance',
        description: 'Safety standards certification for measurement, control, and laboratory equipment systems.',
        images: [img4.src],
        category: 'Compliance',
        date: '2023-04-05'
    },
    {
        _id: '5',
        title: 'ISO 45001:2018 Certificate',
        description: 'Occupational Health and Safety Management System certification for workplace safety excellence.',
        images: [img5.src],
        category: 'ISO',
        date: '2023-05-12'
    },
    {
        _id: '6',
        title: 'ISO 14001:2015 Certificate',
        description: 'Environmental Management System certification demonstrating commitment to sustainable practices.',
        images: [img6.src],
        category: 'ISO',
        date: '2023-06-18'
    },
    {
        _id: '7',
        title: 'ISO 9001:2015 Certificate',
        description: 'Quality Management System certification ensuring consistent product and service excellence.',
        images: [img7.src],
        category: 'ISO',
        date: '2023-07-22'
    },
    {
        _id: '8',
        title: 'GMP Certificate',
        description: 'Good Manufacturing Practice certification for highest standards in manufacturing processes and quality assurance.',
        images: [img8.src],
        category: 'Manufacturing',
        date: '2023-08-30'
    },
    {
        _id: '9',
        title: 'Certificate of Compliance',
        description: 'International compliance certification meeting global standards for product safety and performance.',
        images: [img9.src],
        category: 'Compliance',
        date: '2023-09-14'
    }
];

export default function Certificates() {
    const [certificateItems, setCertificateItems] = useState<GalleryImage[]>([]);
    const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const fetchCertificates = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/certificates');
            if (response.ok) {
                const data = await response.json();
                setCertificateItems(data.length > 0 ? data : SAMPLE_CERTIFICATES);
            } else {
                // API endpoint not available, use sample data
                setCertificateItems(SAMPLE_CERTIFICATES);
            }
        } catch (error) {
            // Network or parsing error, use sample data
            setCertificateItems(SAMPLE_CERTIFICATES);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem && currentImageIndex < selectedItem.images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <div className="space-y-6">
                        <div className="inline-block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 blur-2xl opacity-20 rounded-full" />
                                <div className="relative bg-gradient-to-r from-red-50 to-red-100 px-6 py-3 rounded-full border border-red-200">
                                    <p className="text-red-700 font-bold text-sm uppercase tracking-widest">Quality & Excellence</p>
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Our <span className="text-transparent bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text">Accreditations</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Lovosis is proud to hold multiple international certifications and quality standards. 
                            Our commitment to excellence is validated by recognized industry bodies and organizations.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        [...Array(9)].map((_, i) => (
                            <div key={i} className="h-96 animate-pulse bg-gray-200 rounded-2xl shadow-lg" />
                        ))
                    ) : (
                        certificateItems.map((itemData) => (
                            <div
                                key={itemData._id}
                                className={`group relative h-96 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 cursor-pointer flex flex-col overflow-hidden ${selectedItem?._id === itemData._id ? 'hidden' : ''}`}
                                onClick={() => {
                                    setSelectedItem(itemData);
                                    setCurrentImageIndex(0);
                                }}
                            >
                                {itemData.images && itemData.images.length > 0 ? (
                                    <>
                                        <div className="flex-1 flex items-center justify-center p-5 bg-white">
                                            <div className="w-full max-w-xs bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-center justify-center">
                                                <Image
                                                    src={itemData.images[0]}
                                                    alt={itemData.title}
                                                    width={360}
                                                    height={440}
                                                    className="object-contain w-auto h-auto max-w-full max-h-80"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex items-center justify-center">
                                            <h3 className="text-gray-900 font-bold text-sm text-center leading-snug">{itemData.title}</h3>
                                        </div>

                                        {itemData.images.length > 1 && (
                                            <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                                                <p className="text-white text-xs font-bold">{currentImageIndex + 1}/{itemData.images.length}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                                        <svg className="w-14 h-14 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-500 text-sm font-semibold">No image</span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedItem(null)}>
                        <div className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
                                <div className="relative flex-1 bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
                                    <div className="relative w-full h-full rounded-2xl border-2 border-gray-100 bg-white shadow-inner overflow-hidden">
                                        <Image
                                            src={selectedItem.images[currentImageIndex]}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain"
                                            quality={100}
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />

                                        {selectedItem.images.length > 1 && (
                                            <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between">
                                                {currentImageIndex > 0 && (
                                                    <button
                                                        onClick={handlePrevImage}
                                                        className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors backdrop-blur-sm"
                                                    >
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {currentImageIndex < selectedItem.images.length - 1 && (
                                                    <button
                                                        onClick={handleNextImage}
                                                        className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors backdrop-blur-sm"
                                                    >
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full md:w-96 p-6 md:p-8 flex flex-col bg-white border-t md:border-t-0 md:border-l md:border-gray-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <button
                                            onClick={() => setSelectedItem(null)}
                                            className="p-2 hover:bg-red-50 rounded-full transition-colors ml-auto"
                                            aria-label="Close"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {selectedItem.title}
                                    </h2>

                                    {selectedItem.description && (
                                        <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                                            {selectedItem.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-6 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                            </svg>
                                            <span>{selectedItem.images.length} {selectedItem.images.length === 1 ? 'image' : 'images'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}