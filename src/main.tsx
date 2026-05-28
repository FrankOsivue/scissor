import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file',
  )
}
if (!CONVEX_URL) {
  throw new Error(
    'Missing Convex URL. Make sure npx convex dev generated it in .env.local',
  )
}

// Initialize the Convex Client
const convex = new ConvexReactClient(CONVEX_URL)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* This wrapper tells Convex to use Clerk for identity verification */}
      <ConvexProviderWithClerk
        client={convex}
        useAuth={useAuth}
      >
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)
