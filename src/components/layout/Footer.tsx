export default function Footer() {
  return (
    <footer className='bg-white border-t border-gray-200 mt-auto'>
      <div className='w-full py-12 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4'>
        <div className='flex items-center gap-2'>
          <span className='font-display text-xl font-bold text-gray-900 tracking-tight'>
            Scissor
          </span>
          <span className='text-sm text-gray-500 ml-4'>
            © {new Date().getFullYear()} Mark Francis. All rights reserved.
          </span>
        </div>

        <div className='flex flex-wrap justify-center gap-x-6 gap-y-2'>
          <a
            className='text-gray-500 hover:text-blue-600 transition-colors duration-150 text-sm'
            href='#'
          >
            Privacy Policy
          </a>
          <a
            className='text-gray-500 hover:text-blue-600 transition-colors duration-150 text-sm'
            href='#'
          >
            Terms of Service
          </a>
          <a
            className='text-gray-500 hover:text-blue-600 transition-colors duration-150 text-sm'
            href='#'
          >
            Security
          </a>
          <a
            className='text-gray-500 hover:text-blue-600 transition-colors duration-150 text-sm'
            href='#'
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
