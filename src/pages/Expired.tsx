import { Link } from 'react-router-dom'
import { Link2Off, Scissors, Info } from 'lucide-react'

export default function Expired() {
  return (
    // flex-grow ensures it perfectly centers between the global Header and Footer
    <div className='flex-grow flex flex-col items-center justify-center px-4 py-12'>
      <div className='w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-12 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner'>
          <Link2Off className='w-8 h-8' />
        </div>

        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight'>
          This link has expired.
        </h1>

        <p className='text-base text-gray-500 mb-8 max-w-sm mx-auto'>
          The link you are looking for is no longer active. Why not create your
          own with Scissor?
        </p>

        <Link
          to='/'
          className='bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto'
        >
          Go to Scissor <Scissors className='w-4 h-4' />
        </Link>

        {/* Technical Error Footer */}
        <div className='mt-10 pt-6 border-t border-gray-100 w-full flex justify-center text-sm text-gray-400'>
          <span className='flex items-center gap-1.5 font-medium'>
            <Info className='w-4 h-4' /> Error 410 Gone
          </span>
        </div>
      </div>
    </div>
  )
}
