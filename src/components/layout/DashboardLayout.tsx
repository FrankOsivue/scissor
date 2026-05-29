import { useEffect, useState } from 'react'
import { useConvexAuth, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Navigate, Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const storeUser = useMutation(api.users.storeUser)
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    // Only trigger the Convex database mutation if Clerk has successfully authenticated the user
    if (isAuthenticated) {
      storeUser()
        .then(() => setIsSynced(true))
        .catch((err) =>
          console.error('Error syncing user session to database:', err),
        )
    }
  }, [isAuthenticated, storeUser])

  // Handle initial authorization loading states gracefully
  if (isLoading) {
    return (
      <div className='flex flex-grow items-center justify-center bg-gray-50 text-gray-900'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-zinc-900' />
      </div>
    )
  }

  // Force unauthorized visitors back to the authentication screen
  if (!isAuthenticated) {
    return (
      <Navigate
        to='/sign-in'
        replace
      />
    )
  }

  // Guard the dashboard views until the database confirms the user profile is written
  if (!isSynced) {
    return (
      <div className='flex flex-grow items-center justify-center bg-gray-50 text-gray-600'>
        <p className='text-sm font-medium tracking-wide animate-pulse'>
          Setting up your secure workspace...
        </p>
      </div>
    )
  }

  // Render child components via the router context
  return <Outlet />
}
