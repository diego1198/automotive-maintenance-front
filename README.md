# Automotive Maintenance App

Sistema web PWA para gestión de mantenimientos automotrices.

## 🚗 Características
- Login y autenticación JWT
- Dashboard con estadísticas
- CRUD de clientes, vehículos, mantenimientos y talleres
- Agenda/calendario de citas
- Diseño moderno y responsive (Tailwind)
- Notificaciones toast
- PWA: offline, instalación y actualización automática

## 🛠️ Stack
- React 18 + Vite
- React Router DOM v6
- Tailwind CSS
- Axios + React Query
- React Hook Form + Zod
- Lucide React (iconos)
- date-fns
- React Hot Toast
- Vite PWA Plugin

## 🔗 Backend
- URL local: `http://localhost:3000/api`
- En Railway, define `VITE_API_URL` en el build con la URL pública de tu backend o usa un proxy same-origin hacia `/api`
- Credenciales demo: `admin@automotive.com / password123`

## 📦 Instalación

```bash
# Instala dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

## ⚙️ Variables de entorno
Copia `.env.example` a `.env` y ajusta si es necesario. Si despliegas con Docker, `VITE_API_URL` se resuelve en build.

## 🖥️ Estructura
- `src/api` - Configuración de axios y endpoints
- `src/context` - Contexto de autenticación
- `src/components` - Componentes reutilizables
- `src/pages` - Páginas principales
- `src/utils` - Utilidades y constantes
- `public/manifest.json` - Configuración PWA

## 📱 PWA
- Instalación desde navegador (icono en barra de direcciones)
- Funciona offline (cache de assets y API)
- Actualización automática

## 📝 Notas
- Prioridad: funcionalidad completa y UX profesional
- No incluye tests en esta fase
- Compatible con últimas versiones de Chrome, Firefox, Safari

---

¡Listo para usar y personalizar! 🚀
