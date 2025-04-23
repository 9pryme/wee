"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { AdminButton } from "@/components/admin/AdminButton"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import type { Organization } from "@/services/banks"

interface OrganizationFormProps {
  initialData?: Organization
  mode: 'create' | 'edit'
  onSuccess?: () => void
}

const organizationTypes = [
  { value: 'bank', label: 'Bank' },
  { value: 'development_finance_institution', label: 'Development Finance Institution' },
  { value: 'government_agency', label: 'Government Agency' },
  { value: 'government_ministry', label: 'Government Ministry' },
  { value: 'financial_technology', label: 'Financial Technology' }
]

export function OrganizationForm({ initialData, mode, onSuccess }: OrganizationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    organization_name: initialData?.organization_name || '',
    name: initialData?.name || '',
    title: initialData?.title || '',
    type: initialData?.type || '',
    organizationemail: initialData?.organizationemail || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'create') {
        const { error } = await supabase
          .from('organizations')
          .insert([formData])

        if (error) throw error

        toast.success('Organization created successfully')
        router.push('/admin/banks')
      } else {
        const { error } = await supabase
          .from('organizations')
          .update(formData)
          .eq('id', initialData?.id)

        if (error) throw error

        toast.success('Organization updated successfully')
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error saving organization:', error)
      toast.error(`Failed to ${mode} organization`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Organization Name"
        value={formData.organization_name}
        onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
        required
      />

      <Input
        label="Contact Person Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Select
        label="Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        options={[{
          label: 'Organization Types',
          options: organizationTypes
        }]}
        required
      />

      <Input
        label="Organization Email"
        type="email"
        value={formData.organizationemail}
        onChange={(e) => setFormData({ ...formData, organizationemail: e.target.value })}
        required
      />

      <div className="flex gap-4">
        <AdminButton
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Organization' : 'Update Organization'}
        </AdminButton>

        <AdminButton
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/banks')}
        >
          Cancel
        </AdminButton>
      </div>
    </form>
  )
} 