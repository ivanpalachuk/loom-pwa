# Loom PWA

PWA mobile-first con React, TypeScript, Tailwind CSS y capacidades de cámara.

## 🚀 Tecnologías

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS v4** - Estilos
- **React Router DOM** - Routing
- **TanStack Query (React Query)** - Gestión de estado del servidor
- **Camera API nativa** - Captura de fotos

## 📦 Instalación

```bash
npm install
```

## 🛠️ Scripts

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 📱 Funcionalidades

### ✅ Implementadas

- **Splash Screen** - Pantalla de bienvenida con animación
- **Login** - Autenticación básica con persistencia en localStorage
- **Routing** - Navegación protegida con React Router
- **Camera** - Captura de fotos usando la API nativa del navegador
- **React Query** - Configuración lista con ejemplos de queries y mutations
- **Responsive Design** - Mobile-first hasta tablets

### 🎯 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Splash.tsx      # Pantalla splash
│   ├── Login.tsx       # Formulario de login
│   └── Camera.tsx      # Componente de cámara
├── pages/              # Páginas/vistas
│   └── HomePage.tsx    # Página principal
├── hooks/              # Custom hooks
│   ├── useCamera.ts    # Hook para manejar la cámara
│   └── useQueries.ts   # Hooks de React Query
├── services/           # Servicios y API
│   └── api.ts         # Cliente API
├── App.tsx            # Componente principal con providers
└── main.tsx           # Entry point
```

## 🔌 API y React Query

El proyecto incluye ejemplos de uso de React Query:

### Queries (GET)
```typescript
import { usePhotos, useUser } from './hooks/useQueries';

// En tu componente
const { data: photos, isLoading, error } = usePhotos(userId);
const { data: user } = useUser(userId);
```

### Mutations (POST, PUT, DELETE)
```typescript
import { useUploadPhoto, useDeletePhoto } from './hooks/useQueries';

// En tu componente
const uploadMutation = useUploadPhoto();
const deleteMutation = useDeletePhoto();

// Usar
uploadMutation.mutate({ imageData, userId });
deleteMutation.mutate(photoId);
```

## 📸 Uso de la Cámara

```typescript
import Camera from './components/Camera';

// En tu componente
const [showCamera, setShowCamera] = useState(false);

<Camera
  onCapture={(imageData) => {
    console.log('Foto capturada:', imageData);
    // imageData es un base64 string
  }}
  onClose={() => setShowCamera(false)}
/>
```

## 🎨 Tailwind CSS

El proyecto usa Tailwind CSS v4 con el plugin de Vite. Los estilos están configurados en:
- `tailwind.config.js` - Configuración de Tailwind
- `src/index.css` - Import de Tailwind

### Breakpoints Responsivos
```css
/* Mobile first */
sm:  640px   /* Tablets pequeñas */
md:  768px   /* Tablets */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
```

## 🔐 Autenticación

Actualmente usa localStorage para simular autenticación:
- Login guarda `isAuthenticated: true`
- Las rutas están protegidas con Navigate
- Al recargar la página, mantiene la sesión

**TODO**: Reemplazar con autenticación real (JWT, OAuth, etc.)

## 📝 Notas de Desarrollo

### React Query - Configuración
- **staleTime**: 5 minutos - Tiempo antes de considerar datos obsoletos
- **gcTime**: 10 minutos - Tiempo de cache en memoria
- **retry**: 1 intento - Reintentos en caso de error

### Camera API
- Usa `facingMode: 'environment'` para cámara trasera por defecto
- Captura en formato JPEG con calidad 0.9
- Resolución ideal: 1920x1080

### Routing
- `/` - Redirecciona según estado de autenticación
- `/login` - Página de login
- `/home` - Página principal (protegida)
