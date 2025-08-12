
import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { EnhancedAuthContext } from './context/EnhancedAuthContext'
import { SidebarContext } from './context/SidebarContext'
import { useContext } from 'react'


// Lazy load all pages
const HomePage = lazy(() => import('./pages/HomePage'))
const VideoPage = lazy(() => import('./pages/VideoPage'))
const ChannelPage = lazy(() => import('./pages/ChannelPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const CreateChannelPage = lazy(() => import('./pages/CreateChannelPage'))
const UploadPage = lazy(() => import('./pages/UploadPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage')) // Lazy load the new search results page
const EditVideoPage = lazy(() => import('./pages/EditVideoPage')) // Lazy load the edit video page
const EditChannelPage = lazy(() => import('./pages/EditChannelPage')) // Lazy load the edit channel page


function AppContent() {
  const { loading } = useContext(EnhancedAuthContext)
  const { isMobileOpen } = useContext(SidebarContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        
        {/* Mobile Sidebar */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <aside className="fixed inset-y-0 left-0 w-64 bg-white">
              <Sidebar />
            </aside>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/video/:id" element={<VideoPage />} />

              <Route path="/channel/:id" element={<ChannelPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/create-channel" element={<CreateChannelPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/channel/settings/:id" element={<EditChannelPage />} />
              <Route path="/video/:id/edit" element={<EditVideoPage />}/>
              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <AppContent />
}
