
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-xl text-center bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105">
        <h1 className="text-8xl md:text-9xl font-extrabold text-red-500 animate-pulse">404</h1>
        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block px-8 py-3 text-lg font-semibold text-white bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}