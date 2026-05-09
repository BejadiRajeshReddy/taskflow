import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if it's invalid/expired
      localStorage.removeItem('token');
      // Only redirect if not already on login/register to prevent loops
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
