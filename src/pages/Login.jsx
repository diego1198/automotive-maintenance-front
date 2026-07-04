import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login as loginApi } from '../api/endpoints/auth';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await loginApi(data);
      login(res.data.user, res.data.token);
      toast.success('¡Bienvenido!');
      window.location.href = '/dashboard';
    } catch (err) {
      // Error handled by axios interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-card p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">Iniciar sesión</h1>
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          autoFocus
        />
        <Input
          label="Contraseña"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full mt-4">
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
        <div className="text-center mt-4">
          <span className="text-sm text-secondary">¿No tienes una cuenta? </span>
          <Link to="/register" className="text-sm font-semibold text-primary hover:text-primary-700 transition-colors">
            Regístrate aquí
          </Link>
        </div>
        <p className="mt-4 text-xs text-secondary text-center">
          Credenciales demo: <br />admin@automotive.com / password123
        </p>
      </form>
    </div>
  );
};

export default Login;
