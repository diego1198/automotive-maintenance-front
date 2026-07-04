import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWorkshops } from '../../api/endpoints/workshops';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const WorkshopList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: getWorkshops,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data?.data?.length) return <EmptyState message="No hay talleres" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.data.map(w => (
        <Card key={w.id}>
          <div className="font-bold text-primary text-lg">{w.name}</div>
          <div className="text-secondary">Dirección: {w.address}</div>
          <div className="text-secondary">Teléfono: {w.phone}</div>
          <div className="text-secondary">Capacidad: {w.capacity}</div>
          <div className="text-secondary">Manager: {w.managerId}</div>
        </Card>
      ))}
    </div>
  );
};

export default WorkshopList;
