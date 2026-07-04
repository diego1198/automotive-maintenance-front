import { format } from 'date-fns';

export const formatDate = (date, fmt = 'dd/MM/yyyy') => format(new Date(date), fmt);
export const formatDateTime = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm');
export const formatCurrency = (value) => `$${Number(value).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
