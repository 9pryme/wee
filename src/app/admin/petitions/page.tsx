'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'
import { DataTable } from '@/components/ui/data-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { SearchBar } from '@/components/common/SearchBar/SearchBar'
import { ChevronLeft } from 'lucide-react'
import { Oswald } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'] })

interface PetitionSignature {
  id: string
  created_at: string
  petitioner_name: string
  petitioner_email: string
  organization_id: string
  organization_name: string
}

const columns: ColumnDef<PetitionSignature>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="rounded border-gray-300"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="rounded border-gray-300"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
      />
    ),
  },
  {
    accessorKey: "petitioner_name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.getValue("petitioner_name")}</div>
        <div className="text-gray-500">{row.original.petitioner_email}</div>
      </div>
    ),
  },
  {
    accessorKey: "organization_name",
    header: "Organization",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.getValue("organization_name")}</div>
        <div className="text-gray-500">ID: {row.original.organization_id}</div>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-gray-900">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )
    },
  },
]

export default function Petitions() {
  const router = useRouter()
  const [signatures, setSignatures] = useState<PetitionSignature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadSignatures()
  }, [])

  async function loadSignatures() {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('petition_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSignatures(data || [])
    } catch (error) {
      logger.error('Error loading signatures:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSignatures = signatures.filter(sig => 
    (sig.petitioner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sig.petitioner_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sig.organization_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className={`${oswald.className} text-2xl font-bold text-gray-900 uppercase`}>
            Petition Signatures ({signatures.length})
          </h1>
          <p className="mt-1 text-sm text-gray-600">View and manage petition signatures</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-[300px]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredSignatures}
        />
      )}
    </div>
  )
} 