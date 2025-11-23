# Portal de Reservas de Espacios

Sistema de gestión de reservas de espacios para bibliotecas, con visualización de planos interactivos y gestión en tiempo real.

## Características

- Sistema de reservas de espacios con diferentes tipos (aulas, cubículos, salas de estudio)
- Visualización interactiva de planos de planta con zoom y pan
- Gestión de disponibilidad en tiempo real
- Sistema de invitaciones para sesiones grupales
- Panel de administración completo
- Filtros avanzados por capacidad, equipamiento y disponibilidad
- Vista de calendario semanal
- Indicadores de privacidad para sesiones
- Generación de códigos QR para invitaciones
- Exportación de eventos a calendario (.ics)

## Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router 7
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Styling**: TailwindCSS 4
- **Animaciones**: Motion (Framer Motion)
- **Data Fetching**: TanStack Query
- **Testing**: Vitest + Testing Library
- **HTTP Client**: Axios

## Requisitos Previos

- Node.js 18+
- npm o pnpm

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd portal-reservas
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con los valores correspondientes:
```env
# Para desarrollo local con backend local
VITE_API_BASE_URL=http://localhost:3000

# Para desarrollo con API en producción
VITE_API_BASE_URL=https://api-cursos-reservas.onrender.com

VITE_POLL_INTERVAL_MS=30000
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Tests
npm run test          # Modo watch
npm run test:ui       # Con interfaz UI
npm run test:run      # Ejecución única
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── FloorPlan/   # Componentes del plano interactivo
│   ├── Spaces/      # Componentes de espacios
│   ├── admin/       # Componentes del panel admin
│   └── ui/          # Componentes UI base
├── features/        # Módulos por funcionalidad
│   ├── reservations/
│   └── spaces/
├── hooks/           # Custom hooks
├── layouts/         # Layouts de páginas
├── lib/             # Utilidades y helpers
├── pages/           # Páginas principales
├── stores/          # Estado global (Zustand)
└── types/           # Tipos TypeScript
```

## Configuración para Producción

### Variables de Entorno

Configura estas variables de entorno en tu plataforma de despliegue (Vercel/Netlify/etc.):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | `https://api-cursos-reservas.onrender.com` | URL del backend API |
| `VITE_POLL_INTERVAL_MS` | `30000` | Intervalo de polling en milisegundos |

**Importante**: En Vercel, estas variables se configuran en:
- Dashboard → Tu Proyecto → Settings → Environment Variables

### Build

```bash
npm run build
```

El build genera archivos estáticos en la carpeta `dist/` listos para ser desplegados.

## API Backend

Este proyecto requiere un backend compatible. Asegúrate de que tu backend exponga los siguientes endpoints:

- `GET /api/spaces` - Listar espacios
- `GET /api/spaces/:id` - Detalle de espacio
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations` - Listar reservas
- `DELETE /api/reservations/:id` - Cancelar reserva
- Y más endpoints según funcionalidad

## Despliegue

Ver sección de recomendaciones más abajo para opciones de despliegue.

## Testing

El proyecto incluye tests unitarios e de integración:

```bash
# Ejecutar todos los tests
npm run test

# Con interfaz visual
npm run test:ui

# Ejecución única (CI)
npm run test:run
```

## Licencia

Proyecto privado

## Contribución

Este es un proyecto académico/privado.
