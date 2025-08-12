import React, { useState, useContext } from 'react'
import { EnhancedAuthContext } from '../context/EnhancedAuthContext'
import { apiService } from '../api/enhancedApi'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function UploadPage() {
  const { user, hasChannel } = useContext(EnhancedAuthContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Entertainment',
    tags: '',
    videoUrl: '', 
    thumbnailUrl: '', // (optional) 
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/login')
    return null
  }

  if (!hasChannel) {
    navigate('/create-channel')
    return null
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Send plain JSON, not FormData
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl, // (optional)
      }
      const response = await apiService.uploadVideo(payload)
      navigate(`/video/${response.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Entertainment',
    'Music',
    'Gaming',
    'Sports',
    'Technology',
    'Education',
    'Comedy',
    'News',
    'Travel',
    'Lifestyle'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Video</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && <ErrorMessage message={error} />}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>

            {/* (Optional) Thumbnail URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video title"
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
                placeholder="Describe your video"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.videoUrl || !formData.title}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Upload Video'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}