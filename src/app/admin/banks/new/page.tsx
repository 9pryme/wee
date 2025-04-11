'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminInput } from '@/components/admin/AdminInput'
import { AdminButton } from '@/components/admin/AdminButton'
import { ChevronLeft } from 'lucide-react'

type OrganizationType = 'bank' | 'government_agency' | 'government_ministry' | 'financial_technology' | 'development_finance_institution'

interface ApiError {
  message: string
}

export default function NewOrganization() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: '' as OrganizationType,
    title: '',
    name: '',
    email: '',
    organization_name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const typeOptions = [
    { value: 'bank', label: 'Bank' },
    { value: 'government_agency', label: 'Government Agency' },
    { value: 'government_ministry', label: 'Government Ministry' },
    { value: 'financial_technology', label: 'Financial Technology' },
    { value: 'development_finance_institution', label: 'Development Finance Institution' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('organizations')
        .insert({
          type: formData.type,
          title: formData.title,
          name: formData.name,
          email: formData.email,
          organization_name: formData.organization_name
        })

      if (error) throw error as ApiError

      router.push('/admin/banks')
    } catch (err: ApiError | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <button
            onClick={() => router.push('/admin/banks')}
            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Organizations
          </button>

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Organization</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create a new organization in the system
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AdminInput
              label="Type"
              variant="select"
              options={typeOptions}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as OrganizationType })}
              error={error}
              required
            />

            <AdminInput
              label="Organization Name"
              placeholder="Enter organization name"
              value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
              error={error}
              required
            />

            <AdminInput
              label="Title"
              placeholder="e.g. CEO, Director, Manager"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={error}
              required
            />

            <AdminInput
              label="Full Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={error}
              required
            />

            <AdminInput
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={error}
              required
            />

            <div className="flex justify-end">
              <AdminButton
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Continue'}
              </AdminButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}