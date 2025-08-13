import React from 'react'


// src/components/ErrorMessage.jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-red-500 text-lg mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
