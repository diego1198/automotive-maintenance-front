import React from 'react';
import Card from '../common/Card';

const WorkshopCard = ({ workshop }) => (
  <Card className="mb-2">
    <div className="flex flex-col gap-1">
      <span className="font-bold text-primary text-lg">{workshop.name}</span>
      <span className="text-secondary text-sm">Dirección: {workshop.address}</span>
      <span className="text-secondary text-sm">Teléfono: {workshop.phone}</span>
      <span className="text-secondary text-sm">Capacidad: {workshop.capacity}</span>
      <span className="text-secondary text-sm">Manager: {workshop.managerId}</span>
    </div>
  </Card>
);

export default WorkshopCard;
