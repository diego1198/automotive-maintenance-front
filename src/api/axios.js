import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
