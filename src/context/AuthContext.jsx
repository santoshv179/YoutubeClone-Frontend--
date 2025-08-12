import React, { createContext, useState, useEffect } from 'react'
import api from '../api/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      // fetch current user
      api.get('/auth/me').then(res => setUser(res.data)).catch(() => {
        setUser(null)
      })
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = (tokenStr) => {
    setToken(tokenStr)
  }
  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
