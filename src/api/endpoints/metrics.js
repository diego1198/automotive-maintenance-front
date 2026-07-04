import api from '../axios';

export const getSatisfactionAndRetention = () => api.get('/metrics/satisfaction-retention');