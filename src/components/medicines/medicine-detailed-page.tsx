"use client"

import { useState } from 'react';
import AddToCartButton from '@/components/medicines/add-to-cart-button';
import ImageSlider from '@/components/medicines/image-slider';
import { Badge } from '@/components/ui/badge';
import { useGetMedicineById } from '@/React-Query/Queries/medicineQueries';
import { notFound } from 'next/navigation';


const MedicineDetailedPageContent = ({ id }: { id: string }) => {
    const { data: medicine, isLoading, error } = useGetMedicineById(id);
    const [activeTab, setActiveTab] = useState('description');


    if (isLoading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col gap-8 w-full max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="space-y-6">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
                            </div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.log(medicine, id);

    if (error || !medicine) {
        return notFound();
    }

    // Dummy data for additional tabs
    const ingredients = [
        "Active Ingredient: Paracetamol 500mg",
        "Excipients: Maize starch, Talc, Povidone K30",
        "Coating: Hypromellose, Titanium dioxide",
        "Source: this is a demo data",
    ];

    const usage = [
        "Take 1-2 tablets every 4-6 hours as needed",
        "Do not exceed 8 tablets in 24 hours",
        "Not recommended for children under 12 years",
        "If symptoms persist, consult your doctor"
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Slider */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                        <div className="w-full">
                            <ImageSlider images={medicine.images} />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {medicine.name}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {medicine.category}
                                    </p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        ${medicine.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {medicine.requiredPrescription && (
                                    <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
                                        Prescription Required
                                    </Badge>
                                )}

                                {medicine.stock <= 5 && medicine.stock > 0 && (
                                    <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                                        Only {medicine.stock} left in stock
                                    </Badge>
                                )}

                                {medicine.stock === 0 && (
                                    <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700">
                                        Out of Stock
                                    </Badge>
                                )}

                                {medicine.stock > 5 && (
                                    <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                                        In Stock
                                    </Badge>
                                )}

                                <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Delivery Available
                                </Badge>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                        activeTab === 'description'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('ingredients')}
                                    className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                        activeTab === 'ingredients'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Ingredients
                                </button>
                                <button
                                    onClick={() => setActiveTab('usage')}
                                    className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                        activeTab === 'usage'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    How to Use
                                </button>
                            </div>

                            <div className="py-4">
                                {activeTab === 'description' && (
                                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                        <p>{medicine.description}</p>
                                    </div>
                                )}

                                {activeTab === 'ingredients' && (
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        {ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                )}

                                {activeTab === 'usage' && (
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        {usage.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      
                                <div className="flex-1">
                                    <AddToCartButton medicine={medicine} />
                                </div>
                            </div>
                        </div>

                        {/* Extra Info */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Same-day delivery</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                                <span>Verified Authentic</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                                <span>Multiple Payment Options</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineDetailedPageContent;