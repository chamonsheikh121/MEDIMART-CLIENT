

import { XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-600 text-center mb-6">
            Unfortunately, we couldn&apos;t process your payment.
            <br />
            Please try again or contact support.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
