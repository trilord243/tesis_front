# Integración de Unity WebGL en Next.js

## 🎮 Descripción

Se ha integrado el juego de Unity "CampuUnimetWebLimpio" en la aplicación Next.js usando la librería **react-unity-webgl**. El juego es una build WebGL que se ejecuta directamente en el navegador.

## 📁 Estructura de Archivos

```
/public/
├── metaverse-build/          # Archivos compilados de Unity
│   ├── metaverse.data.br
│   ├── metaverse.framework.js.br
│   ├── metaverse.loader.js
│   └── metaverse.wasm.br
├── metaverse-template/       # Templates y estilos de Unity
└── metaverse-assets/         # Assets streaming

/src/components/unity/
└── unity-player.tsx          # Componente React para Unity

/src/app/test/
└── page.tsx                  # Página de prueba
```

## 🚀 Acceso

Para ver el juego en acción, accede a:
```
http://localhost:3001/test
```

## 🎯 Características del Componente

### UnityPlayer Component

El componente `UnityPlayer` proporciona:

- ✅ **Carga automática** del juego de Unity
- ✅ **Barra de progreso** durante la carga
- ✅ **Manejo de errores** con mensajes claros
- ✅ **Botón de pantalla completa**
- ✅ **Responsive** y configurable

### Dependencias

El componente utiliza la librería `react-unity-webgl`:
```bash
npm install react-unity-webgl
```

### Props del Componente

```typescript
interface UnityPlayerProps {
  width?: number;        // Ancho del canvas (default: 960)
  height?: number;       // Alto del canvas (default: 600)
}
```

## 🎨 Uso del Componente

### Ejemplo Básico

```tsx
import { UnityPlayer } from "@/components/unity/unity-player";

export default function MyPage() {
  return (
    <div>
      <h1>Mi Juego de Unity</h1>
      <UnityPlayer />
    </div>
  );
}
```

### Ejemplo con Personalización

```tsx
import { UnityPlayer } from "@/components/unity/unity-player";

export default function CustomUnityPage() {
  return (
    <div>
      <UnityPlayer
        width={1280}
        height={720}
      />
    </div>
  );
}
```

## ⚙️ Requisitos Técnicos

### Navegador
- ✅ Chrome 90+ (Recomendado)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Características Requeridas
- WebGL 2.0
- WebAssembly
- Compresión Brotli (.br)

### Recursos del Sistema
- Mínimo 4GB RAM
- GPU con soporte OpenGL ES 3.0

## 🎮 Controles del Juego

### Movimiento
- **W** - Adelante
- **A** - Izquierda
- **S** - Atrás
- **D** - Derecha
- **Espacio** - Saltar
- **Shift** - Correr

### Cámara
- **Mouse** - Mirar alrededor
- **Scroll** - Zoom

### Acciones
- **E** - Interactuar
- **ESC** - Liberar cursor
- **F** - Pantalla completa

## 📦 Tamaño de Archivos

Los archivos de Unity están comprimidos con Brotli:
- `metaverse.data.br` - ~44.5 MB
- `metaverse.wasm.br` - ~11.4 MB
- `metaverse.framework.js.br` - ~83 KB

**Total**: ~56 MB (primera carga puede tardar 10-30 segundos dependiendo de la conexión)

## 🔧 Troubleshooting

### El juego no carga
1. Verifica que los archivos estén en `/public/metaverse-build/`
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que tu navegador soporte WebGL 2.0 (visita: https://get.webgl.org/webgl2/)

### Pantalla negra
- Los archivos pueden estar cargando todavía
- Verifica que la ruta `buildPath` sea correcta
- Asegúrate de que el servidor esté sirviendo archivos `.br` con el Content-Encoding correcto

### Errores de compresión
Si ves errores relacionados con Brotli, asegúrate de que Next.js esté configurado para servir archivos `.br`:

```javascript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/metaverse-build/:path*.br',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'br',
          },
        ],
      },
    ];
  },
};
```

## 🚀 Próximos Pasos

### Integrar en otras páginas
Puedes usar el componente `UnityPlayer` en cualquier página:

```tsx
// En tu página de dashboard, admin, etc.
import { UnityPlayer } from "@/components/unity/unity-player";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <UnityPlayer width={800} height={500} />
    </div>
  );
}
```

### Comunicación JavaScript ↔ Unity
Para enviar/recibir mensajes entre React y Unity:

```typescript
// Enviar mensaje a Unity
unityInstanceRef.current?.SendMessage("GameObjectName", "MethodName", "parameter");

// Recibir mensaje desde Unity (definir función global)
window.ReceiveMessageFromUnity = (message: string) => {
  console.log("Unity says:", message);
};
```

## 📝 Notas Importantes

1. **Rendimiento**: El juego de Unity puede consumir muchos recursos. Considera:
   - Mostrar un botón "Cargar Juego" en lugar de cargarlo automáticamente
   - Limitar a una instancia por página
   - Implementar lazy loading

2. **Cache**: Los archivos de Unity se cachean en el navegador después de la primera carga

3. **Mobile**: El juego está optimizado para desktop. En móviles puede tener menor rendimiento.

## 🎉 Resultado

Visita `http://localhost:3001/test` para ver el juego funcionando con:
- ✅ Página completa con información del proyecto
- ✅ Requisitos técnicos
- ✅ Controles detallados
- ✅ Componente Unity integrado y funcional
- ✅ Estados de carga y error manejados
