import ShopContent from '@/components/medicines/shop-content'
import React from 'react'

export default function ShopPage() {
  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
      <React.Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
      </React.Suspense>
    </div>
  )
}
