'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminButton } from '@/components/admin/AdminButton'
import { ChevronLeft } from 'lucide-react'
import { OrganizationsTable } from '@/components/admin/OrganizationsTable'
import { Oswald } from 'next/font/google'
import { getOrganizationsForAdmin, type AdminOrganization } from '@/services/banks'

const oswald = Oswald({ subsets: ['latin'] })

export default function BanksManagement() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrganizations()
  }, [])

  async function loadOrganizations() {
    try {
      const data = await getOrganizationsForAdmin()
      setOrganizations(data)
    } catch (error) {
      console.error('Error loading organizations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== id))
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-64px)]">Loading...</div>
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4">
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

      <OrganizationsTable data={organizations} onDelete={handleDelete} />
    </div>
  )
}