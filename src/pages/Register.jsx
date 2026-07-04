import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerApi } from '../api/endpoints/auth';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  address: z.string().optional(),
});

const Register = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      // Forzar rol CLIENT para el registro público
      const payload = {
        ...data,
        role: 'CLIENT',
      };
      const res = await registerApi(payload);
      login(res.data.user, res.data.token);
      toast.success('¡Registro exitoso y cuenta vinculada!');
      window.location.href = '/dashboard';
    } catch (err) {
      // El error es manejado por el interceptor de axios (muestra toast del error retornado por backend)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-card">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-primary">
            Crear cuenta de Cliente
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            Registra tus datos para ver el estado de tus vehículos y mantenimientos.
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nombre Completo"
            type="text"
            placeholder="Juan Pérez"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="cliente@email.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="******"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Teléfono Móvil (requerido para WhatsApp)"
            type="text"
            placeholder="0998765432"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Dirección"
            type="text"
            placeholder="Av. Amazonas y Colón, Quito"
            {...register('address')}
            error={errors.address?.message}
          />

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full mt-6">
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-sm text-secondary">¿Ya tienes una cuenta? </span>
            <Link to="/login" className="text-sm font-semibold text-primary hover:text-primary-700 transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
