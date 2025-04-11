'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminInput } from '@/components/admin/AdminInput'
import { AdminButton } from '@/components/admin/AdminButton'
import { getBanks } from '@/services/banks'
import type { Bank } from '@/services/banks'

interface BankEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ApiError {
  message: string
}

export function BankEmailModal({ isOpen, onClose }: BankEmailModalProps) {
  const [email, setEmail] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadBanks()
    }
  }, [isOpen])

  async function loadBanks() {
    try {
      const banksList = await getBanks()
      setBanks(banksList)
    } catch (error) {
      console.error('Error loading banks:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const bank = banks.find(b => b.code === selectedBank)
      if (!bank) throw new Error('Bank not found') as ApiError

      const { error: upsertError } = await supabase
        .from('banks')
        .upsert({ 
          code: bank.code,
          name: bank.name,
          email: email 
        })

      if (upsertError) throw upsertError as ApiError
      onClose()
    } catch (error: ApiError | unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-['Oswald'] uppercase">
            Update Bank Email
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AdminInput
            label="Select Bank"
            variant="select"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            options={banks.map(bank => ({
              value: bank.code,
              label: bank.name
            }))}
            required
          />

          <AdminInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex justify-end gap-4 pt-4">
            <AdminButton
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Email'}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}