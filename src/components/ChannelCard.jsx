import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaVideo } from 'react-icons/fa'

export default function ChannelCard({ channel }) {
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`  // Format millions
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`  // Format thousands
    return views.toString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <img
          src={channel.avatar || '/default-avatar.png'}
          alt={channel.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <Link to={`/channel/${channel._id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {channel.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">@{channel.name}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaUser className="w-3 h-3" />
              {formatViews(channel.subscribers?.length || 0)} subscribers
            </span>
            <span className="flex items-center gap-1">
              <FaVideo className="w-3 h-3" />
              {channel.videoCount || 0} videos
            </span>
          </div>
          {channel.description && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {channel.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
