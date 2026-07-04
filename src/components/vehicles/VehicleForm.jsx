import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';

const vehicleSchema = z.object({
  clientId: z.string().uuid(),
  brand: z.string().min(2),
  model: z.string().min(2),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(6),
  vin: z.string().optional(),
  color: z.string().optional(),
  mileage: z.number().min(0),
});

const VehicleForm = ({ defaultValues, onSubmit, loading, clients }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select label="Cliente*" {...register('clientId')} error={errors.clientId?.message}>
        <option value="">Selecciona un cliente</option>
        {clients?.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>
      <Input label="Marca*" {...register('brand')} error={errors.brand?.message} />
      <Input label="Modelo*" {...register('model')} error={errors.model?.message} />
      <Input label="Año*" type="number" {...register('year', { valueAsNumber: true })} error={errors.year?.message} />
      <Input label="Placa*" {...register('licensePlate')} error={errors.licensePlate?.message} />
      <Input label="VIN" {...register('vin')} error={errors.vin?.message} />
      <Input label="Color" {...register('color')} error={errors.color?.message} />
      <Input label="Kilometraje*" type="number" {...register('mileage', { valueAsNumber: true })} error={errors.mileage?.message} />
      <Button type="submit" variant="primary" disabled={isSubmitting || loading} className="w-full mt-4">
        {isSubmitting || loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

export default VehicleForm;
