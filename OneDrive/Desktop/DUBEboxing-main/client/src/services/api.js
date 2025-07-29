import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dubeboxing.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  initAdmin: () => api.post('/auth/init'),
};

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
  getAllAdmin: () => api.get('/gallery/admin'),
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