import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useQuery } from '@tanstack/react-query';
import { getMaintenance } from '../../api/endpoints/maintenances';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { format } from 'date-fns';

const MaintenanceDetail = ({ maintenanceId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['maintenance', maintenanceId],
    queryFn: () => getMaintenance(maintenanceId),
    enabled: !!maintenanceId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data?.data) return <EmptyState message="Mantenimiento no encontrado" />;

  const m = data.data;

  return (
    <Card>
      <h2 className="text-lg font-bold text-primary mb-2">{m.type}</h2>
      <Badge status={m.status} />
      <div className="mb-2 text-secondary">Vehículo: {m.vehicle?.licensePlate}</div>
      <div className="mb-2 text-secondary">Taller: {m.workshop?.name}</div>
      <div className="mb-2 text-secondary">Fecha: {format(new Date(m.scheduledAt), 'dd/MM/yyyy HH:mm')}</div>
      <div className="mb-2 text-secondary">Descripción: {m.description}</div>
      <div className="mb-2 text-secondary">Costo: ${m.cost}</div>
      {/* Aquí podrías mostrar notas, historial de cambios, etc. */}
    </Card>
  );
};

export default MaintenanceDetail;
