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

  useEffect(() => {
    loadChartData()
  }, [])

  async function loadChartData() {
    try {
      const { data: petitions } = await supabase
        .from('petition_submissions')
        .select('created_at')
        .order('created_at')

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      }).reverse()

      const dailyCounts = last7Days.map(date => {
        return petitions?.filter(p => 
          p.created_at.startsWith(date)
        ).length || 0
      })

      setChartData({
        labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })),
        datasets: [{
          label: 'Daily Petitions',
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
        text: 'Petition Submissions - Last 7 Days',
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
        }
      }
    }
  }

  if (isLoading) return <div>Loading chart...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line options={options} data={chartData} height={80} />
    </div>
  )
} 