import { useState } from 'react'
import { Copy } from 'lucide-react'

interface ShortenedResultProps {
  urlData: {
    longUrl: string
    shortUrl: string
  }
}

export default function ShortenedResult({ urlData }: ShortenedResultProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlData.shortUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between h-full'>
      <div>
        <p
          className='text-sm text-gray-500 truncate mb-1'
          title={urlData.longUrl}
        >
          {urlData.longUrl}
        </p>
        <div className='flex items-center justify-between mt-1'>
          <a
            href={`https://${urlData.shortUrl}`}
            target='_blank'
            rel='noopener noreferrer'
            className='font-display text-xl font-semibold text-blue-600 hover:underline truncate mr-4'
          >
            {urlData.shortUrl}
          </a>
          <div className='relative'>
            <button
              onClick={handleCopy}
              className='p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group'
              aria-label='Copy to clipboard'
            >
              <Copy className='w-5 h-5' />
            </button>
            {isCopied && (
              <div className='absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded transition-opacity whitespace-nowrap z-10'>
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='mt-4 pt-2 border-t border-gray-100 flex gap-2'>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200'>
          <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5'></span>
          Active
        </span>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200'>
          Clicks: 0
        </span>
      </div>
    </div>
  )
}
