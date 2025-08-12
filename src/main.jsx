import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { EnhancedAuthProvider } from './context/EnhancedAuthContext'
import { SidebarProvider } from './context/SidebarContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EnhancedAuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SidebarProvider>
    </EnhancedAuthProvider>
  </React.StrictMode>
)
