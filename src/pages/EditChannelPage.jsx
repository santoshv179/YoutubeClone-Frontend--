

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EnhancedAuthContext } from '../context/EnhancedAuthContext';
import { apiService } from '../api/enhancedApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ChannelSettingsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, channel, refreshChannel } = useContext(EnhancedAuthContext); // 'channel' को useContext से प्राप्त करें
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
    });

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await apiService.getChannel(id);
                setChannelData(response.data);
                setFormState({
                    name: response.data.name,
                    description: response.data.description,
                    website: response.data.website || '',
                    location: response.data.location || '',
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load channel data.');
            } finally {
                setLoading(false);
            }
        };

        // यह महत्वपूर्ण लॉजिक है जो जाँचता है कि क्या user इस चैनल का मालिक है।
        // अब यह `channel` ऑब्जेक्ट का उपयोग करता है।
        if (user && channel && channel._id === id) {
            fetchChannelData();
        } else {
            // अगर IDs match नहीं करती हैं, तो यह आपको वापस चैनल पेज पर भेज देता है।
            // या यदि `user` या `channel` डेटा अभी तक लोड नहीं हुआ है,
            // तो यह प्रतीक्षा करेगा और फिर से चलेगा।
            if (!loading) { // केवल तभी navigate करें जब लोडिंग पूरी हो जाए
                navigate(`/channel/${id}`);
            }
        }
    }, [id, user, channel, navigate, loading]); // 'channel' और 'loading' को निर्भरता में जोड़ें

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedChannel = await apiService.updateChannel(id, formState);
            console.log('Channel updated successfully:', updatedChannel.data);
            
            await refreshChannel();
            
            navigate(`/channel/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update channel.');
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!channelData) return <ErrorMessage message="Channel data not found." />;

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Edit Channel Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Channel Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows="4"
                        value={formState.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                        type="url"
                        name="website"
                        id="website"
                        value={formState.website}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value={formState.location}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/channel/${id}`)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}