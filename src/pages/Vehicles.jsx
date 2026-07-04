import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, updateMileage } from '../api/endpoints/vehicles';
import { getClients } from '../api/endpoints/clients';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import VehicleForm from '../components/vehicles/VehicleForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Vehicles = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles({ page: 1, limit: 20 }),
  });

  // Solo cargar la lista de clientes si el usuario NO es cliente
  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => getClients({ page: 1, limit: 100 }),
    enabled: !isClient,
  });

  const clients = Array.isArray(clientsData?.data?.data) ? clientsData.data.data : [];

  const mutation = useMutation({
    mutationFn: (vehicle) => editVehicle ? updateVehicle(editVehicle.id, vehicle) : createVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      setModalOpen(false);
      setEditVehicle(null);
      toast.success('Vehículo guardado');
    },
    onError: () => toast.error('Error al guardar vehículo'),
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar vehículo?')) {
      await deleteVehicle(id);
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Vehículo eliminado');
    }
  };

  const handleMileage = async (id) => {
    const mileage = prompt('Nuevo kilometraje:');
    if (mileage && !isNaN(mileage)) {
      await updateMileage(id, Number(mileage));
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Kilometraje actualizado');
    }
  };

  const vehicleList = Array.isArray(data?.data?.data) ? data.data.data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isClient ? 'Mis Vehículos' : 'Vehículos'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isClient
              ? 'Consulta el estado e historial de tus vehículos registrados'
              : 'Gestiona el inventario de vehículos de tus clientes'}
          </p>
        </div>
        {!isClient && (
          <Button variant="primary" onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Vehículo
          </Button>
        )}
      </div>

      {isLoading ? <LoadingSpinner /> : (
        vehicleList.length ? (
          <Table
            columns={isClient
              ? ['Marca', 'Modelo', 'Año', 'Placa', 'Kilometraje', 'Color']
              : ['Marca', 'Modelo', 'Año', 'Placa', 'Kilometraje', 'Cliente', 'Acciones']
            }
            data={vehicleList}
            renderRow={vehicle => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="px-4 py-3">{vehicle.brand}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3 font-mono font-semibold">{vehicle.licensePlate}</td>
                <td className="px-4 py-3">{vehicle.mileage?.toLocaleString()} km</td>
                {isClient ? (
                  <td className="px-4 py-3">{vehicle.color || '—'}</td>
                ) : (
                  <>
                    <td className="px-4 py-3">{vehicle.client?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => { setEditVehicle(vehicle); setModalOpen(true); }}>Editar</Button>
                        <Button variant="warning" size="sm" onClick={() => handleMileage(vehicle.id)}>Km</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(vehicle.id)}>Eliminar</Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            )}
          />
        ) : (
          <EmptyState
            message={isClient ? 'No tienes vehículos registrados' : 'No hay vehículos'}
            description={isClient ? 'Contacta al taller para registrar tu vehículo' : 'Comienza agregando vehículos al sistema'}
            icon="car"
            action={!isClient && (
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Agregar Vehículo
              </Button>
            )}
          />
        )
      )}

      {!isClient && (
        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditVehicle(null); }}
          title={editVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        >
          <VehicleForm
            defaultValues={editVehicle}
            onSubmit={mutation.mutate}
            loading={mutation.isPending}
            clients={clients}
          />
        </Modal>
      )}
    </div>
  );
};

export default Vehicles;
