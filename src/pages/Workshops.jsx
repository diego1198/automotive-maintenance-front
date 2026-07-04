import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../api/endpoints/workshops';
import WorkshopList from '../components/workshops/WorkshopList';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import WorkshopForm from '../components/workshops/WorkshopForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Workshops = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { data, isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: getWorkshops,
  });

  const mutation = useMutation({
    mutationFn: (workshop) => editWorkshop ? updateWorkshop(editWorkshop.id, workshop) : createWorkshop(workshop),
    onSuccess: () => {
      queryClient.invalidateQueries(['workshops']);
      setModalOpen(false);
      setEditWorkshop(null);
      toast.success('Taller guardado');
    },
    onError: () => toast.error('Error al guardar taller'),
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Desactivar taller?')) {
      await deleteWorkshop(id);
      queryClient.invalidateQueries(['workshops']);
      toast.success('Taller desactivado');
    }
  };

  const workshopList = Array.isArray(data?.data) ? data.data : [];

  return (
    <div>
      {isAdmin && (
        <div className="flex items-center justify-between mb-4">
          <Button variant="primary" onClick={() => setModalOpen(true)}>Nuevo Taller</Button>
        </div>
      )}
      {isLoading ? <LoadingSpinner /> : (
        workshopList.length ? (
          <WorkshopList workshops={workshopList} />
        ) : <EmptyState message="No hay talleres" />
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditWorkshop(null); }} title={editWorkshop ? 'Editar Taller' : 'Nuevo Taller'}>
        <WorkshopForm
          defaultValues={editWorkshop}
          onSubmit={mutation.mutate}
          loading={mutation.isLoading}
        />
      </Modal>
    </div>
  );
};

export default Workshops;
