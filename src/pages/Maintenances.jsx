import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMaintenances,
  createMaintenance,
  updateMaintenance,
  updateStatus,
  cancelMaintenance,
  submitSurvey,
} from '../api/endpoints/maintenances';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import MaintenanceForm from '../components/maintenances/MaintenanceForm';
import SatisfactionSurveyModal from '../components/maintenances/SatisfactionSurveyModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

const Maintenances = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMaintenance, setEditMaintenance] = useState(null);
  const [surveyTarget, setSurveyTarget] = useState(null); // mantenimiento a calificar
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  const { data, isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => getMaintenances({ page: 1, limit: 20 }),
  });

  // Mutación para crear / editar (solo admin/mecánico)
  const mutation = useMutation({
    mutationFn: (maintenance) =>
      editMaintenance
        ? updateMaintenance(editMaintenance.id, maintenance)
        : createMaintenance(maintenance),
    onSuccess: () => {
      queryClient.invalidateQueries(['maintenances']);
      setModalOpen(false);
      setEditMaintenance(null);
      toast.success('Mantenimiento guardado');
    },
    onError: () => toast.error('Error al guardar mantenimiento'),
  });

  // Mutación para encuesta de satisfacción
  const surveyMutation = useMutation({
    mutationFn: ({ id, data }) => submitSurvey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['maintenances']);
      setSurveyTarget(null);
      toast.success('¡Gracias por tu calificación!');
    },
    onError: () => toast.error('Error al enviar calificación'),
  });

  const handleStatus = async (id, status) => {
    await updateStatus(id, status);
    queryClient.invalidateQueries(['maintenances']);
    toast.success('Estado actualizado');
  };

  const handleCancel = async (id) => {
    if (window.confirm('¿Cancelar mantenimiento?')) {
      await cancelMaintenance(id);
      queryClient.invalidateQueries(['maintenances']);
      toast.success('Mantenimiento cancelado');
    }
  };

  const maintenanceList = Array.isArray(data?.data?.data) ? data.data.data : [];

  const columns = isClient
    ? ['Tipo', 'Vehículo', 'Taller', 'Fecha', 'Estado', 'Calificación']
    : ['Tipo', 'Vehículo', 'Taller', 'Fecha', 'Estado', 'Acciones'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isClient ? 'Mis Mantenimientos' : 'Mantenimientos'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isClient
              ? 'Historial y estado de los servicios de tus vehículos'
              : 'Gestiona los servicios de mantenimiento registrados'}
          </p>
        </div>
        {!isClient && (
          <Button variant="primary" onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Mantenimiento
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : maintenanceList.length ? (
          <Table
            columns={columns}
            data={maintenanceList}
            renderRow={(m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                <td className="px-3 py-3 whitespace-nowrap font-medium">{m.type}</td>
                <td className="px-3 py-3 whitespace-nowrap">{m.vehicle?.licensePlate}</td>
                <td className="px-3 py-3 whitespace-nowrap">{m.workshop?.name}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {format(new Date(m.scheduledAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <Badge status={m.status} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {isClient ? (
                    // Vista cliente: mostrar calificación existente o botón para calificar
                    m.status === 'COMPLETED' ? (
                      m.satisfactionScore ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              size={14}
                              className={s <= m.satisfactionScore
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200 fill-gray-200'
                              }
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({m.satisfactionScore}/5)</span>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSurveyTarget(m)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Star size={12} />
                          Calificar
                        </Button>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )
                  ) : (
                    // Vista admin/mecánico: acciones completas
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setEditMaintenance(m); setModalOpen(true); }}
                      >
                        Editar
                      </Button>
                      {m.status === 'SCHEDULED' && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleStatus(m.id, 'IN_PROGRESS')}
                        >
                          Iniciar
                        </Button>
                      )}
                      {m.status === 'IN_PROGRESS' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatus(m.id, 'COMPLETED')}
                        >
                          Completar
                        </Button>
                      )}
                      {['SCHEDULED', 'IN_PROGRESS'].includes(m.status) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(m.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState
            message={isClient ? 'No tienes mantenimientos registrados' : 'No hay mantenimientos'}
            description={isClient ? 'Contacta al taller para agendar un servicio' : 'Comienza registrando mantenimientos'}
            icon="wrench"
            action={!isClient && (
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Nuevo Mantenimiento
              </Button>
            )}
          />
        )}
      </div>

      {/* Modal crear/editar (solo admin/mecánico) */}
      {!isClient && (
        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditMaintenance(null); }}
          title={editMaintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
        >
          <MaintenanceForm
            defaultValues={editMaintenance}
            onSubmit={mutation.mutate}
            loading={mutation.isPending}
          />
        </Modal>
      )}

      {/* Modal encuesta satisfacción (clientes) */}
      <SatisfactionSurveyModal
        open={!!surveyTarget}
        onClose={() => setSurveyTarget(null)}
        onSubmit={(surveyData) =>
          surveyMutation.mutate({ id: surveyTarget.id, data: surveyData })
        }
        loading={surveyMutation.isPending}
        maintenanceSummary={
          surveyTarget
            ? `${surveyTarget.type} — ${surveyTarget.vehicle?.licensePlate} (${format(new Date(surveyTarget.scheduledAt), 'dd/MM/yyyy')})`
            : ''
        }
      />
    </div>
  );
};

export default Maintenances;