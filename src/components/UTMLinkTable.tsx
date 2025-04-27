import { UTMLink } from '@/types'

interface UTMLinkTableProps {
  utmLinks: UTMLink[]
}

export function UTMLinkTable({ utmLinks }: UTMLinkTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medium
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Campaign
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {utmLinks.map((link) => (
            <tr key={link.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {link.full_url}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {link.utm_source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {link.utm_medium}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {link.utm_campaign}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {link.click_count}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {link.conversion_count}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(link.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 