import axios from 'axios';

/**
 * Dynamically resolves the API base URL.
 * Ensures that production deployments automatically connect to the live Render backend,
 * while local development continues to use localhost.
 */
export const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // In browser runtime, check current hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0';

    // When deployed (e.g. on Vercel or any other domain)
    if (!isLocalhost) {
      // If VITE_API_URL was unset or mistakenly left pointing to localhost
      if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
        return 'https://lost-found-jycm.onrender.com/api';
      }
      return envUrl;
    }
  }

  // Local development default
  return envUrl || 'http://localhost:5000/api';
};

// Base API instance
const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  // Extended timeout to accommodate Render free tier cold starts (up to 45 seconds)
  timeout: 45000,
});

// Request Interceptor: Attach JWT token if present and safeguard baseURL
API.interceptors.request.use(
  (config) => {
    // Dynamic safeguard for production runtime
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0';

      if (
        !isLocalhost &&
        (!config.baseURL ||
          config.baseURL.includes('localhost') ||
          config.baseURL.includes('127.0.0.1'))
      ) {
        config.baseURL = 'https://lost-found-jycm.onrender.com/api';
      }
    }

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
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('ilfn_token');
        localStorage.removeItem('ilfn_user');
      }
    }

    // Attach user-friendly explanation for cold-start timeouts and connection errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.customMessage =
        'The server took longer than usual to respond. If it was sleeping, it is waking up now. Please try again.';
    } else if (!error.response && error.request) {
      error.customMessage =
        'Unable to connect to the server. Please check your internet connection or try again in a few seconds.';
    }

    return Promise.reject(error);
  }
);

export default API;
