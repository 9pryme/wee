import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Unsubscribe() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const { email, token } = router.query

  useEffect(() => {
    async function handleUnsubscribe() {
      if (!email || !token) return

      try {
        const { error } = await supabase
          .from('email_preferences')
          .upsert({ 
            email: email as string, 
            unsubscribed: true 
          })

        if (error) throw error
        setStatus('success')
      } catch (error) {
        console.error('Error unsubscribing:', error)
        setStatus('error')
      }
    }

    if (email && token) {
      handleUnsubscribe()
    }
  }, [email, token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Preferences
          </h2>
          {status === 'loading' && (
            <p className="mt-2 text-sm text-gray-600">
              Processing your request...
            </p>
          )}
          {status === 'success' && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                You have been successfully unsubscribed from our emails.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                If you change your mind, you can always resubscribe by submitting a new petition.
              </p>
            </div>
          )}
          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600">
              There was an error processing your request. Please try again later.
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 