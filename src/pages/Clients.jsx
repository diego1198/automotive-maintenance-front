import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, deleteClient, updateClient, searchClients } from '../api/endpoints/clients';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ClientForm from '../components/clients/ClientForm';
import ClientCard from '../components/clients/ClientCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import useDebounce from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const Clients = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['clients', debouncedSearch],
    queryFn: () => debouncedSearch ? searchClients(debouncedSearch) : getClients({ page: 1, limit: 10 }),
  });

  const mutation = useMutation({
    mutationFn: (client) => editClient ? updateClient(editClient.id, client) : createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      setModalOpen(false);
      setEditClient(null);
      toast.success('Cliente guardado');
    },
    onError: () => toast.error('Error al guardar cliente'),
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar cliente?')) {
      await deleteClient(id);
      queryClient.invalidateQueries(['clients']);
      toast.success('Cliente eliminado');
    }
  };

  // Determina si es búsqueda o listado paginado
  const clientList = debouncedSearch
    ? (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [])
    : Array.isArray(data?.data?.data) ? data.data.data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-600 mt-1">Gestiona la información de tus clientes</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : clientList.length ? (
        <Table
          columns={["Nombre", "Email", "Teléfono", "Acciones"]}
          data={clientList}
          renderRow={client => (
            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-medium text-sm">
                      {client.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.email}</div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.phone}</div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setEditClient(client); setModalOpen(true); }}
                    className="flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                    className="flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      ) : (
        <EmptyState 
          message="No hay clientes" 
          description="Comienza agregando nuevos clientes a tu sistema"
          icon="users"
          action={
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Agregar Primer Cliente
            </Button>
          }
        />
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditClient(null); }} title={editClient ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <ClientForm
          defaultValues={editClient}
          onSubmit={mutation.mutate}
          loading={mutation.isLoading}
        />
      </Modal>
    </div>
  );
};

export default Clients;
