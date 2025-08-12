// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { apiService } from '../api/enhancedApi'; // Adjust the path as needed
// import VideoCard from '../components/VideoCard'; // Assuming you have a component to display video cards

// export default function SearchResultsPage() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();
//   const query = new URLSearchParams(location.search).get('q');

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) {
//         setSearchResults([]);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await apiService.searchVideos(query);
//         setSearchResults(response.data);
//       } catch (err) {
//         console.error('Failed to fetch search results:', err);
//         setError('Failed to load search results. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query]);

//   if (loading) {
//     return <div className="p-4 text-center">Loading search results...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-center text-red-600">{error}</div>;
//   }

//   if (searchResults.length === 0) {
//     return <div className="p-4 text-center text-gray-500">No videos found for "{query}".</div>;
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {searchResults.map((video) => (
//           <VideoCard key={video._id} video={video} />
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../api/enhancedApi'; // Adjust the path as needed
import VideoCard from '../components/VideoCard'; // Assuming you have a component to display video cards

export default function SearchResultsPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiService.searchVideos(query);
        setSearchResults(response.data);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return <div className="p-4 text-center">Loading search results...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (searchResults.length === 0) {
    return (
      <div className="p-8 text-center bg-yellow-50 text-yellow-700 border-l-4 border-yellow-400 max-w-2xl mx-auto mt-12 rounded-md shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-semibold">No videos found</p>
        <p className="text-lg mt-2">We couldn't find any videos for "<span className="font-bold">{query}</span>".</p>
        <p className="text-base mt-2">Try a different search term or check your spelling.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}