import api from '../axios';

export const getAvailableSchedules = (workshopId, date) => api.get('/schedules/available', { params: { workshopId, date } });
export const getSchedulesRange = (workshopId, startDate, endDate) => api.get('/schedules/range', { params: { workshopId, startDate, endDate } });
export const createSchedule = (data) => api.post('/schedules', data);
export const createBulkSchedules = (data) => api.post('/schedules/bulk', data);
export const generateWeekSchedules = (data) => api.post('/schedules/generate-week', data);
export const toggleSchedule = (id) => api.patch(`/schedules/${id}/toggle`);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);
