import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Scissors, Menu, X } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Header() {
  // State to manage the mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

        {/* Desktop Navigation (Hidden on mobile) */}
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

          {/* Mobile Menu Toggle Button (Hidden on desktop) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 focus:outline-none transition-colors'
            aria-label='Toggle mobile menu'
          >
            {isMobileMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl animate-fade-in-down'>
          <div className='px-4 pt-2 pb-4 space-y-1'>
            <a
              href='/#features'
              onClick={() => setIsMobileMenuOpen(false)}
              className='block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors'
            >
              Features
            </a>

            <SignedIn>
              <Link
                to='/dashboard'
                onClick={() => setIsMobileMenuOpen(false)}
                className='block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors'
              >
                Dashboard
              </Link>
            </SignedIn>

            <SignedOut>
              <Link
                to='/sign-in'
                onClick={() => setIsMobileMenuOpen(false)}
                className='block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors'
              >
                Log In
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  )
}
