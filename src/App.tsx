import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page */}
        <Route
          path='/'
          element={<Home />}
        />

        {/* We will build these out in the next phases */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/sign-in" element={<SignIn />} /> */}
        {/* <Route path="/sign-up" element={<SignUp />} /> */}
      </Routes>
    </Router>
  )
}

export default App
