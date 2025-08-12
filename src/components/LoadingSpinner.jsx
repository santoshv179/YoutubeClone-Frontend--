// import React from 'react'

// export default function LoadingSpinner({ size = 'medium', className = '' }) {
//   const sizeClasses = {
//     small: 'h-4 w-4',
//     medium: 'h-8 w-8',
//     large: 'h-12 w-12',
//   }

//   return (
//     <div className={`flex items-center justify-center ${className}`}>
//       <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
//     </div>
//   )
// }

import React from 'react';

export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'h-6 w-6 border-[3px]',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-5',
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-t-transparent border-l-blue-500 border-r-indigo-500 border-b-blue-500 ${spinnerClass}`}
        style={{ animationDuration: '1s' }}
      ></div>
      <p className="mt-4 text-xl font-medium tracking-wide">
        Loading...
      </p>
    </div>
  );
}
