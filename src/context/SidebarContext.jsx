import React, { createContext, useState, useContext, useEffect } from 'react'
import { EnhancedAuthContext } from './EnhancedAuthContext'

export const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { loading } = useContext(EnhancedAuthContext)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar()
  }, [window.location.pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <SidebarContext.Provider value={{
      isOpen,
      isMobileOpen,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      setIsOpen
    }}>
      {children}
    </SidebarContext.Provider>
  )
}
