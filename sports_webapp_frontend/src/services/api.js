import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  // API Key guardada o por defecto
  const apiKey = localStorage.getItem('api_key') || 'esports_api_key_secret_123';
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }

  // Token CSRF desde la cookie csrf_token o localStorage
  const csrfToken = getCookie('csrf_token') || localStorage.getItem('csrf_token');
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('csrf_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;