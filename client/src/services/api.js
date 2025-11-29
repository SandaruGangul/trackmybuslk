import axios from 'axios';
import config from '../config';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response;
  },
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response;
  },
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response;
  }
};

// Bus API
export const busAPI = {
  getRoutes: async () => {
    const response = await api.get('/api/buses/routes');
    return response;
  },
  getRoute: async (routeId) => {
    const response = await api.get(`/api/buses/routes/${routeId}`);
    return response;
  },
  getUpdates: async (routeId, includeOutdated = false) => {
    const response = await api.get(`/api/buses/updates/${routeId}`, {
      params: { includeOutdated }
    });
    return response;
  },
  createUpdate: async (updateData) => {
    const response = await api.post('/api/buses/update', updateData);
    return response;
  },
  getUserUpdates: async () => {
    const response = await api.get('/api/buses/user-updates');
    return response;
  },
  deleteUpdate: async (updateId) => {
    const response = await api.delete(`/api/buses/update/${updateId}`);
    return response;
  }
};

// User API
export const userAPI = {
  getLeaderboard: async () => {
    const response = await api.get('/api/users/leaderboard');
    return response;
  }
};