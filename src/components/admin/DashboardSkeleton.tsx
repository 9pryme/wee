'use client'

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="mt-2 h-8 w-16 bg-gray-300 rounded"></div>
    </div>
  )
}

function ActionCardSkeleton() {
  return (
    <div className="bg-gray-200 rounded-lg p-6 animate-pulse h-[120px]">
      <div className="space-y-3">
        <div className="h-5 w-36 bg-gray-300 rounded"></div>
        <div className="h-4 w-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-96 bg-gray-200 rounded"></div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Actions Section */}
      <div className="space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCardSkeleton />
          <ActionCardSkeleton />
          <ActionCardSkeleton />
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow min-h-[400px] animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-10 h-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-[1px] flex-1 bg-gray-100"></div>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 w-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 