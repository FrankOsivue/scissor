export default function Footer() {
  return (
    <footer className='bg-white border-t border-gray-200 mt-auto'>
      <div className='w-full py-6 md:py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4'>
        <div className='flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center'>
          <span className='font-display text-xl font-bold text-gray-900 tracking-tight'>
            Scissor
          </span>

          <span className='text-sm text-gray-500'>
            © {new Date().getFullYear()} Mark Francis. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
