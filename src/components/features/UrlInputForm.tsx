import { useState } from 'react'
import {
  Link as LinkIcon,
  Scissors,
  Settings2,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface FormData {
  longUrl: string
  customSlug: string
  expiryDate: string
}

interface UrlInputFormProps {
  onSubmit: (data: FormData) => void
  isLoading?: boolean
  slugAvailable?: boolean | null // null = idle/typing, true = available, false = taken
}

export default function UrlInputForm({
  onSubmit,
  isLoading = false,
  slugAvailable = null,
}: UrlInputFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [longUrl, setLongUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (longUrl.trim()) {
      onSubmit({ longUrl, customSlug, expiryDate })
    }
  }

  return (
    <form
      className='flex flex-col gap-4 w-full'
      onSubmit={handleSubmit}
    >
      <div className='relative flex items-center'>
        <LinkIcon className='absolute left-4 w-5 h-5 text-gray-400 pointer-events-none' />
        <input
          type='url'
          required
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder='Paste your long URL here...'
          className='w-full pl-12 pr-32 py-4 bg-gray-50 rounded-xl border border-gray-200 text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all duration-150 placeholder:text-gray-400'
          disabled={isLoading}
        />
        <button
          type='submit'
          disabled={isLoading}
          className='absolute right-2 bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-150 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Processing...' : 'Shorten'}
          {!isLoading && <Scissors className='w-4 h-4' />}
        </button>
      </div>

      <button
        type='button'
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className='flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors duration-150 self-start mt-1'
      >
        <Settings2
          className={`w-5 h-5 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`}
        />
        Advanced Options
      </button>

      {isAdvancedOpen && (
        <div className='flex flex-col gap-4 mt-2 pt-4 border-t border-gray-200 animate-fade-in-down'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block font-semibold text-sm text-gray-900 mb-1'>
                Custom Slug (Optional)
              </label>
              <div className='relative flex items-center'>
                <span className='absolute left-3 text-gray-500 text-sm select-none'>
                  scissor.ly/
                </span>
                <input
                  type='text'
                  value={customSlug}
                  onChange={(e) =>
                    setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))
                  } // Enforces alphanumeric + hyphens
                  maxLength={50}
                  placeholder='my-custom-link'
                  className='w-full pl-24 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all'
                />
                {slugAvailable === true && (
                  <CheckCircle2 className='absolute right-3 w-5 h-5 text-emerald-600' />
                )}
                {slugAvailable === false && (
                  <XCircle className='absolute right-3 w-5 h-5 text-rose-600' />
                )}
              </div>
            </div>

            <div>
              <label className='block font-semibold text-sm text-gray-900 mb-1'>
                Expiry Date (Optional)
              </label>
              <div className='relative flex items-center'>
                <Calendar className='absolute left-3 w-5 h-5 text-gray-400 pointer-events-none' />
                <input
                  type='date'
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className='w-full pl-10 pr-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all'
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
