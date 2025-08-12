
import React from 'react';

const VideoPlayer = ({ src }) => {
  if (!src) {
    return (
      <div className="flex items-center justify-center bg-gray-900 text-white h-full">
        <p>No video source provided.</p>
      </div>
    );
  }

  // Regular expression to extract video ID from YouTube URLs
  const youtubeMatch = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

   //standard video tag for direct video file URLs
  return (
    <video
      className="w-full h-full"
      controls
      src={src}
    ></video>
  );
};

export default VideoPlayer;