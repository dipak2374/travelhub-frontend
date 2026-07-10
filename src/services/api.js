import axios from 'axios';

// Allow runtime override via `window.__API_URL__` when available.
// This lets you change the backend URL without rebuilding the app.
const DEFAULT_API_URL =
  (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:5000/api'
    : 'https://travelhub-backend.onrender.com/api';

const API_URL =
  (typeof window !== 'undefined' && window.__API_URL__) ||
  import.meta.env.VITE_API_URL ||
  DEFAULT_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (!error.response) {
      console.error('API Network Error:', error.message);
      error.customMessage = 'Unable to reach the server. Please check your internet connection or try again later.';
    } else {
      const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      error.customMessage = serverMessage || 'Request failed';
    }

    return Promise.reject(error);
  }
);

export default api;
