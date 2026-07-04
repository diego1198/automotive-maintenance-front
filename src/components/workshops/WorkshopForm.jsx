import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';

const workshopSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  address: z.string().min(3, 'Mínimo 3 caracteres'),
  phone: z.string().min(10, 'Teléfono debe tener 10 dígitos'),
  email: z.string().email('Email inválido'),
  managerId: z.string().uuid(),
  capacity: z.number().min(1),
});

const WorkshopForm = ({ defaultValues, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workshopSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Nombre*" {...register('name')} error={errors.name?.message} />
      <Input label="Dirección*" {...register('address')} error={errors.address?.message} />
      <Input label="Teléfono*" {...register('phone')} error={errors.phone?.message} />
      <Input label="Email*" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Manager*" {...register('managerId')} error={errors.managerId?.message} />
      <Input label="Capacidad*" type="number" {...register('capacity', { valueAsNumber: true })} error={errors.capacity?.message} />
      <Button type="submit" variant="primary" disabled={isSubmitting || loading} className="w-full mt-4">
        {isSubmitting || loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

export default WorkshopForm;
