
import React, { useEffect, useState, useContext } from 'react';
import { apiService } from '../api/enhancedApi';
import { EnhancedAuthContext } from '../context/EnhancedAuthContext';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  // Now managing the filters state here as the single source of truth.
  const [filters, setFilters] = useState(['All']);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(EnhancedAuthContext);

  useEffect(() => {
    fetchFiltersAndVideos();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'All') {
      fetchAllVideos();
    } else {
      fetchVideosByCategory(selectedFilter);
    }
  }, [selectedFilter]);

  const fetchFiltersAndVideos = async () => {
    setLoading(true);
    try {
      const response = await apiService.getVideos();
      const allVideos = response.data || [];

      const categories = [...new Set(allVideos.map(v => v.category).filter(Boolean))];
      // Set the filters state in the parent component.
      setFilters(['All', ...categories]);

      setVideos(allVideos);
    } catch (err) {
      console.error('Error fetching videos/filters:', err);
      setError(err.response?.data?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getVideos();
      setVideos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      // The API call to filter videos by category should use the correct endpoint from your service
      // As shown in your apiService, this is `api.get('/videos/category/${category}')`
      const response = await apiService.getVideosByCategory(category);
      setVideos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage
        message={error}
        onRetry={() =>
          selectedFilter === 'All'
            ? fetchAllVideos()
            : fetchVideosByCategory(selectedFilter)
        }
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar
          // Pass the filters state down as a prop
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <div className="mt-6">
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos found</p>
              {user && !user.hasChannel && (
                <p className="text-gray-400 mt-2">
                  <a
                    href="/create-channel"
                    className="text-blue-600 hover:underline"
                  >
                    Create a channel to upload videos
                  </a>
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}