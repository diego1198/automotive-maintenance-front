import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { format } from 'date-fns';

const MaintenanceCard = ({ maintenance }) => (
  <Card className="mb-2">
    <div className="flex flex-col gap-1">
      <span className="font-bold text-primary text-lg">{maintenance.type}</span>
      <span className="text-secondary text-sm">Vehículo: {maintenance.vehicle?.licensePlate}</span>
      <span className="text-secondary text-sm">Taller: {maintenance.workshop?.name}</span>
      <span className="text-secondary text-sm">Fecha: {format(new Date(maintenance.scheduledAt), 'dd/MM/yyyy HH:mm')}</span>
      <Badge status={maintenance.status} />
    </div>
  </Card>
);

export default MaintenanceCard;
