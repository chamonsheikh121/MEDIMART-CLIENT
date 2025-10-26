'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/app/stores/cart-store'

export default function PaymentSuccessPage() {
  const router = useRouter();

  const {clearCart} = useCartStore();

  useEffect(() => {
    clearCart();

    const timer = setTimeout(() => {
      
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router, clearCart])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-500 text-center">
            You will be redirected to the homepage in 5 seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
