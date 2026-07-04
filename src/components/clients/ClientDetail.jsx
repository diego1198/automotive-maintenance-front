import React from 'react';
import Card from '../common/Card';
import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../api/endpoints/clients';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const ClientDetail = ({ clientId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClient(clientId),
    enabled: !!clientId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data?.data) return <EmptyState message="Cliente no encontrado" />;

  const client = data.data;

  return (
    <Card>
      <h2 className="text-lg font-bold text-primary mb-2">{client.name}</h2>
      <div className="mb-2 text-secondary">Email: {client.email}</div>
      <div className="mb-2 text-secondary">Teléfono: {client.phone}</div>
      {client.address && <div className="mb-2 text-secondary">Dirección: {client.address}</div>}
      {/* Aquí podrías mostrar vehículos asociados, historial, etc. */}
    </Card>
  );
};

export default ClientDetail;
