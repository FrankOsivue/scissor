import { Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Header() {
  return (
    <nav className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full transition-colors duration-200'>
      <div className='flex justify-between items-center w-full px-4 md:px-8 h-16 max-w-6xl mx-auto'>
        {/* Wrap logo in a Link to always go back home */}
        <Link
          to='/'
          className='flex items-center gap-2'
        >
          <Scissors className='h-8 w-8 text-blue-600' />
          <span className='font-display text-2xl font-bold text-gray-900 tracking-tight'>
            Scissor
          </span>
        </Link>

        <div className='hidden md:flex items-center gap-6'>
          <a
            className='text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold'
            href='/#features'
          >
            Features
          </a>

          {/* Only show Dashboard link if they are logged in */}
          <SignedIn>
            <Link
              className='text-gray-500 hover:text-blue-600 transition-colors text-sm font-semibold'
              to='/dashboard'
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>

        <div className='flex items-center gap-4'>
          {/* Show Log In / Sign Up ONLY when logged out */}
          <SignedOut>
            <Link
              to='/sign-in'
              className='hidden md:block text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity duration-150'
            >
              Log In
            </Link>
            <Link
              to='/sign-up'
              className='bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 active:scale-95'
            >
              Sign Up
            </Link>
          </SignedOut>

          {/* Show the beautiful Clerk profile avatar ONLY when logged in */}
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
