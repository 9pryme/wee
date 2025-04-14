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
      className={`${color} p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 w-full text-left relative overflow-hidden before:absolute before:inset-0 before:bg-black/0 hover:before:bg-black/10 before:transition-colors`}
    >
      <div className="relative z-10">
        <h3 className={`${oswald.className} text-lg font-semibold text-white mb-2 drop-shadow-md`}>{title}</h3>
        <p className="text-white/80 text-sm drop-shadow">{description}</p>
      </div>
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
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  )
} 