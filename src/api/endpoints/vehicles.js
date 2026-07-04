import api from '../axios';

export const getVehicles = (params) => api.get('/vehicles', { params });
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const updateMileage = (id, mileage) => api.patch(`/vehicles/${id}/mileage`, { mileage });
export const getAllAlerts = () => api.get('/vehicles/alerts/all');
export const getVehicleAlerts = (id) => api.get(`/vehicles/${id}/alerts`);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
export const sendReminder = (id, data) => api.post(`/vehicles/${id}/alerts/send-reminder`, data);
export const triggerAllReminders = () => api.post('/vehicles/alerts/trigger-reminders');
