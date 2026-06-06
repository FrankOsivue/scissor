import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AnalyticsOverview from '../components/features/AnalyticsOverview'

export default function Analytics() {
  return (
    <div className='max-w-5xl mx-auto w-full min-w-0 p-4 sm:p-6 md:p-8 animate-fade-in-up'>
      {/* Header Layout */}
      <div className='flex items-center gap-3 sm:gap-4 mb-6 md:mb-8'>
        <Link
          to='/dashboard'
          className='p-2 bg-white text-gray-500 hover:text-gray-900 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all shrink-0'
        >
          <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
        </Link>

        <div className='min-w-0'>
          <h1 className='text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 truncate'>
            Link Analytics
          </h1>
          <p className='text-sm sm:text-base text-gray-500 truncate'>
            See your links performance and audience insights in one place.
          </p>
        </div>
      </div>

      <AnalyticsOverview />
    </div>
  )
}
