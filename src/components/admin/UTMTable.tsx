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
import { ChevronLeft, ChevronRight, Trash2, X, Copy } from "lucide-react"
import { type UTMLink } from '@/types'
import { toast } from "react-hot-toast"
import { useState } from "react"

interface UTMTableProps {
  data: UTMLink[]
  onDelete: (id: string) => void
}

export function UTMTable({ data, onDelete }: UTMTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard!')
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this UTM link?')) {
      onDelete(id)
    }
  }

  const columns: ColumnDef<UTMLink>[] = [
    {
      accessorKey: "volunteer_name",
      header: "Volunteer",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px]">
          {row.getValue("volunteer_name")}
        </div>
      ),
    },
    {
      accessorKey: "utm_campaign",
      header: "Campaign",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]">
          {row.getValue("utm_campaign")}
        </div>
      ),
    },
    {
      accessorKey: "full_url",
      header: "URL",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">
          {row.getValue("full_url")}
        </div>
      ),
    },
    {
      accessorKey: "click_count",
      header: "Clicks",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("click_count")}
        </div>
      ),
    },
    {
      accessorKey: "conversion_count",
      header: "Conversions",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("conversion_count")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <div>
          {new Date(row.getValue("created_at")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <AdminButton
            onClick={() => copyToClipboard(row.original.full_url)}
            variant="secondary"
            size="sm"
            className="mr-2"
          >
            <Copy className="h-4 w-4" />
          </AdminButton>
          <AdminButton
            onClick={() => setDeleteConfirmId(row.original.id)}
            variant="secondary"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
          </AdminButton>
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
        <div>
          <table className="w-full divide-y divide-gray-200">
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
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
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

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
              <AdminButton
                onClick={() => setDeleteConfirmId(null)}
                variant="secondary"
                size="sm"
                className="mr-2"
              >
                <X className="h-4 w-4" />
              </AdminButton>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this UTM link? This action cannot be undone.
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