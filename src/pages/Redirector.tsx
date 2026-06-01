import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function Redirector() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const getAndTrackClick = useMutation(api.links.getAndTrackClick)
  const [error, setError] = useState(false)

  // 1. tracks already fired the mutation
  const hasTracked = useRef(false)

  useEffect(() => {
    const processRedirect = async () => {
      if (!shortCode) return

      // 2. If tracked this click in Strict Mode, stop immediately.
      if (hasTracked.current) return
      hasTracked.current = true // 3. Mark as tracked before the async call to prevent multiple calls in case of re-renders.

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const deviceType = isMobile ? 'Mobile' : 'Desktop'

      try {
        const longUrl = await getAndTrackClick({
          shortCode: shortCode,
          deviceType: deviceType,
        })

        if (longUrl) {
          const destination = longUrl.startsWith('http')
            ? longUrl
            : `https://${longUrl}`
          window.location.replace(destination)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Redirection error:', err)
        setError(true)
      }
    }

    processRedirect()
  }, [shortCode, getAndTrackClick])

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 text-center px-4'>
        <div>
          <h1 className='text-4xl font-display font-bold text-gray-900 mb-4'>
            Link Not Found
          </h1>
          <p className='text-gray-500 mb-8'>
            This Scissor link doesn't exist or has expired.
          </p>
          <a
            href='/'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Go back home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600' />
    </div>
  )
}
