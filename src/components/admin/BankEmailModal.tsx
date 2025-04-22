'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminInput } from '@/components/admin/AdminInput'
import { AdminButton } from '@/components/admin/AdminButton'
import { getOrganizations } from '@/services/banks'
import type { Organization } from '@/services/banks'

interface BankEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BankEmailModal({ isOpen, onClose }: BankEmailModalProps) {
  const [selectedBank, setSelectedBank] = useState('')
  const [email, setEmail] = useState('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadOrganizations() {
      try {
        const orgs = await getOrganizations()
        setOrganizations(orgs)
      } catch (error) {
        console.error('Error loading organizations:', error)
      }
    }

    if (isOpen) {
      loadOrganizations()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBank || !email) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ email })
        .eq('id', selectedBank)

      if (error) throw error
      onClose()
    } catch (error) {
      console.error('Error updating email:', error)
      alert('Failed to update email')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Update Bank Email</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a bank</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.organization_name || org.name}
                </option>
              ))}
            </select>
          </div>

          <AdminInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              disabled={isLoading || !selectedBank || !email}
            >
              {isLoading ? 'Updating...' : 'Update Email'}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}