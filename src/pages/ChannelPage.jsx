// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { EnhancedAuthContext } from '../context/EnhancedAuthContext';
// import { apiService } from '../api/enhancedApi';
// import VideoCard from '../components/VideoCard';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import { FaUser, FaVideo, FaBell, FaBellSlash, FaEdit, FaTrash } from 'react-icons/fa';

// // Helper function to get initials from a username
// const getInitials = (username) => {
//     if (!username) return '??';
//     const parts = username.trim().split(' ');
//     if (parts.length > 1) {
//         return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
//     }
//     return username.substring(0, 2).toUpperCase();
// };

// export default function ChannelPage() {
//     const { id } = useParams();
//     const { user, channel: userChannel } = useContext(EnhancedAuthContext);
//     const [channel, setChannel] = useState(null);
//     const [videos, setVideos] = useState([]);
//     const [isSubscribed, setIsSubscribed] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState('videos');

//     const isOwner = user && userChannel && (id === 'me' || id === userChannel._id);

//     useEffect(() => {
//         fetchChannelData();
//     }, [id, userChannel]); // Added userChannel to dependencies to re-fetch on owner change

//     const fetchChannelData = async () => {
//         setLoading(true);
//         setError(null);
        
//         try {
//             const channelId = id === 'me' ? userChannel?._id : id;
//             if (!channelId) {
//                 setError('Channel not found');
//                 setLoading(false);
//                 return;
//             }

//             const [channelRes, videosRes] = await Promise.all([
//                 apiService.getChannel(channelId),
//                 apiService.getChannelVideos(channelId)
//             ]);
            
//             setChannel(channelRes.data);
//             setVideos(videosRes.data || []);
//             // Check if the user is subscribed based on their ID
//             setIsSubscribed(channelRes.data.subscribers?.some(subscriberId => subscriberId === user?._id) || false);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to load channel');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubscribe = async () => {
//         if (!user || !channel) return;
        
//         try {
//             if (isSubscribed) {
//                 await apiService.unsubscribe(channel._id);
//                 // Update local state optimistically
//                 setChannel(prevChannel => ({
//                     ...prevChannel,
//                     subscribers: prevChannel.subscribers.filter(subId => subId !== user._id)
//                 }));
//                 setIsSubscribed(false);
//             } else {
//                 await apiService.subscribe(channel._id);
//                 // Update local state optimistically
//                 setChannel(prevChannel => ({
//                     ...prevChannel,
//                     subscribers: [...(prevChannel.subscribers || []), user._id]
//                 }));
//                 setIsSubscribed(true);
//             }
//         } catch (err) {
//             console.error('Error subscribing:', err);
//             // Revert state if API call fails
//             fetchChannelData();
//         }
//     };

//     const handleDeleteVideo = async (videoId) => {
//         if (!window.confirm('Are you sure you want to delete this video?')) return;
        
//         try {
//             await apiService.deleteVideo(videoId);
//             setVideos(videos.filter(video => video._id !== videoId));
//         } catch (err) {
//             console.error('Error deleting video:', err);
//         }
//     };

//     const formatViews = (views) => {
//         if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
//         if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
//         return views.toString();
//     };

//     if (loading) return <LoadingSpinner />;
//     if (error) return <ErrorMessage message={error} onRetry={fetchChannelData} />;
//     if (!channel) return <ErrorMessage message="Channel not found" />;

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 {/* Channel Header */}
//                 <div className="bg-white rounded-lg shadow p-6 mb-6">
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//                         {/* Avatar Logic: Use initials if no avatar is present */}
//                         {channel.avatar ? (
//                             <img
//                                 src={channel.avatar}
//                                 alt={channel.name}
//                                 className="w-32 h-32 rounded-full object-cover"
//                             />
//                         ) : (
//                             <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold">
//                                 {getInitials(channel.name)}
//                             </div>
//                         )}
                        
//                         <div className="flex-1">
//                             <h1 className="text-3xl font-bold text-gray-900 mb-2">{channel.name}</h1>
//                             <p className="text-gray-600 mb-2">@{channel.name}</p>
                            
//                             <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
//                                 <span className="flex items-center gap-1">
//                                     <FaUser className="w-4 h-4" />
//                                     {formatViews(channel.subscribers?.length || 0)} subscribers
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                     <FaVideo className="w-4 h-4" />
//                                     {videos.length} videos
//                                 </span>
//                             </div>
                            
//                             {channel.description && (
//                                 <p className="text-gray-700 mb-4">{channel.description}</p>
//                             )}
                            
//                             <div className="flex items-center gap-4">
//                                 {user && !isOwner && (
//                                     <button
//                                         onClick={handleSubscribe}
//                                         className={`px-6 py-2 rounded-full font-medium transition-colors ${
//                                             isSubscribed
//                                                 ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                                 : 'bg-red-600 text-white hover:bg-red-700'
//                                         }`}
//                                     >
//                                         {isSubscribed ? (
//                                             <span className="flex items-center gap-2">
//                                                 <FaBellSlash className="w-4 h-4" />
//                                                 Subscribed
//                                             </span>
//                                         ) : (
//                                             <span className="flex items-center gap-2">
//                                                 <FaBell className="w-4 h-4" />
//                                                 Subscribe
//                                             </span>
//                                         )}
//                                     </button>
//                                 )}
                                
//                                 {isOwner && (
//                                     <Link
//                                         to={`/channel/settings/${channel._id}`}
//                                         className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
//                                     >
//                                         <FaEdit className="w-4 h-4 inline mr-2" />
//                                         Edit Channel
//                                     </Link>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Channel Content */}
//                 <div className="bg-white rounded-lg shadow">
//                     <div className="border-b">
//                         <nav className="flex space-x-8 px-6">
//                             <button
//                                 onClick={() => setActiveTab('videos')}
//                                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                                     activeTab === 'videos'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                                 }`}
//                             >
//                                 Videos
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('about')}
//                                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                                     activeTab === 'about'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                                 }`}
//                             >
//                                 About
//                             </button>
//                         </nav>
//                     </div>

//                     <div className="p-6">
//                         {activeTab === 'videos' && (
//                             <div>
//                                 {videos.length === 0 ? (
//                                     <p className="text-center text-gray-500 py-12">
//                                         {isOwner ? 'You haven\'t uploaded any videos yet.' : 'This channel hasn\'t uploaded any videos yet.'}
//                                     </p>
//                                 ) : (
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {videos.map(video => (
//                                             <div key={video._id} className="relative">
//                                                 {/* The crucial fix is here: pass the 'channel' object as a prop */}
//                                                 <VideoCard video={video} channel={channel} />
//                                                 {/* Video action buttons are now correctly positioned and functional */}
//                                                 {isOwner && (
//                                                     <div className="absolute top-2 right-2 flex gap-2">
//                                                         <Link
//                                                             to={`/video/${video._id}/edit`}
//                                                             className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
//                                                         >
//                                                             <FaEdit className="w-4 h-4" />
//                                                         </Link>
//                                                         <button
//                                                             onClick={() => handleDeleteVideo(video._id)}
//                                                             className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
//                                                         >
//                                                             <FaTrash className="w-4 h-4" />
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {activeTab === 'about' && (
//                             <div className="space-y-6">
//                                 <div>
//                                     <h3 className="text-lg font-semibold mb-2">Description</h3>
//                                     <p className="text-gray-700">{channel.description || 'No description provided.'}</p>
//                                 </div>
                                
//                                 {channel.website && (
//                                     <div>
//                                         <h3 className="text-lg font-semibold mb-2">Website</h3>
//                                         <a
//                                             href={channel.website}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="text-blue-600 hover:underline"
//                                         >
//                                             {channel.website}
//                                         </a>
//                                     </div>
//                                 )}
                                
//                                 {channel.location && (
//                                     <div>
//                                         <h3 className="text-lg font-semibold mb-2">Location</h3>
//                                         <p className="text-gray-700">{channel.location}</p>
//                                     </div>
//                                 )}
                                
//                                 <div>
//                                     <h3 className="text-lg font-semibold mb-2">Stats</h3>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <p className="text-2xl font-bold">{formatViews(channel.subscribers?.length || 0)}</p>
//                                             <p className="text-gray-600">Subscribers</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-2xl font-bold">{videos.length}</p>
//                                             <p className="text-gray-600">Videos</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnhancedAuthContext } from '../context/EnhancedAuthContext';
import { apiService } from '../api/enhancedApi';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaUser, FaVideo, FaBell, FaBellSlash, FaEdit, FaTrash } from 'react-icons/fa';

// Helper function to get initials from a username
const getInitials = (username) => {
    if (!username) return '??';
    const parts = username.trim().split(' ');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
};

export default function ChannelPage() {
    const { id } = useParams();
    const { user, channel: userChannel } = useContext(EnhancedAuthContext);
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('videos');

    const isOwner = user && userChannel && (id === 'me' || id === userChannel._id);

    useEffect(() => {
        fetchChannelData();
    }, [id, userChannel]); // Added userChannel to dependencies to re-fetch on owner change

    const fetchChannelData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const channelId = id === 'me' ? userChannel?._id : id;
            if (!channelId) {
                setError('Channel not found');
                setLoading(false);
                return;
            }

            const [channelRes, videosRes] = await Promise.all([
                apiService.getChannel(channelId),
                apiService.getChannelVideos(channelId)
            ]);
            
            setChannel(channelRes.data);
            setVideos(videosRes.data || []);
            // Check if the user is subscribed based on their ID
            setIsSubscribed(channelRes.data.subscribers?.some(subscriberId => subscriberId === user?._id) || false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load channel');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (!user || !channel) return;
        
        try {
            if (isSubscribed) {
                await apiService.unsubscribe(channel._id);
                // Update local state optimistically
                setChannel(prevChannel => ({
                    ...prevChannel,
                    subscribers: prevChannel.subscribers.filter(subId => subId !== user._id)
                }));
                setIsSubscribed(false);
            } else {
                await apiService.subscribe(channel._id);
                // Update local state optimistically
                setChannel(prevChannel => ({
                    ...prevChannel,
                    subscribers: [...(prevChannel.subscribers || []), user._id]
                }));
                setIsSubscribed(true);
            }
        } catch (err) {
            console.error('Error subscribing:', err);
            // Revert state if API call fails
            fetchChannelData();
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        
        try {
            await apiService.deleteVideo(videoId);
            setVideos(videos.filter(video => video._id !== videoId));
        } catch (err) {
            console.error('Error deleting video:', err);
        }
    };

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchChannelData} />;
    if (!channel) return <ErrorMessage message="Channel not found" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Channel Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar Logic: Use initials if no avatar is present */}
                        {channel.avatar ? (
                            <img
                                src={channel.avatar}
                                alt={channel.name}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold">
                                {getInitials(channel.name)}
                            </div>
                        )}
                        
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{channel.name}</h1>
                            <p className="text-gray-600 mb-2">@{channel.name}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <span className="flex items-center gap-1">
                                    <FaUser className="w-4 h-4" />
                                    {formatViews(channel.subscribers?.length || 0)} subscribers
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaVideo className="w-4 h-4" />
                                    {videos.length} videos
                                </span>
                            </div>
                            
                            {channel.description && (
                                <p className="text-gray-700 mb-4">{channel.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4">
                                {user && !isOwner && (
                                    <button
                                        onClick={handleSubscribe}
                                        className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                            isSubscribed
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    >
                                        {isSubscribed ? (
                                            <span className="flex items-center gap-2">
                                                <FaBellSlash className="w-4 h-4" />
                                                Subscribed
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <FaBell className="w-4 h-4" />
                                                Subscribe
                                            </span>
                                        )}
                                    </button>
                                )}
                                
                                {isOwner && (
                                    <Link
                                        to={`/channel/settings/${channel._id}`}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        <FaEdit className="w-4 h-4 inline mr-2" />
                                        Edit Channel
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Channel Content */}
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('videos')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'videos'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Videos
                            </button>
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'about'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                About
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'videos' && (
                            <div>
                                {videos.length === 0 ? (
                                    <p className="text-center text-gray-500 py-12">
                                        {isOwner ? 'You haven\'t uploaded any videos yet.' : 'This channel hasn\'t uploaded any videos yet.'}
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {videos.map(video => (
                                            <div key={video._id} className="relative">
                                                {/* The crucial fix is here: pass the 'channel' object as a prop */}
                                                <VideoCard video={video} channel={channel} />
                                                {/* Video action buttons are now correctly positioned and functional */}
                                                {isOwner && (
                                                    <div className="absolute top-2 right-2 flex gap-2">
                                                        <Link
                                                            to={`/video/${video._id}/edit`}
                                                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteVideo(video._id)}
                                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700">{channel.description || 'No description provided.'}</p>
                                </div>
                                
                                {channel.website && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Website</h3>
                                        <a
                                            href={channel.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {channel.website}
                                        </a>
                                    </div>
                                )}
                                
                                {channel.location && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Location</h3>
                                        <p className="text-gray-700">{channel.location}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Stats</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-2xl font-bold">{formatViews(channel.subscribers?.length || 0)}</p>
                                            <p className="text-gray-600">Subscribers</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{videos.length}</p>
                                            <p className="text-gray-600">Videos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}