# CentroMundoX - Sistema de Reservas para Centro de Investigación

**CentroMundoX** es un centro de investigación de vanguardia que proporciona acceso a equipos de alta gama para estudiantes, investigadores y académicos. Este sistema web permite reservar espacios y equipos especializados para el desarrollo de tesis, proyectos de investigación y trabajos académicos innovadores.

## 🏢 Sobre CentroMundoX

### Equipos Disponibles

- **Computadores de Alto Rendimiento**: Estaciones Gaming/Workstation con Intel i9, RTX 4080/4090, 32GB+ RAM
- **Realidad Virtual**: Meta Quest Pro, HTC Vive Pro 2, controladores de precisión
- **Equipos Especializados**: Sensores IoT, equipos de medición, cámaras de alta resolución, instrumentos de laboratorio

### Usuarios Objetivo

- **Estudiantes de pregrado** desarrollando tesis
- **Estudiantes de postgrado** con proyectos de investigación
- **Investigadores académicos** requiriendo tecnología especializada
- **Equipos de investigación** necesitando espacios colaborativos

## 🚀 Tecnologías del Sistema

- **React 19.1.0** - Última versión con Server Components
- **Next.js 15.4.4** - Framework con App Router
- **TypeScript 5** - Tipado estático estricto
- **Tailwind CSS v4** - Estilos utilitarios modernos
- **Radix UI** - Componentes accesibles
- **Shadcn UI** - Sistema de componentes

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Sistema de autenticación
│   │   ├── login/         # Página de inicio de sesión
│   │   └── register/      # Página de registro
│   ├── dashboard/         # Panel de usuario
│   ├── layout.tsx         # Layout principal con error boundary
│   ├── page.tsx           # Landing page del centro
│   └── globals.css        # Estilos globales con design tokens
├── components/
│   ├── auth/              # Componentes de autenticación
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── logout-button.tsx
│   ├── dashboard/         # Componentes del dashboard
│   │   └── user-profile.tsx
│   ├── layout/            # Componentes de layout
│   │   ├── navbar.tsx     # Navegación principal
│   │   └── footer.tsx     # Footer corporativo
│   ├── sections/          # Secciones de la landing
│   │   ├── hero-section.tsx      # Presentación del centro
│   │   ├── values-section.tsx    # Pilares fundamentales
│   │   ├── about-section.tsx     # Equipos y espacios
│   │   └── cta-section.tsx       # Llamada a la acción
│   ├── ui/               # Componentes UI reutilizables
│   │   ├── button.tsx    # Botón con variantes
│   │   ├── error-boundary.tsx
│   │   └── loading.tsx   # Estados de carga
│   └── index.ts          # Exportaciones centralizadas
├── lib/
│   ├── auth.ts           # Lógica de autenticación
│   └── utils.ts          # Utilidades (cn, formatters)
└── types/
    ├── auth.ts           # Tipos de autenticación
    └── index.ts          # Interfaces TypeScript
```

## 🎨 Design System

### Colores Corporativos

- **Azul Principal**: `#1a365d` - Títulos y elementos principales
- **Naranja Principal**: `#ed8936` - Botones de acción y destacados
- **Azul Secundario**: `#2d3748` - Navegación y texto secundario
- **Gris**: `#4a5568` - Texto general

### Tipografía

- **Roboto**: Textos generales y contenido
- **Roboto Condensed**: Títulos y elementos destacados
- **Jerarquías**: Headliner (responsive), Titular (responsive), Subcopy (responsive)

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Agregar componente Shadcn
npm run ui:add [component-name]
```

## 📋 Características Implementadas

### ✅ Sistema de Autenticación

- Formularios de login y registro responsive
- Validación en tiempo real
- Navegación inteligente basada en estado
- Dashboard básico para usuarios

### ✅ Landing Page Especializada

- **Hero Section**: Presentación del centro de investigación
- **Values Section**: Pilares fundamentales (Tecnología, Investigación, Acceso)
- **About Section**: Información detallada sobre equipos disponibles
- **Equipment Showcase**: Catálogo visual de tecnología
- **CTA Section**: Llamada a reservar espacios para investigación

### ✅ React 19 & Next.js 15

- Server Components como patrón principal
- Async props pattern implementado
- Error boundaries modernos
- Suspense para loading states

### ✅ TypeScript Estricto

- Interfaces sobre types
- Propiedades readonly
- Const maps en lugar de enums
- Type safety completo

### ✅ Responsive Design

- Formularios completamente adaptables
- Grid responsive en formulario de registro
- Navbar con menú móvil funcional
- Secciones optimizadas para todos los dispositivos

### ✅ Performance

- Optimización de imágenes WebP/AVIF
- Compresión y minificación
- Split chunks optimizado
- Font loading optimizado

### ✅ Accesibilidad

- Focus styles para navegación por teclado
- Semantic HTML
- ARIA labels apropiados
- Contraste de colores cumple WCAG

### ✅ Seguridad

- Headers de seguridad configurados
- XSS protection
- Content type validation
- Frame options security

## 🎯 Manual de Marca

El diseño respeta **100%** el manual de marca corporativa de CentroMundoX:

- ✅ Colores corporativos exactos
- ✅ Tipografía oficial (Roboto y Roboto Condensed)
- ✅ Jerarquías tipográficas correctas
- ✅ Zona de seguridad del logo respetada
- ✅ Valores del centro destacados
- ✅ Proporciones cromáticas según especificación

## 🚧 Próximas Implementaciones

### Sistema de Reservas

- Calendario de disponibilidad de equipos
- Selección de equipos específicos
- Gestión de horarios y fechas
- Confirmación y seguimiento de reservas

### Dashboard Avanzado

- Historial de reservas del usuario
- Gestión de proyectos de investigación
- Perfil detallado de investigador
- Estadísticas de uso de equipos

### Panel Administrativo

- Gestión de equipos y espacios
- Control de usuarios y permisos
- Reportes y analíticas de uso
- Configuración del sistema

## 🚀 Desarrollo

Para comenzar el desarrollo:

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000)

## 📚 Documentación Adicional

- [Contexto del Centro de Investigación](./CONTEXTO-CENTROMUNDOX.md)
- [Documentación Frontend Completa](./DOCUMENTACION-FRONTEND.md)
- [Resumen de Cambios Responsive](./RESUMEN-CAMBIOS-RESPONSIVE.md)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

**CentroMundoX**: _Donde la investigación encuentra la tecnología del futuro._
