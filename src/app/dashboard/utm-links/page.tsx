'use client'

import { useState } from 'react'
import { generateUTMUrl } from '@/lib/utm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'react-hot-toast'

export default function UTMLinksPage() {
  const [formData, setFormData] = useState({
    source: '',
    medium: '',
    campaign: '',
    volunteerName: '',
    baseUrl: 'https://weewantmore.com'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClientComponentClient()
    
    const fullUrl = generateUTMUrl(formData.baseUrl, {
      source: formData.source,
      medium: formData.medium,
      campaign: formData.campaign,
      volunteerName: formData.volunteerName
    })

    const { error } = await supabase
      .from('utm_links')
      .insert([{
        source: formData.source,
        medium: formData.medium,
        campaign: formData.campaign,
        volunteer_name: formData.volunteerName,
        full_url: fullUrl,
        click_count: 0,
        conversion_count: 0
      }])

    if (error) {
      console.error('Error creating UTM link:', error)
      toast.error('Failed to create UTM link')
      return
    }

    toast.success('UTM link created successfully')

    // Reset form
    setFormData({
      source: '',
      medium: '',
      campaign: '',
      volunteerName: '',
      baseUrl: 'https://weewantmore.com'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create UTM Link</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medium</label>
            <input
              type="text"
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign</label>
            <input
              type="text"
              value={formData.campaign}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Volunteer Name</label>
            <input
              type="text"
              value={formData.volunteerName}
              onChange={(e) => setFormData({ ...formData, volunteerName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create UTM Link
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 