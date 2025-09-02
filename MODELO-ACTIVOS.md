# Modelo de Datos Completo para Sistema de Gestión de Activos

## Campos Esenciales para Activos Fijos

### 1. **Identificación Básica**
- `codigo`: Código único del activo (ya existe)
- `name`: Nombre del activo (ya existe)
- `descripcion`: Descripción detallada del activo
- `marca`: Marca o fabricante
- `modelo`: Modelo específico
- `serialNumber`: Número de serie (ya existe)
- `hexValue`: RFID Tag (ya existe)
- `type`: Tipo de activo (headset/controller - ampliar)
- `categoria`: Categoría del activo (VR/AR/Computación/Audio/etc)
- `subcategoria`: Subcategoría específica

### 2. **Información Financiera**
- `precioCompra`: Precio de adquisición
- `moneda`: Moneda de compra (USD/EUR/COP)
- `valorActual`: Valor actual del activo
- `valorResidual`: Valor residual estimado
- `metodoDepreciacion`: Método de depreciación (Lineal/Acelerada)
- `vidaUtil`: Vida útil en años
- `depreciacionAcumulada`: Depreciación acumulada
- `depreciacionAnual`: Depreciación anual
- `valorLibros`: Valor en libros

### 3. **Fechas Importantes**
- `fechaCompra`: Fecha de adquisición
- `fechaInstalacion`: Fecha de instalación/puesta en marcha
- `fechaUltimaMantenimiento`: Última fecha de mantenimiento
- `fechaProximoMantenimiento`: Próximo mantenimiento programado
- `fechaBaja`: Fecha de baja (si aplica)
- `createdAt`: Fecha de registro (ya existe)
- `updatedAt`: Última actualización (ya existe)

### 4. **Garantía y Soporte**
- `garantiaInicio`: Fecha de inicio de garantía
- `garantiaFin`: Fecha de fin de garantía
- `garantiaTipo`: Tipo de garantía (Básica/Extendida/Premium)
- `garantiaProveedor`: Proveedor de garantía
- `garantiaContacto`: Contacto de soporte
- `garantiaTelefono`: Teléfono de soporte
- `garantiaCobertura`: Descripción de cobertura

### 5. **Ubicación y Asignación**
- `ubicacionFisica`: Ubicación física actual
- `edificio`: Edificio
- `piso`: Piso
- `oficina`: Oficina/Sala
- `zona`: Zona asignada (ya existe parcialmente)
- `departamento`: Departamento asignado
- `centroCosto`: Centro de costo
- `responsable`: ID del usuario responsable
- `usuarioAsignado`: ID del usuario asignado actual
- `isAvailable`: Disponibilidad (ya existe)

### 6. **Estado y Condición**
- `estado`: Estado del activo (Nuevo/Bueno/Regular/Malo/Baja)
- `estadoOperacional`: Estado operacional (Funcionando/Mantenimiento/Reparación/Fuera de servicio)
- `condicionFisica`: Condición física (Excelente/Buena/Regular/Deficiente)
- `observacionesEstado`: Observaciones sobre el estado

### 7. **Documentación y Archivos**
- `imagenes`: Array de URLs de imágenes del activo
- `imagenPrincipal`: URL de imagen principal
- `facturaURL`: URL del documento de factura
- `manualURL`: URL del manual de usuario
- `documentosAdicionales`: Array de documentos adicionales

### 8. **Mantenimiento**
- `requiereMantenimiento`: Boolean si requiere mantenimiento
- `frecuenciaMantenimiento`: Frecuencia en días
- `historialMantenimiento`: Array de registros de mantenimiento
  - `fecha`: Fecha del mantenimiento
  - `tipo`: Tipo (Preventivo/Correctivo)
  - `descripcion`: Descripción del trabajo
  - `costo`: Costo del mantenimiento
  - `proveedor`: Proveedor del servicio
  - `proximaFecha`: Próximo mantenimiento

### 9. **Información de Compra**
- `proveedor`: Nombre del proveedor
- `numeroFactura`: Número de factura
- `numeroOrdenCompra`: Número de orden de compra
- `metodoPago`: Método de pago
- `terminos`: Términos de pago

### 10. **Seguro**
- `tieneSeguro`: Boolean si tiene seguro
- `aseguradora`: Compañía aseguradora
- `numeroPoliza`: Número de póliza
- `vigenciaSeguroInicio`: Inicio de vigencia
- `vigenciaSeguroFin`: Fin de vigencia
- `valorAsegurado`: Valor asegurado
- `coberturaSeguro`: Descripción de cobertura

### 11. **Métricas y Uso**
- `horasUso`: Horas totales de uso
- `contadorUsos`: Contador de veces usado
- `ultimoUso`: Fecha/hora del último uso
- `promedioUsoDiario`: Promedio de uso diario
- `estadisticasUso`: JSON con estadísticas detalladas

### 12. **Campos Específicos VR/AR**
- `resolucion`: Resolución de pantalla
- `campoVision`: Campo de visión
- `tasaRefresco`: Tasa de refresco (Hz)
- `pesoGramos`: Peso en gramos
- `compatibilidad`: Array de sistemas compatibles
- `accesoriosIncluidos`: Array de accesorios incluidos
- `headsetId`: ID del headset asociado (para controllers - ya existe)

### 13. **Cumplimiento y Auditoría**
- `requiereCalibracion`: Boolean si requiere calibración
- `ultimaCalibracion`: Fecha de última calibración
- `proximaCalibracion`: Fecha de próxima calibración
- `certificaciones`: Array de certificaciones
- `cumplimientoNormativo`: Array de normativas que cumple

### 14. **Baja y Disposición**
- `motivoBaja`: Motivo de baja (Obsoleto/Dañado/Pérdida/Venta)
- `metodoBaja`: Método de disposición (Venta/Donación/Reciclaje/Destrucción)
- `valorVenta`: Valor de venta (si aplica)
- `documentoBaja`: URL del documento de baja

## Relaciones con Otras Entidades

### User (Usuario)
- Un activo puede tener un responsable (User)
- Un activo puede estar asignado a un usuario (User)
- Un usuario puede tener múltiples activos asignados

### ProductType (Tipo de Producto)
- Un activo pertenece a un ProductType (ya existe)
- ProductType define etiquetas predefinidas

### Zone (Zona)
- Un activo está en una zona específica
- Una zona puede contener múltiples activos

### LensRequest (Solicitud de Préstamo)
- Un activo puede estar relacionado con múltiples solicitudes
- Historial de préstamos y devoluciones

## Índices Recomendados
- `codigo` (único)
- `hexValue` (único)
- `serialNumber` (único)
- `estado` + `isAvailable` (compuesto)
- `ubicacionFisica` + `zona` (compuesto)
- `responsable`
- `usuarioAsignado`

## Validaciones Importantes
1. `fechaCompra` no puede ser futura
2. `garantiaFin` debe ser posterior a `garantiaInicio`
3. `valorActual` no puede ser negativo
4. `precioCompra` debe ser mayor a 0
5. `vidaUtil` debe ser mayor a 0
6. `depreciacionAcumulada` no puede exceder `precioCompra - valorResidual`

## Configuraciones por Defecto
- `estado`: 'Nuevo'
- `estadoOperacional`: 'Funcionando'
- `condicionFisica`: 'Excelente'
- `isAvailable`: true
- `horasUso`: 0
- `contadorUsos`: 0
- `depreciacionAcumulada`: 0
- `metodoDepreciacion`: 'Lineal'