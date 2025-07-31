import axios from 'axios';

// Force cache bust - Render deployment URL
const API_BASE_URL = 'https://dubeboxing.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request interceptor - bypass authentication
api.interceptors.request.use(
  (config) => {
    // Skip authentication - allow all requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - simplified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just log errors, don't redirect to login
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);



// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getAllAdmin: () => api.get('/events/admin'),
  create: (formData) => api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/events/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  getAllAdmin: () => api.get('/gallery'), // Use same endpoint as getAll since no admin-specific route exists
  create: (formData) => api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/team'),
  getAllAdmin: () => api.get('/team/admin'),
  create: (formData) => api.post('/team', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/team/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/team/${id}`),
};

// Contact API
export const contactAPI = {
  get: () => api.get('/contact'),
  update: (data) => api.put('/contact', data),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  getAdmin: () => api.get('/settings/admin'),
  update: (data) => api.put('/settings', data),
};

// Analytics API
export const analyticsAPI = {
  track: (page) => api.post('/analytics/track', { page }),
  get: (period) => api.get(`/analytics?period=${period}`),
  getDaily: (days) => api.get(`/analytics/daily?days=${days}`),
};

export default api; 