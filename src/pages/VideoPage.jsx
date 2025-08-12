
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { EnhancedAuthContext } from "../context/EnhancedAuthContext";
import VideoPlayer from "../components/VideoPlayer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { apiService } from "../api/enhancedApi";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaShare,
  FaBookmark,
  FaBell,
  FaBellSlash,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

// Helper function to get initials from a username
const getInitials = (username) => {
  if (!username) return "??";
  const parts = username.trim().split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
};

// Helper function to get a YouTube thumbnail from a video URL
const getYouTubeThumbnail = (url) => {
  try {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
    }
  } catch (error) {
    console.error("Invalid YouTube URL:", url);
  }
  return null;
};

export default function VideoPage() {
  const { id } = useParams();
  const { user, channel } = useContext(EnhancedAuthContext);
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [channelDetails, setChannelDetails] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // New state for description

  useEffect(() => {
    fetchVideoData();
    // eslint-disable-next-line
  }, [id, user]);

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [videoRes, commentsRes, relatedRes] = await Promise.all([
        apiService.getVideo(id),
        apiService.getComments(id),
        apiService.getVideos({ limit: 10 }),
      ]);

      const fetchedVideo = videoRes.data;
      setVideo(fetchedVideo);
      setComments(commentsRes.data || []);
      setRelatedVideos(relatedRes.data.filter((v) => v._id !== id) || []);//filter out the current video from related videos

      if (user && fetchedVideo.channel?._id) {
        const channelRes = await apiService.getChannel(fetchedVideo.channel._id);
        const fetchedChannel = channelRes.data;
        setChannelDetails(fetchedChannel);

        setIsLiked(fetchedVideo.likes?.includes(user._id) || false);
        setIsDisliked(fetchedVideo.dislikes?.includes(user._id) || false);
        setIsSubscribed(
          fetchedChannel.subscribers?.some(
            (subId) => subId.toString() === user._id
          ) || false
        );
      } else {
        setIsLiked(false);
        setIsDisliked(false);
        setIsSubscribed(false);
        setChannelDetails(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await apiService.likeVideo(id);
      const videoRes = await apiService.getVideo(id);
      setVideo(videoRes.data);
      setIsLiked(videoRes.data.likes?.includes(user._id) || false);
      setIsDisliked(videoRes.data.dislikes?.includes(user._id) || false);
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await apiService.dislikeVideo(id);
      const videoRes = await apiService.getVideo(id);
      setVideo(videoRes.data);
      setIsLiked(videoRes.data.likes?.includes(user._id) || false);
      setIsDisliked(videoRes.data.dislikes?.includes(user._id) || false);
    } catch (err) {
      console.error("Error disliking video:", err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSubLoading(true);
    try {
      if (isSubscribed) {
        await apiService.unsubscribe(video.channel._id);
      } else {
        await apiService.subscribe(video.channel._id);
      }

      const channelRes = await apiService.getChannel(video.channel._id);
      const updatedChannel = channelRes.data;

      setChannelDetails(updatedChannel);
      setIsSubscribed(
        updatedChannel.subscribers?.some(
          (subId) => subId.toString() === user._id
        ) || false
      );
    } catch (err) {
      console.error("Error subscribing:", err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await apiService.createComment(id, newComment.trim());
      const newCommentWithAuthor = {
        ...response.data,
        author: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
        },
      };
      setComments([newCommentWithAuthor, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      await apiService.updateComment(commentId, newText);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, text: newText } : c))
      );
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        await apiService.deleteComment(commentId);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchVideoData} />;
  if (!video) return <ErrorMessage message="Video not found" />;

  const descriptionLength = video.description?.length || 0;
  const showReadMore = descriptionLength > 200; // Adjust this value as needed
  const displayedDescription =                // Show full description if expanded
    showReadMore && !isDescriptionExpanded
      ? `${video.description.substring(0, 200)}...`
      : video.description;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Video + Details */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden aspect-video">
              <VideoPlayer src={video.videoUrl} className="w-full h-full" />
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {video.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{formatViews(video.views || 0)} views</span>
                  <span>•</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                      isLiked
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <FaThumbsUp className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {formatViews(video.likes?.length || 0)}
                    </span>
                  </button>

                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                      isDisliked
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <FaThumbsDown className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {formatViews(video.dislikes?.length || 0)}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                    <FaShare className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                    <FaBookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Link to={`/channel/${video.channel?._id}`}>
                      {video.channel?.owner?.avatar ? (
                        <img
                          src={video.channel?.owner?.avatar}
                          alt={video.channel?.name || "Channel Avatar"}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-lg ring-2 ring-gray-200">
                          {getInitials(video.channel?.name)}
                        </div>
                      )}
                    </Link>
                    <div>
                      <Link
                        to={`/channel/${video.channel?._id}`}
                        className="font-semibold text-lg text-gray-900 hover:underline"
                      >
                        {video.channel?.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {formatViews(channelDetails?.subscribers?.length || 0)}{" "}
                        subscribers
                      </p>
                    </div>
                  </div>

                  {user && video.channel?._id !== channel?._id && (
                    <button
                      onClick={handleSubscribe}
                      disabled={subLoading}
                      className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                        isSubscribed
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-red-600 text-white hover:bg-red-700"
                      } ${subLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {subLoading ? (
                        "Please wait..."
                      ) : isSubscribed ? (
                        <>
                          <FaBellSlash className="w-4 h-4" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <FaBell className="w-4 h-4" />
                          Subscribe
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Description with Read More */}
              {video.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {displayedDescription}
                  </p>
                  {showReadMore && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-blue-600 hover:underline mt-2 text-sm font-medium"
                    >
                      {isDescriptionExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-xl font-semibold mb-6">
                {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
              </h3>

              {user && (
                <form onSubmit={handleComment} className="mb-8">
                  <div className="flex gap-4 items-start">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {getInitials(user.username)}
                      </div>
                    )}
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || commentLoading}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {commentLoading ? "Posting..." : "Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="relative flex gap-4">
                    {comment.author?.avatar ? (
                      <img
                        src={comment.author?.avatar}
                        alt={comment.author?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">
                        {getInitials(comment.author?.username)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {comment.author?.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 mt-1">{comment.text}</p>
                    </div>

                    {/* Always visible edit/delete buttons */}
                    {user && comment.author && user._id === comment.author._id && (
                      <div className="absolute right-0 top-0 flex gap-2">
                        <button
                          onClick={() => {
                            const newText = prompt(
                              "Edit your comment:",
                              comment.text
                            );
                            if (newText && newText.trim()) {
                              handleEditComment(comment._id, newText.trim());
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FaTrashAlt className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => {
                  // Determine the thumbnail URL to use
                  const thumbnailUrl =
                    relatedVideo.thumbnailUrl ||
                    (relatedVideo.videoUrl && getYouTubeThumbnail(relatedVideo.videoUrl)) ||
                    "/placeholder-thumbnail.jpg";
                  return (
                    <Link
                      key={relatedVideo._id}
                      to={`/video/${relatedVideo._id}`}
                      className="flex gap-4 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={relatedVideo.title}
                        className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-thumbnail.jpg";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {relatedVideo.channel?.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatViews(relatedVideo.views || 0)} views
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}