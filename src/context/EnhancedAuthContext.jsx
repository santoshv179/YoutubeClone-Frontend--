import React, { createContext, useState, useEffect, useCallback } from 'react'
import api from '../api/api'

export const EnhancedAuthContext = createContext()

export const EnhancedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [channel, setChannel] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Fetch user and channel data
  const fetchUserData = useCallback(async () => {
    if (!token) {
      setUser(null)
      setChannel(null)
      setLoading(false)
      return
    }

    try {
      const [userRes, channelRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/channels/me').catch(err => {
          if (err.response?.status === 404) return null
          throw err
        })
      ])

      console.log('User API response:', userRes.data)
    console.log('Channel API response:', channelRes?.data)
      setUser(userRes.data)
      setChannel(channelRes?.data || null)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
      setChannel(null)
      if (error.response?.status === 401) {
        setToken(null)
        localStorage.removeItem('token')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      fetchUserData()
    } else {
      localStorage.removeItem('token')
      setUser(null)
      setChannel(null)
      setLoading(false)
    }
  }, [token, fetchUserData])

  const login = (tokenStr) => {
    setToken(tokenStr)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setUser(null)
    setChannel(null)
  }

  // Refresh channel data
  const refreshChannel = async () => {
    if (!token) return
    try {
      const channelRes = await api.get('/channels/me')
      setChannel(channelRes.data)
    } catch (error) {
      if (error.response?.status === 404) {
        setChannel(null)
      }
    }
  }

  return (
    <EnhancedAuthContext.Provider value={{ 
      user, 
      channel, 
      token, 
      loading,
      login, 
      logout, 
      refreshChannel,
      hasChannel: !!channel 
    }}>
      {children}
    </EnhancedAuthContext.Provider>
  )
}
