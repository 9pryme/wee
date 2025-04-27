'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UTMTable } from '@/components/admin/UTMTable'
import { toast } from 'react-hot-toast'
import type { UTMLink } from '@/types'

export default function UTMPage() {
  const [utmLinks, setUtmLinks] = useState<UTMLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('utm_links')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching UTM links:', error)
          toast.error('Failed to load UTM links')
          return
        }

        setUtmLinks(data || [])
      } catch (error) {
        console.error('Error:', error)
        toast.error('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinks()
  }, [supabase])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">UTM Tracking Dashboard</h1>
      <UTMTable data={utmLinks} onDelete={() => {}} />
    </div>
  )
} 