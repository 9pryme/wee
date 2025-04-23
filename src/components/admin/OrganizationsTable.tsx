"use client"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AdminButton } from "@/components/admin/AdminButton"
import { ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react"
import { type AdminOrganization } from '@/services/banks'
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { EditOrganizationModal } from "./EditOrganizationModal"

interface OrganizationsTableProps {
  data: AdminOrganization[]
  onDelete?: (id: string) => void
}

export function OrganizationsTable({ data, onDelete }: OrganizationsTableProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Organization deleted successfully')
      onDelete?.(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting organization:', error)
      toast.error('Failed to delete organization')
    } finally {
      setIsDeleting(null)
      setDeleteConfirmId(null)
    }
  }

  const columns: ColumnDef<AdminOrganization>[] = [
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
      accessorKey: "organization_name",
      header: "Organization Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <div className="capitalize">
            {type.split('_').join(' ')}
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "organizationemail",
      header: "Organization Email",
      cell: ({ row }) => row.getValue("organizationemail") || "—"
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditingId(row.original.id)}
            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
            disabled={isDeleting === row.original.id}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(row.original.id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1"
            disabled={isDeleting === row.original.id}
          >
            {isDeleting === row.original.id ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      )
    }
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <div className="w-full flex flex-col border border-gray-200 rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
          <div className="flex-1 text-sm text-gray-700">
            Showing {table.getRowModel().rows.length} results
          </div>
          <div className="flex items-center gap-1">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </AdminButton>
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </AdminButton>
          </div>
        </div>
      </div>

      <EditOrganizationModal
        organizationId={editingId}
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        onSuccess={() => {
          router.refresh()
        }}
      />

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this organization? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 