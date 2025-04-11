'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminButton } from '@/components/admin/AdminButton'
import { ChevronLeft } from 'lucide-react'
import { OrganizationsTable } from '@/components/admin/OrganizationsTable'
import type { Organization } from '@/components/admin/OrganizationsTable'
import { Oswald } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'] })

export default function BanksManagement() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrganizations()
  }, [])

  async function loadOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, organization_name, type, title, name, email')
        .order('organization_name', { ascending: true })

      if (error) throw error
      
      const processedData = (data || []).map(org => ({
        ...org,
        type: org.type.length > 6 ? `${org.type.slice(0, 6)}...` : org.type,
        organization_name: org.organization_name
      }))
      
      setOrganizations(processedData)
    } catch (error) {
      console.error('Error loading organizations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-64px)]">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/admin/dashboard')}
        className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${oswald.className} text-2xl font-bold text-gray-900 uppercase`}>Organizations ({organizations.length})</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage agencies, banks and individuals that will receive petitions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => router.push('/admin/banks/new')}
          >
            Add New
          </AdminButton>
        </div>
      </div>

      <OrganizationsTable data={organizations} />
    </div>
  )
}