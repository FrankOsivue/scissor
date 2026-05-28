import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Expired from './pages/Expired'

export default function App() {
  return (
    <Router>
      {/* Global Wrapper */}
      <div className='bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col'>
        <Header /> {/* Always on top */}
        <main className='flex-grow flex flex-col w-full'>
          <Routes>
            {/* Public Routes */}
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/expired'
              element={<Expired />}
            />

            {/* Clerk Auth Routes */}
            <Route
              path='/sign-in/*'
              element={
                <div className='flex-grow flex items-center justify-center py-12'>
                  <SignIn
                    routing='path'
                    path='/sign-in'
                    fallbackRedirectUrl='/dashboard'
                  />
                </div>
              }
            />
            <Route
              path='/sign-up/*'
              element={
                <div className='flex-grow flex items-center justify-center py-12'>
                  <SignUp
                    routing='path'
                    path='/sign-up'
                    fallbackRedirectUrl='/dashboard'
                  />
                </div>
              }
            />

            {/* Protected Dashboard Route */}
            <Route
              path='/dashboard'
              element={
                <>
                  <SignedIn>
                    <div className='p-8 text-center mt-12 text-2xl font-bold'>
                      Welcome to your secure Dashboard!
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <Navigate
                      to='/sign-in'
                      replace
                    />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </main>
        <Footer /> {/* Always on bottom */}
      </div>
    </Router>
  )
}
