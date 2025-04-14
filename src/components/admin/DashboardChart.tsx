'use client'
import { useEffect, useState } from 'react'
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

export function DashboardChart() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Daily Petitions',
      data: [],
      fill: true,
      borderColor: '#ED323D',
      backgroundColor: 'rgba(237, 50, 61, 0.1)',
      tension: 0.4
    }]
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('7d')

  useEffect(() => {
    loadChartData(dateRange)
  }, [dateRange])

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

  async function loadChartData(range: DateRange) {
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
          borderColor: '#ED323D',
          backgroundColor: 'rgba(237, 50, 61, 0.1)',
          tension: 0.4
        }]
      })
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Petition Submissions',
        color: '#111827',
        align: 'start' as const,
        font: {
          size: 16,
          weight: 'bold' as const
        }
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

  if (isLoading) return <div>Loading chart...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {(['7d', '1m', '3m', '6m', '1y'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' :
               range === '1m' ? '1 Month' :
               range === '3m' ? '3 Months' :
               range === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>
      <Line options={options} data={chartData} height={80} />
    </div>
  )
} 