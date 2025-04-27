"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { AdminButton } from "@/components/admin/AdminButton"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { UTMLink } from "@/types"
import { URLDisplayModal } from './URLDisplayModal'

interface UTMFormProps {
  initialData?: UTMLink
  mode: 'create' | 'edit'
  onSuccess?: (data: UTMLink) => void
  onClose?: () => void
}

const sourceOptions = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' }
]

const mediumOptions = [
  { value: 'social', label: 'Social' },
  { value: 'direct', label: 'Direct' },
  { value: 'email', label: 'Email' },
  { value: 'referral', label: 'Referral' }
]

export function UTMForm({ initialData, mode, onSuccess, onClose }: UTMFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [generatedUrls, setGeneratedUrls] = useState<{ trackingUrl: string; fullUrl: string } | null>(null)
  const supabase = createClientComponentClient()
  const [formData, setFormData] = useState({
    volunteer_name: initialData?.volunteer_name || '',
    utm_source: initialData?.utm_source || 'whatsapp',
    utm_medium: initialData?.utm_medium || 'social',
    utm_campaign: 'WEE'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Generate a unique tracking ID
      const trackingId = Math.random().toString(36).substring(2, 8)
      
      // Create the full URL with UTM parameters and tracking ID
      const fullUrl = new URL('/petition', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      fullUrl.searchParams.set('utm_source', formData.utm_source)
      fullUrl.searchParams.set('utm_medium', formData.utm_medium)
      fullUrl.searchParams.set('utm_campaign', formData.utm_campaign)
      fullUrl.searchParams.set('ref', trackingId)

      console.log('Generated URL:', {
        fullUrl: fullUrl.toString()
      })

      // Prepare the link data
      const linkData = {
        volunteer_name: formData.volunteer_name,
        utm_source: formData.utm_source,
        utm_medium: formData.utm_medium,
        utm_campaign: formData.utm_campaign,
        full_url: fullUrl.toString(),
        tracking_url: fullUrl.toString(), // Use the same URL for tracking
        tracking_id: trackingId,
        click_count: 0,
        conversion_count: 0,
        created_at: new Date().toISOString()
      }

      console.log('Submitting UTM link data:', linkData)

      // Insert the new UTM link
      const { data, error } = await supabase
        .from('utm_links')
        .insert([linkData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', error)
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('No data returned from insert operation')
      }

      // Show the URLs in the modal
      setGeneratedUrls({
        trackingUrl: fullUrl.toString(),
        fullUrl: fullUrl.toString()
      })
      setShowUrlModal(true)

      onSuccess?.(data)
    } catch (error) {
      console.error('Error creating UTM link:', error)
      toast.error('Failed to create UTM link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowUrlModal(false)
    onClose?.()
    router.push('/admin/utm')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Base URL"
            value={process.env.NEXT_PUBLIC_APP_URL}
            disabled
            className="bg-gray-50 outline-none"
          />
        </div>

        <Input
          label="Volunteer Name"
          placeholder="Enter volunteer's full name"
          value={formData.volunteer_name}
          onChange={(e) => setFormData({ ...formData, volunteer_name: e.target.value })}
          required
        />

        <Select
          label="UTM Source"
          placeholder="Select traffic source"
          value={formData.utm_source}
          onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
          options={[{
            label: 'Source',
            options: sourceOptions
          }]}
          required
        />

        <Select
          label="UTM Medium"
          placeholder="Select marketing medium"
          value={formData.utm_medium}
          onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
          options={[{
            label: 'Medium',
            options: mediumOptions
          }]}
          required
        />

        <Input
          label="UTM Campaign"
          value={formData.utm_campaign}
          disabled
          className="bg-gray-50 outline-none"
        />

        <div className="flex gap-4">
          <AdminButton
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create UTM Link' : 'Update UTM Link'}
          </AdminButton>
        </div>
      </form>

      {generatedUrls && (
        <URLDisplayModal
          isOpen={showUrlModal}
          onClose={handleCloseModal}
          trackingUrl={generatedUrls.trackingUrl}
          fullUrl={generatedUrls.fullUrl}
        />
      )}
    </>
  )
}