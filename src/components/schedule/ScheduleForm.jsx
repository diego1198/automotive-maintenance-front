import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';

const scheduleSchema = z.object({
  workshopId: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

const ScheduleForm = ({ defaultValues, onSubmit, loading, workshops }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('workshopId')} className="w-full mb-2 px-3 py-2 border rounded-lg">
        <option value="">Selecciona taller</option>
        {workshops?.map(w => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </select>
      <Input label="Fecha*" type="date" {...register('date')} error={errors.date?.message} />
      <Input label="Hora inicio*" type="time" {...register('startTime')} error={errors.startTime?.message} />
      <Input label="Hora fin*" type="time" {...register('endTime')} error={errors.endTime?.message} />
      <Button type="submit" variant="primary" disabled={isSubmitting || loading} className="w-full mt-4">
        {isSubmitting || loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

export default ScheduleForm;
