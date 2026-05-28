import { Link } from 'react-router-dom'
import { Clock, Scissors, ArrowLeft } from 'lucide-react'

export default function Expired() {
  return (
    <div className='bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center'>
        <div className='w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6'>
          <Clock className='w-8 h-8' />
        </div>

        <h1 className='font-display text-3xl font-bold text-gray-900 mb-3'>
          This link has expired.
        </h1>
        <p className='text-gray-500 mb-8'>
          The creator of this link set an expiration date, and it is no longer
          active.
        </p>

        <div className='pt-6 border-t border-gray-100 flex flex-col gap-3'>
          <Link
            to='/'
            className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
          >
            Create your own links <Scissors className='w-4 h-4' />
          </Link>
          <button
            onClick={() => window.history.back()}
            className='w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' /> Go back
          </button>
        </div>
      </div>
    </div>
  )
}
