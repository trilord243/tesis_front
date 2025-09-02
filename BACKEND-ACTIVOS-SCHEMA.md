# Schema Backend para Activos - NestJS + MongoDB

## Esquema MongoDB para Product/Asset

```typescript
// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  // === IDENTIFICACIÓN BÁSICA ===
  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  descripcion: string;

  @Prop()
  marca: string;

  @Prop()
  modelo: string;

  @Prop({ required: true, unique: true })
  serialNumber: string;

  @Prop({ required: true, unique: true })
  hexValue: string;

  @Prop({ required: true, enum: ['headset', 'controller', 'computadora', 'sensor', 'otro'] })
  type: string;

  @Prop()
  categoria: string;

  @Prop()
  subcategoria: string;

  // === INFORMACIÓN FINANCIERA ===
  @Prop({ type: Number, default: 0 })
  precioCompra: number;

  @Prop({ default: 'USD' })
  moneda: string;

  @Prop({ type: Number })
  valorActual: number;

  @Prop({ type: Number })
  valorResidual: number;

  @Prop({ default: 'Lineal' })
  metodoDepreciacion: string;

  @Prop({ type: Number })
  vidaUtil: number;

  @Prop({ type: Number, default: 0 })
  depreciacionAcumulada: number;

  @Prop({ type: Number })
  depreciacionAnual: number;

  @Prop({ type: Number })
  valorLibros: number;

  // === FECHAS IMPORTANTES ===
  @Prop({ type: Date })
  fechaCompra: Date;

  @Prop({ type: Date })
  fechaInstalacion: Date;

  @Prop({ type: Date })
  fechaUltimaMantenimiento: Date;

  @Prop({ type: Date })
  fechaProximoMantenimiento: Date;

  @Prop({ type: Date })
  fechaBaja: Date;

  // === GARANTÍA Y SOPORTE ===
  @Prop({ type: Date })
  garantiaInicio: Date;

  @Prop({ type: Date })
  garantiaFin: Date;

  @Prop()
  garantiaTipo: string;

  @Prop()
  garantiaProveedor: string;

  @Prop()
  garantiaContacto: string;

  @Prop()
  garantiaTelefono: string;

  @Prop()
  garantiaCobertura: string;

  // === UBICACIÓN Y ASIGNACIÓN ===
  @Prop()
  ubicacionFisica: string;

  @Prop()
  edificio: string;

  @Prop()
  piso: string;

  @Prop()
  oficina: string;

  @Prop({ type: Types.ObjectId, ref: 'Zone' })
  zona: Types.ObjectId;

  @Prop()
  departamento: string;

  @Prop()
  centroCosto: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  responsable: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  usuarioAsignado: Types.ObjectId;

  @Prop({ default: true })
  isAvailable: boolean;

  // === ESTADO Y CONDICIÓN ===
  @Prop({ default: 'Nuevo', enum: ['Nuevo', 'Bueno', 'Regular', 'Malo', 'Baja'] })
  estado: string;

  @Prop({ default: 'Funcionando', enum: ['Funcionando', 'Mantenimiento', 'Reparación', 'Fuera de servicio'] })
  estadoOperacional: string;

  @Prop({ default: 'Excelente', enum: ['Excelente', 'Buena', 'Regular', 'Deficiente'] })
  condicionFisica: string;

  @Prop()
  observacionesEstado: string;

  // === DOCUMENTACIÓN Y ARCHIVOS ===
  @Prop({ type: [String] })
  imagenes: string[];

  @Prop()
  imagenPrincipal: string;

  @Prop()
  facturaURL: string;

  @Prop()
  manualURL: string;

  @Prop({ type: [{ titulo: String, url: String }] })
  documentosAdicionales: { titulo: string; url: string }[];

  // === MANTENIMIENTO ===
  @Prop({ default: false })
  requiereMantenimiento: boolean;

  @Prop({ type: Number })
  frecuenciaMantenimiento: number;

  @Prop({
    type: [{
      fecha: Date,
      tipo: String,
      descripcion: String,
      costo: Number,
      proveedor: String,
      proximaFecha: Date
    }]
  })
  historialMantenimiento: {
    fecha: Date;
    tipo: string;
    descripcion: string;
    costo: number;
    proveedor: string;
    proximaFecha: Date;
  }[];

  // === INFORMACIÓN DE COMPRA ===
  @Prop()
  proveedor: string;

  @Prop()
  numeroFactura: string;

  @Prop()
  numeroOrdenCompra: string;

  @Prop()
  metodoPago: string;

  @Prop()
  terminos: string;

  // === SEGURO ===
  @Prop({ default: false })
  tieneSeguro: boolean;

  @Prop()
  aseguradora: string;

  @Prop()
  numeroPoliza: string;

  @Prop({ type: Date })
  vigenciaSeguroInicio: Date;

  @Prop({ type: Date })
  vigenciaSeguroFin: Date;

  @Prop({ type: Number })
  valorAsegurado: number;

  @Prop()
  coberturaSeguro: string;

  // === MÉTRICAS Y USO ===
  @Prop({ type: Number, default: 0 })
  horasUso: number;

  @Prop({ type: Number, default: 0 })
  contadorUsos: number;

  @Prop({ type: Date })
  ultimoUso: Date;

  @Prop({ type: Number })
  promedioUsoDiario: number;

  @Prop({ type: Object })
  estadisticasUso: Record<string, any>;

  // === CAMPOS ESPECÍFICOS VR/AR ===
  @Prop()
  resolucion: string;

  @Prop()
  campoVision: string;

  @Prop({ type: Number })
  tasaRefresco: number;

  @Prop({ type: Number })
  pesoGramos: number;

  @Prop({ type: [String] })
  compatibilidad: string[];

  @Prop({ type: [String] })
  accesoriosIncluidos: string[];

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  headsetId: Types.ObjectId;

  // === CUMPLIMIENTO Y AUDITORÍA ===
  @Prop({ default: false })
  requiereCalibracion: boolean;

  @Prop({ type: Date })
  ultimaCalibracion: Date;

  @Prop({ type: Date })
  proximaCalibracion: Date;

  @Prop({ type: [String] })
  certificaciones: string[];

  @Prop({ type: [String] })
  cumplimientoNormativo: string[];

  // === BAJA Y DISPOSICIÓN ===
  @Prop({ enum: ['Obsoleto', 'Dañado', 'Pérdida', 'Venta', null] })
  motivoBaja: string;

  @Prop({ enum: ['Venta', 'Donación', 'Reciclaje', 'Destrucción', null] })
  metodoBaja: string;

  @Prop({ type: Number })
  valorVenta: number;

  @Prop()
  documentoBaja: string;

  // === RELACIONES EXISTENTES ===
  @Prop({ type: Types.ObjectId, ref: 'ProductType' })
  productTypeId: Types.ObjectId;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String] })
  allTags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Índices
ProductSchema.index({ codigo: 1 });
ProductSchema.index({ hexValue: 1 });
ProductSchema.index({ serialNumber: 1 });
ProductSchema.index({ estado: 1, isAvailable: 1 });
ProductSchema.index({ ubicacionFisica: 1, zona: 1 });
ProductSchema.index({ responsable: 1 });
ProductSchema.index({ usuarioAsignado: 1 });
```

## DTOs Actualizados

```typescript
// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  serialNumber: string;

  @IsEnum(['headset', 'controller', 'computadora', 'sensor', 'otro'])
  type: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  subcategoria?: string;

  // Información Financiera
  @IsNumber()
  @Min(0)
  @IsOptional()
  precioCompra?: number;

  @IsString()
  @IsOptional()
  moneda?: string;

  @IsNumber()
  @IsOptional()
  valorResidual?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  vidaUtil?: number;

  // Fechas
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaCompra?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaInstalacion?: Date;

  // Garantía
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  garantiaInicio?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  garantiaFin?: Date;

  @IsString()
  @IsOptional()
  garantiaTipo?: string;

  @IsString()
  @IsOptional()
  garantiaProveedor?: string;

  // Ubicación
  @IsString()
  @IsOptional()
  ubicacionFisica?: string;

  @IsString()
  @IsOptional()
  edificio?: string;

  @IsString()
  @IsOptional()
  piso?: string;

  @IsString()
  @IsOptional()
  oficina?: string;

  @IsString()
  @IsOptional()
  departamento?: string;

  @IsString()
  @IsOptional()
  centroCosto?: string;

  // Documentación
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];

  @IsString()
  @IsOptional()
  imagenPrincipal?: string;

  @IsString()
  @IsOptional()
  facturaURL?: string;

  @IsString()
  @IsOptional()
  manualURL?: string;

  // Información de Compra
  @IsString()
  @IsOptional()
  proveedor?: string;

  @IsString()
  @IsOptional()
  numeroFactura?: string;

  @IsString()
  @IsOptional()
  numeroOrdenCompra?: string;

  // Seguro
  @IsBoolean()
  @IsOptional()
  tieneSeguro?: boolean;

  @IsString()
  @IsOptional()
  aseguradora?: string;

  @IsString()
  @IsOptional()
  numeroPoliza?: string;

  // Campos específicos VR/AR
  @IsString()
  @IsOptional()
  resolucion?: string;

  @IsString()
  @IsOptional()
  campoVision?: string;

  @IsNumber()
  @IsOptional()
  tasaRefresco?: number;

  @IsNumber()
  @IsOptional()
  pesoGramos?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  compatibilidad?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  accesoriosIncluidos?: string[];

  // Relaciones
  @IsString()
  @IsOptional()
  productTypeId?: string;

  @IsString()
  @IsOptional()
  headsetId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
```

## Servicio Actualizado

```typescript
// src/products/products.service.ts - Métodos adicionales

async calculateDepreciation(productId: string): Promise<Product> {
  const product = await this.productModel.findById(productId).exec();
  
  if (!product) {
    throw new NotFoundException('Activo no encontrado');
  }

  if (product.precioCompra && product.vidaUtil) {
    const valorResidual = product.valorResidual || 0;
    const depreciableBase = product.precioCompra - valorResidual;
    
    if (product.metodoDepreciacion === 'Lineal') {
      product.depreciacionAnual = depreciableBase / product.vidaUtil;
      
      if (product.fechaCompra) {
        const yearsInUse = (new Date().getTime() - product.fechaCompra.getTime()) / (365 * 24 * 60 * 60 * 1000);
        product.depreciacionAcumulada = Math.min(
          product.depreciacionAnual * yearsInUse,
          depreciableBase
        );
        product.valorActual = product.precioCompra - product.depreciacionAcumulada;
        product.valorLibros = product.valorActual;
      }
    }
    
    return product.save();
  }

  return product;
}

async scheduleMaintenence(productId: string, frecuenciaDias: number): Promise<Product> {
  const product = await this.productModel.findById(productId).exec();
  
  if (!product) {
    throw new NotFoundException('Activo no encontrado');
  }

  product.requiereMantenimiento = true;
  product.frecuenciaMantenimiento = frecuenciaDias;
  
  const proximaFecha = new Date();
  proximaFecha.setDate(proximaFecha.getDate() + frecuenciaDias);
  product.fechaProximoMantenimiento = proximaFecha;
  
  return product.save();
}

async recordMaintenance(
  productId: string, 
  maintenanceData: {
    tipo: string;
    descripcion: string;
    costo: number;
    proveedor: string;
  }
): Promise<Product> {
  const product = await this.productModel.findById(productId).exec();
  
  if (!product) {
    throw new NotFoundException('Activo no encontrado');
  }

  const maintenance = {
    fecha: new Date(),
    ...maintenanceData,
    proximaFecha: product.frecuenciaMantenimiento 
      ? new Date(Date.now() + product.frecuenciaMantenimiento * 24 * 60 * 60 * 1000)
      : null,
  };

  product.historialMantenimiento.push(maintenance);
  product.fechaUltimaMantenimiento = new Date();
  
  if (maintenance.proximaFecha) {
    product.fechaProximoMantenimiento = maintenance.proximaFecha;
  }
  
  return product.save();
}

async updateUsageMetrics(productId: string, hoursUsed: number): Promise<Product> {
  const product = await this.productModel.findById(productId).exec();
  
  if (!product) {
    throw new NotFoundException('Activo no encontrado');
  }

  product.horasUso += hoursUsed;
  product.contadorUsos += 1;
  product.ultimoUso = new Date();
  
  // Calcular promedio diario
  if (product.fechaInstalacion) {
    const diasEnUso = (new Date().getTime() - product.fechaInstalacion.getTime()) / (24 * 60 * 60 * 1000);
    product.promedioUsoDiario = product.horasUso / diasEnUso;
  }
  
  return product.save();
}

async getAssetsByStatus(estado: string): Promise<Product[]> {
  return this.productModel.find({ estado }).exec();
}

async getAssetsRequiringMaintenance(): Promise<Product[]> {
  const today = new Date();
  return this.productModel.find({
    requiereMantenimiento: true,
    fechaProximoMantenimiento: { $lte: today }
  }).exec();
}

async getAssetsByLocation(ubicacion: string): Promise<Product[]> {
  return this.productModel.find({ 
    $or: [
      { ubicacionFisica: ubicacion },
      { edificio: ubicacion },
      { oficina: ubicacion }
    ]
  }).exec();
}

async getAssetValueReport(): Promise<any> {
  const assets = await this.productModel.find().exec();
  
  const report = {
    totalAssets: assets.length,
    totalPurchaseValue: 0,
    totalCurrentValue: 0,
    totalDepreciation: 0,
    byCategory: {},
    byStatus: {},
  };

  assets.forEach(asset => {
    report.totalPurchaseValue += asset.precioCompra || 0;
    report.totalCurrentValue += asset.valorActual || asset.precioCompra || 0;
    report.totalDepreciation += asset.depreciacionAcumulada || 0;
    
    // Por categoría
    if (asset.categoria) {
      if (!report.byCategory[asset.categoria]) {
        report.byCategory[asset.categoria] = {
          count: 0,
          purchaseValue: 0,
          currentValue: 0
        };
      }
      report.byCategory[asset.categoria].count++;
      report.byCategory[asset.categoria].purchaseValue += asset.precioCompra || 0;
      report.byCategory[asset.categoria].currentValue += asset.valorActual || 0;
    }
    
    // Por estado
    if (!report.byStatus[asset.estado]) {
      report.byStatus[asset.estado] = 0;
    }
    report.byStatus[asset.estado]++;
  });

  return report;
}
```

## Controlador con Nuevos Endpoints

```typescript
// src/products/products.controller.ts - Endpoints adicionales

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Patch(':id/depreciation')
async calculateDepreciation(@Param('id') id: string) {
  return this.productsService.calculateDepreciation(id);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Post(':id/maintenance')
async recordMaintenance(
  @Param('id') id: string,
  @Body() maintenanceData: any
) {
  return this.productsService.recordMaintenance(id, maintenanceData);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Patch(':id/usage')
async updateUsage(
  @Param('id') id: string,
  @Body() usageData: { hoursUsed: number }
) {
  return this.productsService.updateUsageMetrics(id, usageData.hoursUsed);
}

@UseGuards(JwtAuthGuard)
@Get('status/:estado')
async getByStatus(@Param('estado') estado: string) {
  return this.productsService.getAssetsByStatus(estado);
}

@UseGuards(JwtAuthGuard)
@Get('maintenance/pending')
async getPendingMaintenance() {
  return this.productsService.getAssetsRequiringMaintenance();
}

@UseGuards(JwtAuthGuard)
@Get('location/:location')
async getByLocation(@Param('location') location: string) {
  return this.productsService.getAssetsByLocation(location);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Get('reports/value')
async getValueReport() {
  return this.productsService.getAssetValueReport();
}
```

## Migraciones Necesarias

Para actualizar los datos existentes, ejecutar este script en MongoDB:

```javascript
// migrate-products-to-assets.js
db.products.updateMany(
  {},
  {
    $set: {
      estado: 'Bueno',
      estadoOperacional: 'Funcionando',
      condicionFisica: 'Buena',
      horasUso: 0,
      contadorUsos: 0,
      depreciacionAcumulada: 0,
      metodoDepreciacion: 'Lineal',
      moneda: 'USD',
      requiereMantenimiento: false,
      tieneSeguro: false,
      requiereCalibracion: false,
      historialMantenimiento: [],
      imagenes: [],
      documentosAdicionales: [],
      compatibilidad: [],
      accesoriosIncluidos: [],
      certificaciones: [],
      cumplimientoNormativo: [],
      tags: [],
      allTags: []
    },
    $rename: {
      "createdAt": "fechaCreacion",
      "updatedAt": "fechaActualizacion"
    }
  }
);

// Agregar índices
db.products.createIndex({ "codigo": 1 }, { unique: true });
db.products.createIndex({ "hexValue": 1 }, { unique: true });
db.products.createIndex({ "serialNumber": 1 }, { unique: true });
db.products.createIndex({ "estado": 1, "isAvailable": 1 });
db.products.createIndex({ "ubicacionFisica": 1, "zona": 1 });
db.products.createIndex({ "responsable": 1 });
db.products.createIndex({ "usuarioAsignado": 1 });
```

## Validaciones Importantes

```typescript
// src/products/products.service.ts - Método de validación

private validateAsset(product: CreateProductDto | UpdateProductDto): void {
  // Validar fechas
  if (product.fechaCompra && new Date(product.fechaCompra) > new Date()) {
    throw new BadRequestException('La fecha de compra no puede ser futura');
  }

  if (product.garantiaInicio && product.garantiaFin) {
    if (new Date(product.garantiaFin) <= new Date(product.garantiaInicio)) {
      throw new BadRequestException('La fecha de fin de garantía debe ser posterior al inicio');
    }
  }

  // Validar valores financieros
  if (product.precioCompra !== undefined && product.precioCompra < 0) {
    throw new BadRequestException('El precio de compra no puede ser negativo');
  }

  if (product.vidaUtil !== undefined && product.vidaUtil <= 0) {
    throw new BadRequestException('La vida útil debe ser mayor a 0');
  }

  // Validar depreciación
  if (product.depreciacionAcumulada !== undefined && product.precioCompra !== undefined) {
    const maxDepreciacion = product.precioCompra - (product.valorResidual || 0);
    if (product.depreciacionAcumulada > maxDepreciacion) {
      throw new BadRequestException('La depreciación acumulada no puede exceder el valor depreciable');
    }
  }
}
```