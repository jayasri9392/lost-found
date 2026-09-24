import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ilfn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error format and catch unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired (401), clear local session
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('ilfn_token');
        localStorage.removeItem('ilfn_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
