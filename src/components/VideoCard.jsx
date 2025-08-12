

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaEye, FaThumbsUp } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa6';

export default function VideoCard({ video, channel }) {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Get YouTube thumbnail if URL is from YouTube
  const getYoutubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;// Regular expression to match YouTube URLs
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;// Extract video ID from the URL
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  // Get Vimeo thumbnail if URL is from Vimeo
  const getVimeoThumbnail = async (url) => {
    try {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data.thumbnail_url;
    } catch {
      return null;
    }
  };

  // Main thumbnail source resolver
  const getThumbnailSrc = async () => {
    if (video.thumbnailUrl) return video.thumbnailUrl;

    if (video.videoUrl?.includes('youtube')) {
      return getYoutubeThumbnail(video.videoUrl);
    }

    // Check if the video URL is from Vimeo
    if (video.videoUrl?.includes('vimeo')) {
      return await getVimeoThumbnail(video.videoUrl);
    }

    return '/placeholder-thumbnail.jpg'; // Local fallback
  };

  const [thumbnailSrc, setThumbnailSrc] = useState('/placeholder-thumbnail.jpg');

  useEffect(() => {
    let mounted = true;

    const loadThumbnail = async () => {
      const src = await getThumbnailSrc();
      if (mounted && src) {
        setThumbnailSrc(src);
      }
    };

    loadThumbnail();

    return () => {
      mounted = false;
    };
  }, [video.thumbnailUrl, video.videoUrl]);

  const formatViews = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const channelName = channel?.name || video.channel?.name || 'Unknown Channel';
  const channelId = channel?._id || video.channel?._id;

  return (
    <Link
      to={`/video/${video._id}`}
      className="group block w-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video bg-gray-900">
        <img
          src={thumbnailSrc}
          alt={video.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder-thumbnail.jpg';
          }}
        />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
          <FaPlay className="text-white text-5xl transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-0.5 rounded-md font-medium select-none">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 transition-colors group-hover:text-blue-500">
          {video.title}
        </h3>

        {/* The fix: use a span and navigate programmatically */}
        <span
          className="text-gray-500 dark:text-gray-400 text-sm mt-1 inline-block hover:text-blue-500 transition-colors cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevents the outer Link from navigating
            e.stopPropagation(); // Stops the click from bubbling up
            navigate(`/channel/${channelId}`);
          }}
        >
          {channelName}
        </span>

        <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500 text-xs mt-3">
          <span className="flex items-center gap-1">
            <FaEye className="w-3 h-3" />
            <span>{formatViews(video.views || 0)} views</span>
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp className="w-3 h-3" />
            <span>{formatViews(video.likes?.length || 0)} likes</span>
          </span>
          <span className="whitespace-nowrap">
            {formatDistanceToNow(new Date(video.createdAt || Date.now()), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}