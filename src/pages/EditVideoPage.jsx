import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../api/enhancedApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

// Page to edit video details
export default function EditVideoPage() {
    // Get the video ID from the URL parameters
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State to manage form data, loading state, and errors
    const [videoData, setVideoData] = useState({ title: '', description: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch video details when the component mounts or ID changes
    useEffect(() => {
        // Log the ID to verify it's not null or undefined
        console.log("Fetching video details for ID:", id);
        if (!id) {
            setError("Error: No video ID provided in the URL.");
            setLoading(false);
            return;
        }

        const fetchVideoDetails = async () => {
            try {
                // Use the correct API service function (getVideo)
                const response = await apiService.getVideo(id);
                console.log("API response for video details:", response.data);
                
                setVideoData({
                    title: response.data.title,
                    description: response.data.description,
                    category: response.data.category
                });
            } catch (err) {
                console.error("Failed to fetch video details:", err);
                setError(err.response?.data?.message || 'Failed to fetch video details.');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoDetails();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVideoData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);
        try {
            await apiService.updateVideo(id, videoData);
            alert('Video updated successfully!');
            navigate(`/video/${id}`); // Redirect to the video's detail page
        } catch (err) {
            console.error("Failed to update video:", err);
            // Log the full error response for better debugging
            console.error("Server response:", err.response);
            setError(err.response?.data?.message || 'Failed to update video.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={() => navigate(`/channel/${id}`)} />;
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Video</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Video Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={videoData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Video Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={videoData.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            value={videoData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUpdating ? <LoadingSpinner size="sm" /> : <><FaSave className="mr-2" /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

