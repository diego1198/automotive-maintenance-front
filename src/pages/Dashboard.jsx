import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients } from '../api/endpoints/clients';
import { getVehicles, getAllAlerts, sendReminder, triggerAllReminders } from '../api/endpoints/vehicles';
import { getMaintenances, getUpcomingMaintenances } from '../api/endpoints/maintenances';
import { getSatisfactionAndRetention } from '../api/endpoints/metrics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart2, Car, Wrench, Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';

// ───── Vista para Administradores / Mecánicos ─────
const AdminDashboard = () => {
  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients({ page: 1, limit: 1 }),
  });
  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles({ page: 1, limit: 1 }),
  });
  const { data: maintenances, isLoading: loadingMaintenances } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => getMaintenances({ page: 1, limit: 10, status: 'SCHEDULED' }),
  });
  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['upcoming'],
    queryFn: () => getUpcomingMaintenances(undefined, 7),
  });
  const { data: alertsRes, isLoading: loadingAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getAllAlerts(),
  });
  const { data: metricsRes, isLoading: loadingMetrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => getSatisfactionAndRetention(),
  });

  const queryClient = useQueryClient();

  const sendReminderMutation = useMutation({
    mutationFn: ({ vehicleId, serviceType, reason }) => sendReminder(vehicleId, { serviceType, reason }),
    onSuccess: () => {
      alert('Recordatorio enviado con éxito por WhatsApp');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error) => {
      alert(`Error al enviar recordatorio: ${error.response?.data?.error || error.message}`);
    }
  });

  const triggerAllMutation = useMutation({
    mutationFn: () => triggerAllReminders(),
    onSuccess: (res) => {
      const data = res.data;
      alert(`Campaña de recordatorios procesada.\nEnviados: ${data.sentCount}\nOmitidos: ${data.skippedCount}`);
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error) => {
      alert(`Error al ejecutar campaña: ${error.response?.data?.error || error.message}`);
    }
  });


  const totalClients = clients?.data?.pagination?.total || 0;
  const totalVehicles = vehicles?.data?.pagination?.total || 0;
  const pendingMaintenances = maintenances?.data?.pagination?.total || 0;
  const todayMaintenances = Array.isArray(maintenances?.data?.data)
    ? maintenances.data.data.filter(m => format(new Date(m.scheduledAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length
    : 0;

  const statusCounts = Array.isArray(maintenances?.data?.data)
    ? maintenances.data.data.reduce((acc, m) => {
        acc[m.status] = (acc[m.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Clientes</span>
            <span className="text-2xl font-bold text-primary">{loadingClients ? <LoadingSpinner /> : totalClients}</span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Vehículos</span>
            <span className="text-2xl font-bold text-primary">{loadingVehicles ? <LoadingSpinner /> : totalVehicles}</span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Pendientes</span>
            <span className="text-2xl font-bold text-warning">{loadingMaintenances ? <LoadingSpinner /> : pendingMaintenances}</span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Hoy</span>
            <span className="text-2xl font-bold text-success">{loadingMaintenances ? <LoadingSpinner /> : todayMaintenances}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <h2 className="text-lg font-semibold text-primary mb-4">Próximos mantenimientos (7 días)</h2>
          {loadingUpcoming ? <LoadingSpinner /> : (
            <ul>
              {(upcoming?.data ?? []).map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <span>{m.vehicle?.licensePlate} - {m.type}</span>
                  <Badge status={m.status} />
                  <span className="text-sm">{format(new Date(m.scheduledAt), 'dd/MM/yyyy HH:mm')}</span>
                </li>
              ))}
              {(upcoming?.data?.length === 0) && <p className="text-gray-500">No hay mantenimientos próximos</p>}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Alertas Preventivas y Mensajería
            </h2>
            {(alertsRes?.data?.length > 0) && (
              <button
                onClick={() => {
                  if (window.confirm('¿Desea enviar recordatorios por WhatsApp a todos los clientes con alertas pendientes de hoy?')) {
                    triggerAllMutation.mutate();
                  }
                }}
                disabled={triggerAllMutation.isPending}
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2.5 rounded shadow transition duration-200 disabled:opacity-50"
              >
                {triggerAllMutation.isPending ? 'Enviando...' : 'Enviar todos hoy'}
              </button>
            )}
          </div>
          {loadingAlerts ? <LoadingSpinner /> : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {(alertsRes?.data ?? []).map((vehicleAlert, idx) => {
                const overdueAlert = vehicleAlert.alerts.find(a => a.type === 'OVERDUE_SERVICE');
                const lastLogs = vehicleAlert.notificationLogs || [];

                return (
                  <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-3 rounded shadow-sm space-y-2">
                    <h3 className="font-bold text-red-800 text-sm">{vehicleAlert.vehicle.brand} {vehicleAlert.vehicle.model} ({vehicleAlert.vehicle.licensePlate})</h3>
                    
                    <div className="space-y-2">
                      {overdueAlert && overdueAlert.details && overdueAlert.details.map((rec, i) => {
                        const logForService = lastLogs.find(l => l.serviceType === rec.type);
                        const isRecentlySent = logForService && (new Date() - new Date(logForService.sentAt)) / (1000 * 60 * 60 * 24) < 30;

                        return (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-2 rounded border border-red-100 gap-2 text-xs">
                            <div className="flex-1">
                              <span className="font-bold text-red-950 block">
                                {rec.type === 'OIL_CHANGE' ? 'Cambio de Aceite' : rec.type === 'TIRE_ROTATION' ? 'Rotación de Llantas' : 'Mantenimiento Preventivo'}
                              </span>
                              <span className="text-gray-600">{rec.reasons.join(', ')}</span>
                              {logForService && (
                                <span className="text-[10px] text-gray-500 block mt-0.5">
                                  Notificado: {format(new Date(logForService.sentAt), 'dd/MM/yyyy HH:mm')}
                                </span>
                              )}
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  const reason = rec.reasons.join(', ');
                                  if (window.confirm(`¿Desea enviar recordatorio de ${rec.type} a este cliente por WhatsApp?`)) {
                                    sendReminderMutation.mutate({
                                      vehicleId: vehicleAlert.vehicle.id,
                                      serviceType: rec.type,
                                      reason
                                    });
                                  }
                                }}
                                disabled={sendReminderMutation.isPending || isRecentlySent}
                                className={`font-semibold py-1 px-2 rounded transition text-[10px] ${
                                  isRecentlySent 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                              >
                                {isRecentlySent ? 'Enviado' : 'Enviar WhatsApp'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      
                      {(!overdueAlert || !overdueAlert.details) && vehicleAlert.alerts.map((a, i) => (
                        <p key={i} className="text-xs text-red-700 font-medium">⚠️ {a.message}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
              {(alertsRes?.data?.length === 0) && <p className="text-gray-500 text-sm">No hay alertas preventivas pendientes</p>}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><BarChart2 /> Mantenimientos por estado</h2>
          <div className="flex gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex flex-col items-center">
                <Badge status={status} />
                <span className="mt-2 text-secondary font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg>
            Métricas de Satisfacción y Retención
          </h2>
          {loadingMetrics ? <LoadingSpinner /> : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded text-center">
                <p className="text-sm text-blue-600 font-bold mb-1">Satisfacción Promedio</p>
                <p className="text-3xl font-black text-blue-800">{metricsRes?.data?.averageSatisfaction || 0} <span className="text-lg">/ 5</span></p>
                <p className="text-xs text-blue-500 mt-2">Basado en {metricsRes?.data?.totalSurveys || 0} encuestas</p>
              </div>
              <div className="bg-green-50 p-4 rounded text-center">
                <p className="text-sm text-green-600 font-bold mb-1">Retención de Clientes</p>
                <p className="text-3xl font-black text-green-800">{metricsRes?.data?.retentionRate || 0}%</p>
                <p className="text-xs text-green-500 mt-2">{metricsRes?.data?.returningVehicles} vehículos de {metricsRes?.data?.totalVehiclesWithService}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ───── Vista para Clientes ─────
const ClientDashboard = () => {
  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: () => getVehicles({ page: 1, limit: 10 }),
  });
  const { data: maintenances, isLoading: loadingMaintenances } = useQuery({
    queryKey: ['my-maintenances'],
    queryFn: () => getMaintenances({ page: 1, limit: 5, status: 'SCHEDULED' }),
  });
  const { data: alertsRes, isLoading: loadingAlerts } = useQuery({
    queryKey: ['my-alerts'],
    queryFn: () => getAllAlerts(),
  });

  const myVehicles = Array.isArray(vehicles?.data?.data) ? vehicles.data.data : [];
  const myMaintenances = Array.isArray(maintenances?.data?.data) ? maintenances.data.data : [];
  const myAlerts = Array.isArray(alertsRes?.data) ? alertsRes.data : [];

  const completedCount = myMaintenances.filter(m => m.status === 'COMPLETED').length;
  const scheduledCount = myMaintenances.filter(m => m.status === 'SCHEDULED').length;

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Car size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary">Mis Vehículos</p>
              <p className="text-2xl font-bold text-primary">
                {loadingVehicles ? <LoadingSpinner /> : myVehicles.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-secondary">Citas Pendientes</p>
              <p className="text-2xl font-bold text-amber-600">
                {loadingMaintenances ? <LoadingSpinner /> : scheduledCount}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-secondary">Alertas Activas</p>
              <p className="text-2xl font-bold text-red-600">
                {loadingAlerts ? <LoadingSpinner /> : myAlerts.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mis vehículos */}
        <Card>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Car size={20} /> Mis Vehículos
          </h2>
          {loadingVehicles ? <LoadingSpinner /> : myVehicles.length === 0 ? (
            <p className="text-gray-500 text-sm">No tienes vehículos registrados aún.</p>
          ) : (
            <ul className="space-y-3">
              {myVehicles.map(v => (
                <li key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{v.brand} {v.model} ({v.year})</p>
                    <p className="text-xs text-gray-500">Placa: {v.licensePlate} · {v.mileage?.toLocaleString()} km</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{v.color || '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Próximas citas */}
        <Card>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Wrench size={20} /> Próximas Citas de Mantenimiento
          </h2>
          {loadingMaintenances ? <LoadingSpinner /> : myMaintenances.length === 0 ? (
            <p className="text-gray-500 text-sm">No tienes mantenimientos programados.</p>
          ) : (
            <ul className="space-y-3">
              {myMaintenances.map(m => (
                <li key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{m.type} — {m.vehicle?.licensePlate}</p>
                    <p className="text-xs text-gray-500">{m.workshop?.name} · {format(new Date(m.scheduledAt), 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                  <Badge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Alertas preventivas del cliente */}
      {myAlerts.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <Bell size={20} /> Alertas y Recomendaciones para tus Vehículos
          </h2>
          <div className="space-y-4">
            {myAlerts.map((vehicleAlert, idx) => (
              <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-red-800 text-sm mb-2">
                  {vehicleAlert.vehicle.brand} {vehicleAlert.vehicle.model} ({vehicleAlert.vehicle.licensePlate})
                </h3>
                <ul className="list-disc ml-5 text-sm text-red-700 space-y-1">
                  {vehicleAlert.alerts.map((a, i) => (
                    <li key={i}>{a.message}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ───── Dashboard principal (router por rol) ─────
const Dashboard = () => {
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  return isClient ? <ClientDashboard /> : <AdminDashboard />;
};

export default Dashboard;
