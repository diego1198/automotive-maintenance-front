import React from 'react';
import Card from '../common/Card';

const VehicleCard = ({ vehicle }) => (
  <Card className="mb-2">
    <div className="flex flex-col gap-1">
      <span className="font-bold text-primary text-lg">{vehicle.brand} {vehicle.model}</span>
      <span className="text-secondary text-sm">Placa: {vehicle.licensePlate}</span>
      <span className="text-secondary text-sm">Año: {vehicle.year}</span>
      <span className="text-secondary text-sm">Kilometraje: {vehicle.mileage} km</span>
      {vehicle.color && <span className="text-secondary text-sm">Color: {vehicle.color}</span>}
    </div>
  </Card>
);

export default VehicleCard;
