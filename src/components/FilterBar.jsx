
import React from 'react';

// The component now receives the filters array directly as a prop.
export default function FilterBar({ filters, selectedFilter, onFilterChange }) {
  // We no longer need the local filters state or the useEffect hook.
  // The filters array is passed from the parent.

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            selectedFilter === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}