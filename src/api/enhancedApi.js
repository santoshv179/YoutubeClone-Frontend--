
// export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
//   withCredentials: false,
// });

// // Request interceptor for auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const apiService = {
//   // Auth
//   login: (credentials) => api.post('/auth/login', credentials),
//   register: (userData) => api.post('/auth/register', userData),
//   getCurrentUser: () => api.get('/auth/me'),

//   // Videos
//   getVideos: (params = {}) => api.get('/videos', { params }),
//   getVideo: (id) => api.get(`/videos/${id}`),
//   uploadVideo: (data) => api.post('/videos', data),
//   updateVideo: (id, data) => api.put(`/videos/${id}`, data),
//   deleteVideo: (id) => api.delete(`/videos/${id}`),
//   likeVideo: (id) => api.post(`/videos/${id}/like`),
//   dislikeVideo: (id) => api.post(`/videos/${id}/dislike`),
//   // ** This is the corrected line **
//   searchVideos: (query) => api.get('/videos/search', { params: { q: query } }),

//   // Channels
//   getChannels: () => api.get('/channels'),
//   getChannel: (id) => api.get(`/channels/${id}`),
//   getMyChannel: () => api.get('/channels/me'),
//   createChannel: (data) => api.post('/channels', data),
//   updateChannel: (id, data) => api.put(`/channels/${id}`, data),
//   deleteChannel: (id) => api.delete(`/channels/${id}`),
//   subscribe: (id) => api.post(`/channels/${id}/subscribe`),
//   unsubscribe: (id) => api.post(`/channels/${id}/unsubscribe`),
//   getChannelVideos: (id) => api.get(`/channels/${id}/videos`),

//   // Comments
//   getComments: (videoId) => api.get(`/comments/${videoId}`),
//   createComment: (videoId, text) => api.post(`/comments/${videoId}`, { text }),
//   updateComment: (commentId, text) => api.put(`/comments/${commentId}`, { text }),
//   deleteComment: (commentId) => api.delete(`/comments/${commentId}`),

//   // Filters / Categories
//   getFilters: () => api.get('/videos/filters'),
//   getCategories: () => api.get('/videos/category'),
//   getVideosByCategory: (cat) => api.get(`/videos/category/${encodeURIComponent(cat)}`),
// };

// export default api;


// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),

  // Videos
  getVideos: (params = {}) => api.get('/videos', { params }),
  getVideo: (id) => api.get(`/videos/${id}`),
  uploadVideo: (data) => api.post('/videos', data),
  updateVideo: (id, data) => api.put(`/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  dislikeVideo: (id) => api.post(`/videos/${id}/dislike`),
  // 🔹 New searchVideos function for case-insensitive title search
  searchVideos: async (query) => {
    const response = await api.get('/videos');
    const allVideos = response.data;
    const lowerCaseQuery = query.toLowerCase();

    // Filter videos by matching title (case-insensitive)
    const filteredVideos = allVideos.filter(video =>
      video.title.toLowerCase().includes(lowerCaseQuery)
    );

    return { data: filteredVideos };
  },

  // Channels
  getChannels: () => api.get('/channels'),
  getChannel: (id) => api.get(`/channels/${id}`),
  getMyChannel: () => api.get('/channels/me'),
  createChannel: (data) => api.post('/channels', data),
  updateChannel: (id, data) => api.put(`/channels/${id}`, data),
  deleteChannel: (id) => api.delete(`/channels/${id}`),
  subscribe: (id) => api.post(`/channels/${id}/subscribe`),
  unsubscribe: (id) => api.post(`/channels/${id}/unsubscribe`),
  getChannelVideos: (id) => api.get(`/channels/${id}/videos`),

  // Comments
  getComments: (videoId) => api.get(`/comments/${videoId}`),
  createComment: (videoId, text) => api.post(`/comments/${videoId}`, { text }),
  updateComment: (commentId, text) => api.put(`/comments/${commentId}`, { text }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),

  // Filters / Categories
  getFilters: () => api.get('/videos/filters'),
  getCategories: () => api.get('/videos/category'),
  getVideosByCategory: (cat) => api.get(`/videos/category/${encodeURIComponent(cat)}`),
};

export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
//   withCredentials: false,
// });

// // Request interceptor for auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const apiService = {
//   // Auth
//   login: (credentials) => api.post('/auth/login', credentials),
//   register: (userData) => api.post('/auth/register', userData),
//   getCurrentUser: () => api.get('/auth/me'),

//   // Videos
//   // 🔹 Updated getVideos to accept a search query parameter
//   getVideos: (params = {}) => api.get('/videos', { params }),
//   getVideo: (id) => api.get(`/videos/${id}`),
//   uploadVideo: (data) => api.post('/videos', data),
//   updateVideo: (id, data) => api.put(`/videos/${id}`, data),
//   deleteVideo: (id) => api.delete(`/videos/${id}`),
//   likeVideo: (id) => api.post(`/videos/${id}/like`),
//   dislikeVideo: (id) => api.post(`/videos/${id}/dislike`),

//   // Channels
//   getChannels: () => api.get('/channels'),
//   getChannel: (id) => api.get(`/channels/${id}`),
//   getMyChannel: () => api.get('/channels/me'),
//   createChannel: (data) => api.post('/channels', data),
//   updateChannel: (id, data) => api.put(`/channels/${id}`, data),
//   deleteChannel: (id) => api.delete(`/channels/${id}`),
//   subscribe: (id) => api.post(`/channels/${id}/subscribe`),
//   unsubscribe: (id) => api.post(`/channels/${id}/unsubscribe`),
//   getChannelVideos: (id) => api.get(`/channels/${id}/videos`),

//   // Comments
//   getComments: (videoId) => api.get(`/comments/${videoId}`),
//   createComment: (videoId, text) => api.post(`/comments/${videoId}`, { text }),
//   updateComment: (commentId, text) => api.put(`/comments/${commentId}`, { text }),
//   deleteComment: (commentId) => api.delete(`/comments/${commentId}`),

//   // Filters / Categories
//   getFilters: () => api.get('/videos/filters'),
//   getCategories: () => api.get('/videos/category'),
//   getVideosByCategory: (cat) => api.get(`/videos/category/${encodeURIComponent(cat)}`),
// };

// export default api;
