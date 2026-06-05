import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AnalyticsOverview from '../components/features/AnalyticsOverview'

export default function Analytics() {
  return (
    <div className='max-w-5xl mx-auto w-full p-6 md:p-8 animate-fade-in-up'>
      {/* Header with Back Button */}
      <div className='flex items-center gap-4 mb-8'>
        <Link
          to='/dashboard'
          className='p-2 bg-white text-gray-500 hover:text-gray-900 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all'
        >
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <h1 className='text-3xl font-display font-bold text-gray-900 mb-1'>
            Link Analytics
          </h1>
          <p className='text-gray-500'>
            Dive deep into your traffic and audience insights.
          </p>
        </div>
      </div>

      <AnalyticsOverview />
    </div>
  )
}
