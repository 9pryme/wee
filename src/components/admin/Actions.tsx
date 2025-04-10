'use client'
import { useRouter } from 'next/navigation'
import { Oswald } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'] })

interface ActionCardProps {
  title: string
  description: string
  color: string
  onClick: () => void
}

function ActionCard({ title, description, color, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full text-left`}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </button>
  )
}

interface ActionsProps {
  onUpdateEmail: () => void
}

export function Actions({ onUpdateEmail }: ActionsProps) {
  const router = useRouter()

  const actions = [
    {
      title: 'View Petitions',
      description: 'See all petition signatures and their status',
      color: 'bg-purple-600',
      onClick: () => router.push('/admin/petitions')
    },
    {
      title: 'Agency/Bank/Individual',
      description: 'Update or add new agencies, banks or individuals to receive petitions',
      color: 'bg-emerald-600',
      onClick: () => router.push('/admin/banks')
    },
    {
      title: 'Update Bank Email',
      description: 'Update a bank email in the system',
      color: 'bg-blue-600',
      onClick: onUpdateEmail
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className={`${oswald.className} text-xl font-semibold text-gray-900 uppercase`}>Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  )
} 