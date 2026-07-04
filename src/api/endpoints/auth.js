import api from '../axios';

export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);
export const getProfile = () => api.get('/users/profile');
