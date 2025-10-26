'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

const categories = [
  { value: 'Pain-Relief', label: 'Pain Relief' },
  { value: 'Vitamins', label: 'Vitamins' },
  { value: 'Antibiotics', label: 'Antibiotics' },
  { value: 'Allergy', label: 'Allergy' },
  { value: 'Digestive', label: 'Digestive Health' },
  { value: 'Respiratory', label: 'Respiratory' },
] as const

export default function Filters() {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  // States to hold current filter values
  const [searchValue, setSearchValue] = useState('')
  const [category, setCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [requiresPrescription, setRequiresPrescription] = useState(false)

  // Sync states with searchParams when URL changes
  useEffect(() => {
    setSearchValue(currentSearchParams.get('search') || '')
    setCategory(currentSearchParams.get('category') || 'all')
    setMinPrice(currentSearchParams.get('minPrice') || '')
    setMaxPrice(currentSearchParams.get('maxPrice') || '')
    setRequiresPrescription(currentSearchParams.get('requiredPrescription') === 'true')
  }, [currentSearchParams])

  const updateParams = useDebouncedCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(currentSearchParams.toString())
    newParams.delete('page') // Reset pagination

    Object.entries(params).forEach(([key, value]) => {
      if (value?.trim()) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    router.push(`${pathname}?${newParams.toString()}`)
  }, 500)

  const resetFilters = () => {
    router.push(pathname)
    setSearchValue('')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setRequiresPrescription(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm sticky top-20">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Filters</h2>

      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search medicines..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={searchValue}
          onChange={(e) => {
            const value = e.target.value
            setSearchValue(value)
            updateParams({ search: value })
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          className="w-full px-3 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={category}
          onChange={(e) => {
            const value = e.target.value
            setCategory(value)
            updateParams({ category: value === 'all' ? '' : value })
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={minPrice}
            onChange={(e) => {
              const value = e.target.value
              setMinPrice(value)
              updateParams({ minPrice: value })
            }}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={maxPrice}
            onChange={(e) => {
              const value = e.target.value
              setMaxPrice(value)
              updateParams({ maxPrice: value })
            }}
          />
        </div>
      </div>

      {/* Prescription Required */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
            checked={requiresPrescription}
            onChange={(e) => {
              const checked = e.target.checked
              setRequiresPrescription(checked)
              updateParams({ requiredPrescription: checked ? 'true' : '' })
            }}
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Prescription</span>
        </label>
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Reset Filters
      </button>
    </div>
  )
}
