import api from '../axios';

export const getMaintenances = (params) => api.get('/maintenances', { params });
export const getMaintenance = (id) => api.get(`/maintenances/${id}`);
export const getMaintenanceHistory = (vehicleId) => api.get(`/maintenances/vehicle/${vehicleId}`);
export const getStatsByWorkshop = (workshopId, startDate, endDate) => api.get('/maintenances/stats/workshop', { params: { workshopId, startDate, endDate }});
export const getUpcomingMaintenances = (workshopId, days) => api.get(`/maintenances/upcoming`, { params: { workshopId, days } });
export const createMaintenance = (data) => api.post('/maintenances', data);
export const updateMaintenance = (id, data) => api.put(`/maintenances/${id}`, data);
export const updateStatus = (id, status, notes, cost) => api.patch(`/maintenances/${id}/status`, { status, notes, cost });
export const cancelMaintenance = (id) => api.patch(`/maintenances/${id}/cancel`);
export const submitSurvey = (id, data) => api.patch(`/maintenances/${id}/survey`, data);
