'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AdminButton } from '@/components/admin/AdminButton'
import { UTMTable } from '@/components/admin/UTMTable'
import { UTMForm } from '@/components/admin/UTMForm'
import { Plus, X, ChevronLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { UTMLink } from '@/types'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Analytics {
  totalLinks: number
  totalClicks: number
  totalConversions: number
  conversionRate: number
}

export default function UTMPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [links, setLinks] = useState<UTMLink[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    totalLinks: 0,
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0
  })
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<Array<{
    date: string
    clicks: number
    conversions: number
  }>>([])

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('utm_links')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setLinks(data || [])
      
      // Calculate analytics
      const totalClicks = data?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0
      const totalConversions = data?.reduce((sum, link) => sum + (link.conversion_count || 0), 0) || 0
      
      setAnalytics({
        totalLinks: data?.length || 0,
        totalClicks,
        totalConversions,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
      })

      // Prepare chart data
      const chartData = data?.reduce((acc: Array<{
        date: string
        clicks: number
        conversions: number
      }>, link) => {
        const date = new Date(link.created_at).toLocaleDateString()
        const existingDate = acc.find(item => item.date === date)
        
        if (existingDate) {
          existingDate.clicks += link.click_count || 0
          existingDate.conversions += link.conversion_count || 0
        } else {
          acc.push({
            date,
            clicks: link.click_count || 0,
            conversions: link.conversion_count || 0
          })
        }
        
        return acc
      }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []

      setChartData(chartData)
    } catch (error) {
      console.error('Error fetching UTM links:', error)
      toast.error('Failed to load UTM links')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('utm_links')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('UTM link deleted successfully')
      fetchLinks()
    } catch (error) {
      console.error('Error deleting UTM link:', error)
      toast.error('Failed to delete UTM link')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Analytics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[600px]">
          <div className="p-4">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 mb-4">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-900">UTM Links</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your UTM tracking links</p>
        </div>
        <AdminButton
          onClick={() => setIsCreating(true)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create UTM Link</span>
        </AdminButton>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Links</h3>
          <p className="text-2xl font-bold">{analytics.totalLinks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
          <p className="text-2xl font-bold">{analytics.totalClicks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Conversions</h3>
          <p className="text-2xl font-bold">{analytics.totalConversions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
                name="Clicks"
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                name="Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* UTM Table */}
      {links.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[600px]">
          <UTMTable data={links} onDelete={handleDelete} />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-50 rounded-full p-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No UTM links found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first UTM tracking link to monitor campaign performance.</p>
            <AdminButton
              onClick={() => setIsCreating(true)}
              variant="primary"
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create UTM Link</span>
            </AdminButton>
          </div>
        </div>
      )}

      {/* Create Link Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create UTM Link</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <UTMForm
              mode="create"
              onSuccess={() => {
                setIsCreating(false)
                fetchLinks()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
} 