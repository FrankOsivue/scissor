import { useState } from 'react'
import { Copy, CheckCircle2 } from 'lucide-react'

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
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col justify-center h-full min-w-0'>
      <div className='min-w-0'>
        <p
          className='text-xs sm:text-sm text-gray-500 truncate mb-2'
          title={urlData.longUrl}
        >
          {urlData.longUrl}
        </p>

        <div className='flex items-center justify-between gap-3 min-w-0'>
          <a
            href={`https://${urlData.shortUrl}`}
            target='_blank'
            rel='noopener noreferrer'
            className='font-display text-lg sm:text-xl font-semibold text-blue-600 hover:underline truncate min-w-0'
          >
            {urlData.shortUrl}
          </a>

          {/* Action Button: shrink-0 prevents the button from being crushed by long URLs */}
          <div className='relative shrink-0'>
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label='Copy to clipboard'
            >
              {isCopied ? (
                <CheckCircle2 className='w-4 h-4 sm:w-5 sm:h-5' />
              ) : (
                <Copy className='w-4 h-4 sm:w-5 sm:h-5' />
              )}
            </button>

            {isCopied && (
              <div className='absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs sm:text-sm px-2.5 py-1 rounded shadow-md transition-opacity whitespace-nowrap z-10'>
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
