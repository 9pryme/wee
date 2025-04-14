'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Actions } from '@/components/admin/Actions'
import { BankEmailModal } from '@/components/admin/BankEmailModal'
import { DashboardChart } from '@/components/admin/DashboardChart'
import { DashboardSkeleton } from '@/components/admin/DashboardSkeleton'
import { Oswald } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'] })

interface Stats {
  totalPetitions: number
  totalBanks: number
  totalOrganizations: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPetitions: 0,
    totalBanks: 0,
    totalOrganizations: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const [
        { count: petitionCount },
        { count: organizationsCount },
        { count: banksCount }
      ] = await Promise.all([
        supabase.from('petition_submissions').select('*', { count: 'exact' }),
        supabase.from('organizations').select('*', { count: 'exact' }),
        supabase.from('banks').select('*', { count: 'exact' })
      ])

      setStats({
        totalPetitions: petitionCount || 0,
        totalBanks: banksCount || 0,
        totalOrganizations: organizationsCount || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <BankEmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
      
      <div className="space-y-8">
        <div>
          <h1 className={`${oswald.className} text-2xl font-bold text-gray-900 uppercase tracking-tight`}>
            Welcome to Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage banks and their email addresses for petitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Petitions" value={stats.totalPetitions} />
          <StatCard title="Total Banks" value={stats.totalBanks} />
          <StatCard title="Organizations/Individuals" value={stats.totalOrganizations} />
        </div>

        <Actions onUpdateEmail={() => setIsEmailModalOpen(true)} />

        <div className="mt-8">
          <DashboardChart />
        </div>
      </div>
    </>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className={`${oswald.className} text-gray-500 text-sm font-medium`}>{title}</h3>
      <p className={`${oswald.className} mt-2 text-3xl font-bold`}>{value}</p>
    </div>
  )
}