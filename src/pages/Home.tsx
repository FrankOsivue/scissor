import { useState } from 'react'
import { Type, QrCode as QrIcon, BarChart3, Clock } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api' // Adjust path if necessary

import UrlInputForm from '../components/features/UrlInputForm'
import ShortenedResult from '../components/features/ShortenedResult'
import QrCodeGenerator from '../components/features/QrCodeGenerator'

export default function Home() {
  // 1. Initialize the Convex Database Mutation
  const createShortLink = useMutation(api.links.createShortLink)

  // 2. UI State Management
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeLinkData, setActiveLinkData] = useState<{
    longUrl: string
    shortUrl: string
  } | null>(null)

  // 3. The Live Database Handler
  const handleFormSubmit = async (data: {
    longUrl: string
    customSlug: string
    expiryDate: string
  }) => {
    setIsLoading(true)
    setErrorMessage('')
    setActiveLinkData(null) // Clear previous results while loading

    try {
      // Fire the payload to the Convex cloud
      const resultSlug = await createShortLink({
        longUrl: data.longUrl,
        customSlug: data.customSlug.trim() !== '' ? data.customSlug : undefined,
      })

      // Get the current website URL dynamically
      const currentDomain = window.location.origin

      // Update the UI with the real generated link
      setActiveLinkData({
        longUrl: data.longUrl,
        shortUrl: `${currentDomain}/${resultSlug}`,
      })
    } catch (err: any) {
      // Catch the "slug is already taken" error from our backend
      setErrorMessage(
        err.message || 'An error occurred while shortening the link.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className='flex-grow flex flex-col items-center px-4 md:px-8 py-12 max-w-6xl mx-auto w-full'>
        {/* Hero Section */}
        <div className='text-center mb-12 max-w-2xl pt-4'>
          <h1 className='font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight'>
            Shorten your links, Share anywhere.
          </h1>
          <p className='text-lg text-gray-500'>
            Transform long URLs into clean, branded assets. Track performance
            and optimize your reach instantly.
          </p>
        </div>

        {/* Error Display (Renders just above the form if a custom slug is taken) */}
        {errorMessage && (
          <div className='w-full max-w-3xl mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center font-medium animate-fade-in-up'>
            {errorMessage}
          </div>
        )}

        {/* Core Form Component */}
        <div className='w-full max-w-3xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 transition-shadow hover:shadow-md duration-300 mb-12'>
          <UrlInputForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            slugAvailable={null}
          />
        </div>

        {/* Result Section - Only renders if data exists */}
        {activeLinkData && (
          <div className='w-full max-w-3xl mb-12 animate-fade-in-up'>
            <h3 className='font-display text-xl font-semibold text-gray-900 mb-2'>
              Your Shortened Link
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='md:col-span-2'>
                <ShortenedResult urlData={activeLinkData} />
              </div>
              <div>
                <QrCodeGenerator url={activeLinkData.shortUrl} />
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <section
          id='features'
          className='w-full pt-12 pb-12'
        >
          <div className='text-center mb-12'>
            <h2 className='font-display text-3xl font-bold text-gray-900 mb-2'>
              Powerful Features
            </h2>
            <p className='text-gray-500'>
              Everything you need to manage your links effectively.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <FeatureCard
              icon={<Type className='w-6 h-6' />}
              title='Custom Slugs'
              desc='Tailor your links for branding and memorability.'
            />
            <FeatureCard
              icon={<QrIcon className='w-6 h-6' />}
              title='QR Codes'
              desc='Generate and customize branded QR codes for offline reach.'
            />
            <FeatureCard
              icon={<BarChart3 className='w-6 h-6' />}
              title='Advanced Analytics'
              desc='Track performance and gain deep audience insights.'
            />
            <FeatureCard
              icon={<Clock className='w-6 h-6' />}
              title='Link Expiry'
              desc='Set time-based access for your links to maintain security.'
            />
          </div>
        </section>
      </main>
    </>
  )
}

// Small helper component to keep the features grid clean
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
      <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4'>
        {icon}
      </div>
      <h4 className='font-display text-lg font-semibold text-gray-900 mb-2'>
        {title}
      </h4>
      <p className='text-sm text-gray-500'>{desc}</p>
    </div>
  )
}
