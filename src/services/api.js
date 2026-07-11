import axios from 'axios';

// Use localhost backend during local development, even if VITE_API_URL is set to another value.
// This avoids accidentally pointing the browser to a deployed backend while testing locally.
const isLocalhost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const LOCAL_API_URL = 'http://localhost:5000/api';
const PRODUCTION_API_URL = 'https://travelhub-backend.onrender.com/api';
const DEFAULT_API_URL = isLocalhost ? LOCAL_API_URL : PRODUCTION_API_URL;

const apiUrlFromEnv = import.meta.env.VITE_API_URL;
const API_URL =
  (typeof window !== 'undefined' && window.__API_URL__) ||
  (isLocalhost ? LOCAL_API_URL : apiUrlFromEnv || PRODUCTION_API_URL);

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  if (isLocalhost) {
    console.info(`[API] localhost detected, using backend URL: ${API_URL}`);
    if (apiUrlFromEnv && !apiUrlFromEnv.includes('localhost')) {
      console.warn(
        `[API] VITE_API_URL is set to a remote backend (${apiUrlFromEnv}) while running on localhost. Local backend ${LOCAL_API_URL} will be used instead.`
      );
    }
  } else {
    console.info(`[API] production/browser backend URL: ${API_URL}`);
  }
}

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
