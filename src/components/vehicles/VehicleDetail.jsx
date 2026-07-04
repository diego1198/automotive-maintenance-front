import React from 'react';
import Card from '../common/Card';
import { useQuery } from '@tanstack/react-query';
import { getVehicle, getVehicleAlerts } from '../../api/endpoints/vehicles';
import { getMaintenanceHistory } from '../../api/endpoints/maintenances';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';

const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
    case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const VehicleDetail = ({ vehicleId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => getVehicle(vehicleId),
    enabled: !!vehicleId,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['vehicle-history', vehicleId],
    queryFn: () => getMaintenanceHistory(vehicleId),
    enabled: !!vehicleId,
  });

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['vehicle-alerts', vehicleId],
    queryFn: () => getVehicleAlerts(vehicleId),
    enabled: !!vehicleId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data?.data) return <EmptyState message="Vehículo no encontrado" />;

  const v = data.data;
  const history = historyData?.data || [];
  const analysis = alertsData?.data || { alerts: [], recommendations: [] };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-primary mb-4">{v.brand} {v.model}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Placa</p>
            <p className="text-secondary font-semibold">{v.licensePlate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Año</p>
            <p className="text-secondary font-semibold">{v.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Kilometraje</p>
            <p className="text-secondary font-semibold">{v.mileage} km</p>
          </div>
          {v.color && (
            <div>
              <p className="text-sm text-gray-500 font-medium">Color</p>
              <p className="text-secondary font-semibold">{v.color}</p>
            </div>
          )}
        </div>
      </Card>

      {!alertsLoading && (analysis.alerts.length > 0 || analysis.recommendations.length > 0) && (
        <Card className="border-l-4 border-yellow-500 shadow-md">
          <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Recomendaciones Preventivas
          </h3>
          {analysis.alerts.map((a, i) => (
            <div key={i} className="mb-2 text-sm text-red-700 bg-red-50 p-2 rounded">
              <strong>Atención:</strong> {a.message}
            </div>
          ))}
          {analysis.recommendations.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Servicios sugeridos:</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100 flex gap-2">
                    <span className="font-bold text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded text-xs">
                      {rec.type}
                    </span>
                    <span className="text-gray-700">{rec.reasons.join(', ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-bold text-primary mb-4">Historial de Mantenimientos</h3>
        {historyLoading ? (
          <LoadingSpinner />
        ) : history.length === 0 ? (
          <EmptyState message="No hay mantenimientos registrados" />
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-3">
            {history.map((m) => (
              <div key={m.id} className="mb-6 ml-6">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] mt-1.5 ${getStatusColor(m.status).split(' ')[0]} border-2 border-white`} />
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusColor(m.status)}`}>
                        {m.status}
                      </span>
                      <h4 className="font-bold text-gray-800">{m.type}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {formatDate(m.scheduledAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{m.description}</p>
                  
                  {(m.observations || m.notes) && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md border-l-4 border-red-400">
                      <h5 className="text-xs font-bold text-red-800 uppercase mb-1">Observaciones / Fallas Reportadas</h5>
                      <p className="text-sm text-red-700 whitespace-pre-wrap">
                        {m.observations || m.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-gray-500 flex gap-4">
                    <span><strong>Taller:</strong> {m.workshop?.name}</span>
                    <span><strong>Técnico:</strong> {m.mechanic?.name}</span>
                    {m.cost > 0 && <span><strong>Costo:</strong> ${m.cost}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default VehicleDetail;
