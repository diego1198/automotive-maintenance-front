import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';

const maintenanceTypes = [
  'PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'OIL_CHANGE', 'TIRE_ROTATION', 'BRAKE_SERVICE', 'ENGINE_REPAIR', 'TRANSMISSION', 'ELECTRICAL', 'OTHER'
];

const maintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  workshopId: z.string().uuid(),
  mechanicId: z.string().uuid().optional(),
  type: z.string(),
  description: z.string().min(3),
  scheduledAt: z.string(),
  cost: z.number().min(0),
  observations: z.string().optional(),
  notes: z.string().optional(),
});

const MaintenanceForm = ({ defaultValues, onSubmit, loading, vehicles, workshops, mechanics }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select label="Vehículo*" {...register('vehicleId')} error={errors.vehicleId?.message}>
        <option value="">Selecciona un vehículo</option>
        {vehicles?.map(v => (
          <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licensePlate})</option>
        ))}
      </Select>
      <Select label="Taller*" {...register('workshopId')} error={errors.workshopId?.message}>
        <option value="">Selecciona un taller</option>
        {workshops?.map(w => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </Select>
      <Select label="Mecánico" {...register('mechanicId')} error={errors.mechanicId?.message}>
        <option value="">Sin asignar</option>
        {mechanics?.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </Select>
      <Select label="Tipo de mantenimiento*" {...register('type')} error={errors.type?.message}>
        <option value="">Selecciona tipo</option>
        {maintenanceTypes.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Select>
      <Input label="Descripción*" {...register('description')} error={errors.description?.message} />
      <Input label="Observaciones técnicas" {...register('observations')} error={errors.observations?.message} />
      <Input label="Notas adicionales" {...register('notes')} error={errors.notes?.message} />
      <Input label="Fecha y hora*" type="datetime-local" {...register('scheduledAt')} error={errors.scheduledAt?.message} />
      <Input label="Costo*" type="number" {...register('cost', { valueAsNumber: true })} error={errors.cost?.message} />
      <Button type="submit" variant="primary" disabled={isSubmitting || loading} className="w-full mt-4">
        {isSubmitting || loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

export default MaintenanceForm;
