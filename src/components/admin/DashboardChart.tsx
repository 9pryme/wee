'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

type DateRange = '7d' | '1m' | '3m' | '6m' | '1y'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    fill: boolean
    borderColor: string
    backgroundColor: string
    tension: number
  }[]
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>
      
      {/* Chart skeleton */}
      <div className="space-y-3">
        {/* Y-axis ticks */}
        <div className="flex items-center">
          <div className="w-10 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardChart() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Daily Petitions',
      data: [],
      fill: true,
      borderColor: '#64748b',
      backgroundColor: 'rgba(100, 116, 139, 0.1)',
      tension: 0.4
    }]
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('7d')

  const getDaysInRange = (range: DateRange) => {
    switch (range) {
      case '7d': return 7
      case '1m': return 30
      case '3m': return 90
      case '6m': return 180
      case '1y': return 365
      default: return 7
    }
  }

  const loadChartData = useCallback(async (range: DateRange) => {
    try {
      setIsLoading(true)
      const daysToShow = getDaysInRange(range)
      
      const { data: petitions } = await supabase
        .from('petition_submissions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - daysToShow * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at')

      const dates = Array.from({ length: daysToShow }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (daysToShow - 1 - i))
        return date.toISOString().split('T')[0]
      })

      const dailyCounts = dates.map(date => {
        return petitions?.filter(p => 
          p.created_at.startsWith(date)
        ).length || 0
      })

      const formatDate = (date: string) => {
        const d = new Date(date)
        if (range === '7d') {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } else {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
      }

      setChartData({
        labels: dates.map(formatDate),
        datasets: [{
          label: 'Petitions',
          data: dailyCounts,
          fill: true,
          borderColor: '#64748b',
          backgroundColor: 'rgba(100, 116, 139, 0.1)',
          tension: 0.4
        }]
      })
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChartData(dateRange)
  }, [dateRange, loadChartData])

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false // Removed title from chart options since we're showing it separately
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
        <ChartSkeleton />
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Petition Submissions</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>
      <Line options={options} data={chartData} height={80} />
    </div>
  )
} 