import api from '../axios';

export const getWorkshops = () => api.get('/workshops');
export const getWorkshop = (id) => api.get(`/workshops/${id}`);
export const getAvailableSlots = (id, date) => api.get(`/workshops/${id}/available-slots`, { params: { date } });
export const createWorkshop = (data) => api.post('/workshops', data);
export const updateWorkshop = (id, data) => api.put(`/workshops/${id}`, data);
export const deleteWorkshop = (id) => api.delete(`/workshops/${id}`);
