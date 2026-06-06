import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Link } from 'react-router-dom'

import {
  Copy,
  CheckCircle2,
  QrCode as QrIcon,
  ExternalLink,
  BarChart2,
  X,
  Trash2,
} from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

import QrCodeGenerator from '../components/features/QrCodeGenerator'

export default function Dashboard() {
  // Database integrations
  const links = useQuery(api.links.getUserLinks)
  const deleteLink = useMutation(api.links.deleteLink)

  // Local state management
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeQrData, setActiveQrData] = useState<{
    shortCode: string
    fullUrl: string
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Clipboard handler
  const handleCopy = (shortCode: string, id: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Deletion handler
  const handleDelete = async (id: Id<'links'>) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this link? This action cannot be undone and will erase all click analytics.',
    )

    if (confirmed) {
      setIsDeleting(id)
      try {
        await deleteLink({ id })
      } catch (error) {
        console.error('Failed to delete link:', error)
        alert('There was an error deleting your link.')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  // Render loading state
  if (links === undefined) {
    return (
      <div className='flex flex-grow items-center justify-center p-12'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600' />
      </div>
    )
  }

  // Render empty state
  if (links.length === 0) {
    return (
      <div className='max-w-5xl mx-auto w-full p-4 md:p-8 animate-fade-in-up'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8'>
          <div>
            <h1 className='text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2'>
              Link Management
            </h1>
            <p className='text-sm md:text-base text-gray-500'>
              View and manage your shortened URLs.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-3 md:gap-4'>
            <div className='bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm border border-blue-100'>
              Total Links: {links.length}
            </div>

            <Link
              to='/dashboard/analytics'
              className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm'
            >
              <BarChart2 className='w-4 h-4' />
              View Analytics
            </Link>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center p-12 mt-10 text-center bg-white rounded-xl shadow-sm border border-gray-200'>
          <div className='bg-blue-50 p-4 rounded-full mb-4'>
            <BarChart2 className='w-8 h-8 text-blue-600' />
          </div>
          <h2 className='text-xl md:text-2xl font-display font-bold text-gray-900 mb-2'>
            No links yet
          </h2>
          <p className='text-sm md:text-base text-gray-500 mb-6 max-w-md'>
            Create your first shortened link on the home page to see your
            analytics here.
          </p>
          <Link
            to='/'
            className='bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors'
          >
            Create a Link
          </Link>
        </div>
      </div>
    )
  }

  // Render populated state
  return (
    <div className='max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-8 animate-fade-in-up'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8'>
        <div>
          <h1 className='text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2'>
            Link Management
          </h1>
          <p className='text-sm md:text-base text-gray-500'>
            View and manage your shortened URLs.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3 md:gap-4'>
          <div className='bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm border border-blue-100'>
            Total Links: {links.length}
          </div>

          <Link
            to='/dashboard/analytics'
            className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm'
          >
            <BarChart2 className='w-4 h-4' />
            View Analytics
          </Link>
        </div>
      </div>

      {/* Mobile View: Card Layout */}
      <div className='md:hidden flex flex-col gap-4'>
        {links.map((link) => (
          <div
            key={link._id}
            className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4'
          >
            <div className='flex justify-between items-start gap-2'>
              <div className='flex-1 min-w-0'>
                <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1'>
                  Original URL
                </span>
                <a
                  href={link.longUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-gray-600 hover:text-blue-600 truncate block'
                >
                  {link.longUrl}
                </a>
              </div>
              <div className='bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium text-gray-800 whitespace-nowrap'>
                {link.clicks} Clicks
              </div>
            </div>

            <div>
              <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1'>
                Short Link
              </span>
              <a
                href={`/${link.shortCode}`}
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1 w-fit text-sm'
              >
                /{link.shortCode}
                <ExternalLink className='w-3 h-3' />
              </a>
            </div>

            <div className='flex items-center justify-end gap-2 pt-3 border-t border-gray-100'>
              <button
                onClick={() => handleCopy(link.shortCode, link._id)}
                className='p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
                title='Copy to clipboard'
              >
                {copiedId === link._id ? (
                  <CheckCircle2 className='w-5 h-5 text-emerald-500' />
                ) : (
                  <Copy className='w-5 h-5' />
                )}
              </button>

              <button
                onClick={() =>
                  setActiveQrData({
                    shortCode: link.shortCode,
                    fullUrl: `${window.location.origin}/${link.shortCode}`,
                  })
                }
                className='p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
                title='Generate QR Code'
              >
                <QrIcon className='w-5 h-5' />
              </button>

              <button
                onClick={() => handleDelete(link._id)}
                disabled={isDeleting === link._id}
                className='p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50'
                title='Delete Link'
              >
                <Trash2 className='w-5 h-5' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Data Table */}
      <div className='hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative'>
        <div className='overflow-x-auto w-full'>
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
                  <td className='p-4 max-w-xs truncate text-gray-600 text-sm'>
                    <a
                      href={link.longUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-blue-600 flex items-center gap-1'
                      title={link.longUrl}
                    >
                      {link.longUrl}
                    </a>
                  </td>
                  <td className='p-4'>
                    <a
                      href={`/${link.shortCode}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1 w-fit text-sm'
                    >
                      /{link.shortCode}
                      <ExternalLink className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </a>
                  </td>
                  <td className='p-4 text-center'>
                    <span className='inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium'>
                      {link.clicks}
                    </span>
                  </td>
                  <td className='p-4 flex items-center justify-end gap-2'>
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

                    <button
                      onClick={() =>
                        setActiveQrData({
                          shortCode: link.shortCode,
                          fullUrl: `${window.location.origin}/${link.shortCode}`,
                        })
                      }
                      className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
                      title='Generate QR Code'
                    >
                      <QrIcon className='w-5 h-5' />
                    </button>

                    <button
                      onClick={() => handleDelete(link._id)}
                      disabled={isDeleting === link._id}
                      className='p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50'
                      title='Delete Link'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal Overlay */}
      {activeQrData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in-up'>
          <div className='bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden relative'>
            <div className='flex items-center justify-between p-4 border-b border-gray-100'>
              <h3 className='font-semibold text-gray-900 truncate pr-4'>
                QR Code: /{activeQrData.shortCode}
              </h3>
              <button
                onClick={() => setActiveQrData(null)}
                className='p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-6 flex justify-center'>
              <QrCodeGenerator url={activeQrData.fullUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
