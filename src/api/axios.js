import axios from 'axios';
import toast from 'react-hot-toast';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const normalizeApiUrl = (value) => {
  if (!value) {
    return '';
  }

  const trimmedValue = value.trim().replace(/\/+$/, '');

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('//')) {
    return `https:${trimmedValue}`;
  }

  if (trimmedValue.startsWith('/')) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
};

const apiBaseURL = normalizeApiUrl(configuredApiUrl) || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message = 'Error de conexión';
    if (status === 401) {
      message = 'Sesión expirada. Inicia sesión nuevamente.';
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (status === 403) {
      message = 'No tienes permisos para esta acción.';
    } else if (status === 404) {
      message = 'Recurso no encontrado.';
    } else if (status === 500) {
      message = 'Error interno del servidor.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
