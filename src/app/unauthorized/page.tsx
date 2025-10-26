
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()
  const message = 'You are not authorized to access this page'

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/log-in')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className=" flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            You will be redirected to login in 5 seconds...
          </p>
          <Button 
            onClick={() => router.push('/log-in')}
            variant="default"
            className="w-full"
          >
            Go to Login Now
          </Button>
        </div>
      </div>
    </div>
  )
}