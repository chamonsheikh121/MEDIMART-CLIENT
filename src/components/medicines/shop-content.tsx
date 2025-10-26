'use client'

import { useEffect, useState } from 'react'
import { useGetAllMedicines } from '@/React-Query/Queries/medicineQueries'
import Filters from './medicine-filter'
import MedicineCard from './medicineCard'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

export default function ShopContent() {
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1)

    // Filters
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const requiredPrescription = searchParams.get('requiredPrescription') === 'true' ? true : undefined

    const {
        data: medicinesResponse,
        isPending,
    } = useGetAllMedicines({
        search,
        category,
        minPrice,
        maxPrice,
        requiredPrescription,
        page: currentPage,
        limit: 12,
    })

    // Extract pagination data from response
    const medicines = medicinesResponse?.data || []
    const pagination = medicinesResponse?.pagination || {
        total: 0,
        page: 1,
        pages: 1,
        limit: 12
    }

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, category, minPrice, maxPrice, requiredPrescription])

    //Generate page numbers for pagination with ellipsis
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5 // Show maximum 5 page numbers at a time
        const { pages: totalPages, page: current } = pagination

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2))
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = endPage - maxVisiblePages + 1
            }

            // Always show first page
            if (startPage > 1) {
                pages.push(1)
                if (startPage > 2) {
                    pages.push('...')
                }
            }

            // Middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            // Always show last page
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...')
                }
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Section */}
                <div className="md:w-1/4">
                    <Filters />
                </div>

                {/* Products Section */}
                <div className="md:w-3/4 min-h-screen">
                    {isPending ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin text-primary dark:text-white" size={24} />
                        </div>
                    ) : (
                        <>
                            {medicines.length ? (
                                <>
                                    {/* Results Count */}
                                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        Showing {(currentPage - 1) * pagination.limit + 1}-
                                        {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} medicines
                                    </div>

                                    {/* Medicine Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 dark:bg-gray-900">
                                        {medicines.map((medicine: IMedicine) => (
                                            <MedicineCard key={medicine._id} medicine={medicine} />
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {pagination.pages > 1 && (
                                        <div className="flex items-center justify-center gap-1 mt-8">
                                            {/* Previous Button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                                className="gap-1 pl-2.5"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Previous</span>
                                            </Button>

                                            {/* Page Numbers */}
                                            {getPageNumbers().map((page, index) => (
                                                page === '...' ? (
                                                    <Button
                                                        key={`ellipsis-${index}`}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0"
                                                        disabled
                                                    >
                                                        <span className="text-muted-foreground">...</span>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        key={page}
                                                        variant={pagination.page === page ? "default" : "outline"}
                                                        size="sm"
                                                        className="h-10 w-10 p-0"
                                                        onClick={() => setCurrentPage(page as number)}
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            ))}

                                            {/* Next Button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(pagination.page + 1)}
                                                disabled={pagination.page === pagination.pages}
                                                className="gap-1 pr-2.5"
                                            >
                                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Next</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                        No medicines found
                                    </h3>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                                        Try adjusting your search or filter criteria
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}