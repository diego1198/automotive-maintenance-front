import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';

const clientSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono debe tener 10 dígitos'),
  address: z.string().optional(),
});

const ClientForm = ({ defaultValues, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Nombre*" {...register('name')} error={errors.name?.message} />
      <Input label="Email*" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Teléfono*" {...register('phone')} error={errors.phone?.message} />
      <Input label="WhatsApp (opcional: ej. +521...)" {...register('whatsappPhone')} error={errors.whatsappPhone?.message} />
      <Input label="Dirección" {...register('address')} error={errors.address?.message} />
      <Button type="submit" variant="primary" disabled={isSubmitting || loading} className="w-full mt-4">
        {isSubmitting || loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

export default ClientForm;
