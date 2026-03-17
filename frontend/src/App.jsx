import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'

import Layout from './components/layout/Layout'
import Onboarding from './pages/Onboarding'
import Newsfeed from './pages/Newsfeed'
import Profile from './pages/Profile'
import FriendsPage from './pages/FriendsPage'
import LiveSyncRoom from './pages/LiveSyncRoom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

// Pages placeholder
const Discovery = () => <div>Discovery Page</div>
const NotFound = () => <div className="min-h-screen grid flex-col items-center justify-center">404 Not Found</div>

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Main App Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/feed" element={<Newsfeed />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id/friends" element={<FriendsPage />} />
              <Route path="/room/:id" element={<LiveSyncRoom />} />
              <Route path="/chat" element={<Chat />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
