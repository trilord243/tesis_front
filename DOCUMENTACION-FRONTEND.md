# Documentación Frontend - CentroMundoX

## 🏢 Contexto del Proyecto

### ¿Qué es CentroMundoX?

**CentroMundoX** es un **centro de investigación de vanguardia** que proporciona acceso a equipos de alta gama para estudiantes, investigadores y académicos. El centro está equipado con tecnología de última generación que incluye:

#### 🖥️ Equipos Disponibles

**Computadores de Alto Rendimiento:**

- Estaciones de trabajo Gaming/Workstation
- Procesadores Intel i9 / AMD Ryzen 9
- 32GB+ RAM DDR5
- GPU RTX 4080/4090
- Almacenamiento SSD NVMe de alta velocidad

**Realidad Virtual y Aumentada:**

- Meta Quest Pro
- HTC Vive Pro 2
- Controladores de precisión
- Software especializado para investigación VR/AR

**Equipos Especializados:**

- Sensores IoT avanzados
- Equipos de medición científica
- Cámaras de alta resolución
- Instrumentos de laboratorio especializados

#### 🎯 Propósito del Sistema

El sistema web de CentroMundoX permite:

- **Reserva de Espacios:** Para desarrollo de tesis de pregrado y postgrado
- **Acceso a Equipos:** Reserva de equipos específicos para proyectos
- **Gestión de Investigaciones:** Coordinación de proyectos académicos
- **Colaboración:** Espacios para trabajo en equipo e investigación colaborativa

#### 👥 Usuarios Objetivo

- **Estudiantes de pregrado** desarrollando tesis
- **Estudiantes de postgrado** con proyectos de investigación
- **Investigadores académicos** requiriendo tecnología especializada
- **Equipos de investigación** necesitando espacios colaborativos

## 🚀 Tecnologías Utilizadas

### Stack Principal

- **Framework:** Next.js 15 (App Router)
- **Runtime:** React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes:** Shadcn UI + Radix UI
- **Autenticación:** Sistema personalizado con cookies

### Arquitectura del Proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Panel de usuario
│   └── page.tsx           # Landing page
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   ├── layout/           # Layout components (navbar, footer)
│   ├── sections/         # Secciones de la landing
│   └── ui/               # Componentes UI base
├── lib/                  # Utilidades y configuración
└── types/                # Definiciones de tipos TypeScript
```

## 🎨 Diseño y Branding

### Colores Corporativos

```css
:root {
  --brand-primary: #1a365d; /* Azul corporativo */
  --brand-secondary: #2d3748; /* Gris oscuro */
  --brand-orange: #ed8936; /* Naranja corporativo */
  --brand-gray: #4a5568; /* Gris texto */
}
```

### Tipografía

- **Títulos principales:** Roboto Condensed (font-black)
- **Texto general:** Roboto (font-normal)
- **Elementos UI:** System fonts para mejor rendimiento

### Responsive Design

- **Mobile:** < 640px (base)
- **Tablet:** 640px - 1024px (sm:)
- **Desktop:** > 1024px (lg:, xl:)

## 🧩 Componentes Principales

### Landing Page

#### HeroSection

- **Propósito:** Presentación principal del centro de investigación
- **Elementos:** Título, descripción, botones CTA, visual corporativo
- **CTA Buttons:** "Reservar Espacio" y "Ver Equipos"

#### ValuesSection

- **Propósito:** Pilares fundamentales del centro
- **Valores:**
  - **Tecnología de Vanguardia:** Equipos de última generación
  - **Investigación de Calidad:** Espacios optimizados para tesis
  - **Acceso Democratizado:** Tecnología accesible para estudiantes

#### AboutSection

- **Propósito:** Información detallada sobre equipos y espacios
- **Secciones:**
  - Descripción de equipos disponibles
  - Información sobre espacios para tesis
  - Showcase detallado de equipos específicos

#### EquipmentShowcase

- **Propósito:** Catálogo visual de equipos disponibles
- **Categorías:**
  - Computadores Gaming/Workstation
  - Equipos de Realidad Virtual
  - Equipos Especializados de Investigación

#### CTASection

- **Propósito:** Llamada final a la acción
- **Mensaje:** "¿Listo para tu Investigación?"
- **Enfoque:** Reserva de espacios para tesis y proyectos académicos

### Sistema de Autenticación

#### LoginForm & RegisterForm

- **Diseño:** HTML nativo con Tailwind CSS (sin Shadcn UI)
- **Responsive:** Grid adaptativo para diferentes pantallas
- **Validación:** Validación en tiempo real
- **UX:** Espaciado generoso y inputs de gran tamaño

#### Navbar

- **Funcionalidad:** Navegación inteligente basada en autenticación
- **Estados:**
  - **No autenticado:** Inicio, Reservas, Contacto, "Reservar Ahora"
  - **Autenticado:** Inicio, Dashboard
- **Mobile:** Menú hamburguesa funcional

## 📱 Mejoras de UX Implementadas

### Responsive Design

- Formularios completamente adaptables
- Grid responsive en formulario de registro
- Navbar con menú móvil funcional
- Secciones optimizadas para todos los dispositivos

### Interactividad

- Transiciones suaves (`transition-all duration-200`)
- Efectos hover en botones y cards
- Feedback visual en elementos interactivos
- Animaciones sutiles para mejor experiencia

### Accesibilidad

- Contraste adecuado en todos los elementos
- Navegación por teclado
- Textos descriptivos y semánticos
- Estructura HTML semántica

## 🔧 Configuración Técnica

### Next.js 15 Características

```typescript
// Uso de APIs asíncronas
const cookieStore = await cookies();
const headersList = await headers();
const params = await props.params;
```

### TypeScript Configuration

- Strict mode habilitado
- Interfaces sobre types
- Proper type safety en todos los componentes

### Tailwind CSS

- Configuración personalizada con colores corporativos
- Responsive-first approach
- Componentes optimizados para performance

## 📊 Estado Actual del Proyecto

### ✅ Funcionalidades Implementadas

**Landing Page:**

- Hero section con contexto del centro de investigación
- Sección de valores adaptada a investigación
- Información detallada sobre equipos disponibles
- Showcase específico de tecnología disponible
- CTA orientado a reservas para investigación

**Sistema de Autenticación:**

- Formularios responsive y profesionales
- Validación completa
- Navegación inteligente
- Dashboard básico

**UI/UX:**

- Diseño completamente responsive
- Navbar unificado y funcional
- Experiencia de usuario optimizada
- Adherencia al manual de marca

### 🚧 Próximas Implementaciones

**Sistema de Reservas:**

- Calendario de disponibilidad
- Selección de equipos específicos
- Gestión de horarios
- Confirmación de reservas

**Dashboard Avanzado:**

- Historial de reservas
- Gestión de proyectos
- Perfil de investigador
- Estadísticas de uso

**Administración:**

- Panel administrativo
- Gestión de equipos
- Control de usuarios
- Reportes y analíticas

## 📝 Notas de Desarrollo

### Convenciones de Código

- Componentes funcionales con TypeScript
- Props readonly para inmutabilidad
- Naming descriptivo con verbos auxiliares
- Exportaciones nombradas preferidas

### Performance

- Componentes Server Components por defecto
- Uso mínimo de 'use client'
- Optimización de imágenes
- Lazy loading donde corresponde

### Mantenibilidad

- Separación clara de responsabilidades
- Componentes reutilizables
- Documentación inline en código complejo
- Estructura de carpetas lógica y escalable

---

## 🎯 Visión del Proyecto

CentroMundoX representa la democratización del acceso a tecnología de vanguardia para la investigación académica. El sistema web facilita que estudiantes e investigadores puedan reservar y utilizar equipos especializados para desarrollar sus tesis, proyectos de investigación y trabajos académicos innovadores.

La plataforma combina una experiencia de usuario moderna y profesional con funcionalidades robustas de reserva y gestión, todo ello manteniendo los más altos estándares de calidad técnica y diseño.
