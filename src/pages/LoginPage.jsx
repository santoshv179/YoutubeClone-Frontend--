

import React, { useState, useContext } from 'react'
import { apiService } from '../api/enhancedApi'
import { EnhancedAuthContext } from '../context/EnhancedAuthContext'
import { useNavigate, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useContext(EnhancedAuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiService.login(formData)
      login(response.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User Logo"
            className="w-12 h-12 mb-2"
          />
          <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1">to continue to YouTube Clone</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="small" /> : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Create account link */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-block rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
