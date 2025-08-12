import React, { useState, useContext } from 'react'
import { apiService } from '../api/enhancedApi'
import { EnhancedAuthContext } from '../context/EnhancedAuthContext'
import { useNavigate, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function CreateChannelPage() {
  const { user, refreshChannel } = useContext(EnhancedAuthContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }


// Handle file changes for avatar and banner
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
    } else {
      setError('Please select a valid image file for avatar')
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setBannerFile(file)
    } else {
      setError('Please select a valid image file for banner')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Channel name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      if (formData.website) data.append('website', formData.website)
      if (formData.location) data.append('location', formData.location)
      if (avatarFile) data.append('avatar', avatarFile)
      if (bannerFile) data.append('banner', bannerFile) 

      await apiService.createChannel(data)
      await refreshChannel() // Refresh user channel data
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Channel creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Channel</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && <ErrorMessage message={error} />}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter channel name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell viewers about your channel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Avatar (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {avatarFile && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {avatarFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Banner (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {bannerFile && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {bannerFile.name}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Create Channel'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
