'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminInput } from './AdminInput'
import { AdminButton } from './AdminButton'

interface BankEmailFormProps {
  bankId: string
  bankName: string
  currentEmail?: string
  onUpdate: () => void
}

interface ApiError {
  message: string
}

export function BankEmailForm({ bankId, bankName, currentEmail, onUpdate }: BankEmailFormProps) {
  const [email, setEmail] = useState(currentEmail || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('banks')
        .update({ email })
        .eq('id', bankId)

      if (error) throw error as ApiError

      onUpdate()
    } catch (err: ApiError | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput
        label={`Email for ${bankName}`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required
      />
      <AdminButton
        type="submit"
        variant="primary"
        size="sm"
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update Email'}
      </AdminButton>
    </form>
  )
} 