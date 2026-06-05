import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Expired from './pages/Expired'
import DashboardLayout from './components/layout/DashboardLayout'
import { SignIn, SignUp } from '@clerk/clerk-react'
import Redirector from './pages/Redirector'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'

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
                    forceRedirectUrl='/dashboard'
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
                    forceRedirectUrl='/dashboard'
                  />
                </div>
              }
            />

            {/* Protected Dashboard Architecture */}
            <Route element={<DashboardLayout />}>
              <Route
                path='/dashboard'
                element={<Dashboard />}
              />
              <Route
                path='/dashboard/analytics'
                element={<Analytics />}
              />
            </Route>
            <Route
              path='/:shortCode'
              element={<Redirector />}
            />
          </Routes>
        </main>
        <Footer /> {/* Always on bottom */}
      </div>
    </Router>
  )
}
