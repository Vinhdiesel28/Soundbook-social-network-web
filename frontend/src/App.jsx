import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Layout from './components/layout/Layout'
import Onboarding from './pages/Onboarding'
import Newsfeed from './pages/Newsfeed'
import Profile from './pages/Profile'
import FriendsPage from './pages/FriendsPage'
import LiveSyncRoom from './pages/LiveSyncRoom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

const Discovery = () => <div>Discovery Page</div>
const NotFound = () => <div className="min-h-screen grid flex-col items-center justify-center">404 Not Found</div>

function App() {
  // THAY MÃ NÀY BẰNG CLIENT ID THẬT CỦA BẠN
  const GOOGLE_CLIENT_ID = "264640047149-qrrlqpraqqsoj9tijuk55tndve952opu.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Main App Routes (Các trang có Sidebar/Header) */}
              <Route element={<Layout />}>
                {/* Khi vào trang chủ "/" sẽ tự động đá sang "/login" nếu chưa login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Route đã được đổi thành /feed như bạn muốn */}
                <Route path="/feed" element={<Newsfeed />} />

                <Route path="/discovery" element={<Discovery />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/profile/:id/friends" element={<FriendsPage />} />
                <Route path="/room/:id" element={<LiveSyncRoom />} />
                <Route path="/chat" element={<Chat />} />
              </Route>

              {/* Trang lỗi 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App