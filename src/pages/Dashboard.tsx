import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  Copy,
  CheckCircle2,
  QrCode as QrIcon,
  ExternalLink,
  BarChart2,
} from 'lucide-react'

export default function Dashboard() {
  // Fetch the data from your new Convex query
  const links = useQuery(api.links.getUserLinks)

  // State to manage the "Copied!" checkmark animation
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Helper function to copy the link to the user's clipboard
  const handleCopy = (shortCode: string, id: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000) // Reset after 2 seconds
  }

  // 1. Loading State
  if (links === undefined) {
    return (
      <div className='flex flex-grow items-center justify-center p-12'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600' />
      </div>
    )
  }

  // 2. Empty State (If they haven't created any links yet)
  if (links.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-12 mt-10 text-center animate-fade-in-up'>
        <div className='bg-blue-50 p-4 rounded-full mb-4'>
          <BarChart2 className='w-8 h-8 text-blue-600' />
        </div>
        <h2 className='text-2xl font-display font-bold text-gray-900 mb-2'>
          No links yet
        </h2>
        <p className='text-gray-500 mb-6'>
          Create your first shortened link on the home page to see your
          analytics here.
        </p>
        <a
          href='/'
          className='bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors'
        >
          Create a Link
        </a>
      </div>
    )
  }

  // 3. The Data Table
  return (
    <div className='max-w-5xl mx-auto w-full p-6 md:p-8 animate-fade-in-up'>
      <div className='flex justify-between items-end mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-gray-900 mb-2'>
            Link Management
          </h1>
          <p className='text-gray-500'>View and manage your shortened URLs.</p>
        </div>
        <div className='bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm border border-blue-100'>
          Total Links: {links.length}
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider'>
                <th className='p-4 font-semibold'>Original URL</th>
                <th className='p-4 font-semibold'>Short Link</th>
                <th className='p-4 font-semibold text-center'>Clicks</th>
                <th className='p-4 font-semibold text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {links.map((link) => (
                <tr
                  key={link._id}
                  className='hover:bg-gray-50 transition-colors group'
                >
                  {/* Long URL Column */}
                  <td className='p-4 max-w-xs truncate text-gray-600 text-sm'>
                    <a
                      href={link.longUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-blue-600 flex items-center gap-1'
                    >
                      {link.longUrl}
                    </a>
                  </td>

                  {/* Short Link Column */}
                  <td className='p-4'>
                    <a
                      href={`/${link.shortCode}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1 w-fit'
                    >
                      /{link.shortCode}
                      <ExternalLink className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </a>
                  </td>

                  {/* Clicks Column */}
                  <td className='p-4 text-center'>
                    <span className='inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium'>
                      {link.clicks}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className='p-4 flex items-center justify-end gap-2'>
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(link.shortCode, link._id)}
                      className='p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
                      title='Copy to clipboard'
                    >
                      {copiedId === link._id ? (
                        <CheckCircle2 className='w-5 h-5 text-emerald-500' />
                      ) : (
                        <Copy className='w-5 h-5' />
                      )}
                    </button>

                    {/* QR Code Button */}
                    <button
                      className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
                      title='Generate QR Code'
                    >
                      <QrIcon className='w-5 h-5' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
