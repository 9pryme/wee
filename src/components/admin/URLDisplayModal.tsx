import { useState } from 'react'

interface URLDisplayModalProps {
  isOpen: boolean
  onClose: () => void
  trackingUrl: string
  fullUrl: string
}

export function URLDisplayModal({ isOpen, onClose, trackingUrl, fullUrl }: URLDisplayModalProps) {
  const [copied, setCopied] = useState('')

  if (!isOpen) return null

  const copyToClipboard = async (text: string, type: 'tracking' | 'full') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      alert('Failed to copy to clipboard')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Generated URLs</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tracking URL</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                readOnly
                value={trackingUrl}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300"
              />
              <button
                onClick={() => copyToClipboard(trackingUrl, 'tracking')}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {copied === 'tracking' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full URL</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300"
              />
              <button
                onClick={() => copyToClipboard(fullUrl, 'full')}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {copied === 'full' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 