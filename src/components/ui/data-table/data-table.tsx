"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { AdminButton } from "@/components/admin/AdminButton"

// Define the data structure
interface PetitionData {
  name: string
  email: string
  bank_name: string
  bank_code: string
  created_at: string
}

interface DataTableProps<TData extends PetitionData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends PetitionData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    pageCount: Math.ceil(data.length / 10), // 10 items per page
  })

  return (
    <div className="w-full h-[calc(100vh-12rem)] flex flex-col border border-gray-200 rounded-md">
      <div className="grid grid-cols-[80px_1fr_1fr_160px] bg-gray-50 border-b border-gray-200">
        <div className="px-6 py-3">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          />
        </div>
        <div className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </div>
        <div className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Bank
        </div>
        <div className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Date
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div 
              key={row.id}
              className="grid grid-cols-[80px_1fr_1fr_160px] border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="px-6 py-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={row.getIsSelected()}
                  onChange={(e) => row.toggleSelected(!!e.target.checked)}
                />
              </div>
              <div className="px-6 py-4">
                <div className="font-medium text-gray-900">{row.getValue("name")}</div>
                <div className="text-sm text-gray-500">{row.original.email}</div>
              </div>
              <div className="px-6 py-4">
                <div className="font-medium text-gray-900">{row.getValue("bank_name")}</div>
                <div className="text-sm text-gray-500">Code: {row.original.bank_code}</div>
              </div>
              <div className="px-6 py-4 text-sm text-gray-900">
                {new Date(row.getValue("created_at")).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-sm text-gray-500">
            No results.
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex-1 text-sm text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
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
    </div>
  )
} 