"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductTypeSelector } from "./product-type-selector";
import { createProduct, printProductLabel } from "@/lib/products";
import { AlertCircle, CheckCircle, Loader2, Printer, Save, RefreshCw, Search, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AssetFormData {
  // Identificación básica
  name: string;
  descripcion: string;
  marca: string;
  modelo: string;
  serialNumber: string;
  productTypeId?: string | undefined;
  tags: string[];
  estado: string; // Nuevo, Usado, Reacondicionado

  // Información financiera
  precioCompra: number;
  moneda: string;
  metodoDepreciacion: string;

  // Fechas
  fechaCompra: string;
  tieneGarantia: boolean;
  garantiaInicio: string;
  garantiaFin: string;

  // Garantía
  garantiaTipo: string;
  garantiaProveedor: string;
  garantiaContacto: string;
  garantiaTelefono: string;
  garantiaCobertura: string;

  // Ubicación
  ubicacionFisica: string;
  estadoUbicacion: string;
  edificio: string;
  piso: string;
  oficina: string;
  departamento: string;
  centroCosto: string;

  // Documentación
  imagenPrincipal: string;
  facturaURL: string;
  manualURL: string;

  // Información de compra
  proveedor: string;
  numeroFactura: string;
  numeroOrdenCompra: string;
  metodoPago: string;
  terminos: string;

  // Seguro
  tieneSeguro: boolean;
  aseguradora: string;
  numeroPoliza: string;
  vigenciaSeguroInicio: string;
  vigenciaSeguroFin: string;
  valorAsegurado: number;
  coberturaSeguro: string;

  // Campos específicos VR/AR
  resolucion: string;
  campoVision: string;
  tasaRefresco: number;
  pesoGramos: number;
}

interface ExistingProduct {
  _id: string;
  name: string;
  descripcion?: string;
  marca?: string;
  modelo?: string;
  serialNumber: string;
  productTypeId?: string;
  tags: string[];
  estado: string;
  precioCompra?: number;
  moneda?: string;
  metodoDepreciacion?: string;
  fechaCompra?: string;
  tieneGarantia?: boolean;
  garantiaInicio?: string;
  garantiaFin?: string;
  garantiaTipo?: string;
  garantiaProveedor?: string;
  garantiaContacto?: string;
  garantiaTelefono?: string;
  garantiaCobertura?: string;
  ubicacionFisica?: string;
  estadoUbicacion?: string;
  edificio?: string;
  piso?: string;
  oficina?: string;
  departamento?: string;
  centroCosto?: string;
  imagenPrincipal?: string;
  facturaURL?: string;
  manualURL?: string;
  proveedor?: string;
  numeroFactura?: string;
  numeroOrdenCompra?: string;
  metodoPago?: string;
  terminos?: string;
  tieneSeguro?: boolean;
  aseguradora?: string;
  numeroPoliza?: string;
  vigenciaSeguroInicio?: string;
  vigenciaSeguroFin?: string;
  valorAsegurado?: number;
  coberturaSeguro?: string;
  resolucion?: string;
  campoVision?: string;
  tasaRefresco?: number;
  pesoGramos?: number;
}

export function AssetForm() {
  const [activeTab, setActiveTab] = useState("basico");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<{
    name: string;
    serialNumber: string;
    codigo: string;
    hexValue: string;
  } | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  // New states for existing asset search
  const [showExistingAssetQuestion, setShowExistingAssetQuestion] = useState(true);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ExistingProduct[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [formData, setFormData] = useState<AssetFormData>({
    // Identificación básica
    name: "",
    descripcion: "",
    marca: "",
    modelo: "",
    serialNumber: "",
    productTypeId: undefined,
    tags: [],
    estado: "Nuevo",

    // Información financiera
    precioCompra: 0,
    moneda: "USD",
    metodoDepreciacion: "Lineal",

    // Fechas
    fechaCompra: "",
    tieneGarantia: false,
    garantiaInicio: "",
    garantiaFin: "",

    // Garantía
    garantiaTipo: "Básica",
    garantiaProveedor: "",
    garantiaContacto: "",
    garantiaTelefono: "",
    garantiaCobertura: "",

    // Ubicación
    ubicacionFisica: "Laboratorio metaverso",
    estadoUbicacion: "available",
    edificio: "",
    piso: "",
    oficina: "",
    departamento: "",
    centroCosto: "",

    // Documentación
    imagenPrincipal: "",
    facturaURL: "",
    manualURL: "",

    // Información de compra
    proveedor: "",
    numeroFactura: "",
    numeroOrdenCompra: "",
    metodoPago: "Transferencia",
    terminos: "",

    // Seguro
    tieneSeguro: false,
    aseguradora: "",
    numeroPoliza: "",
    vigenciaSeguroInicio: "",
    vigenciaSeguroFin: "",
    valorAsegurado: 0,
    coberturaSeguro: "",

    // Campos específicos VR/AR
    resolucion: "",
    campoVision: "",
    tasaRefresco: 90,
    pesoGramos: 0,
  });

  const handleInputChange = (
    field: keyof AssetFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductTypeSelect = (
    typeId: string | undefined,
    tags: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      productTypeId: typeId,
      tags,
    }));
  };

  const generateSerialNumber = () => {
    // Generar un número de serie totalmente numérico
    const timestamp = Date.now().toString().slice(-8); // Últimos 8 dígitos del timestamp
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 dígitos aleatorios
    const serialNumber = `${timestamp}${random}`; // Total: 12 dígitos
    
    setFormData((prev) => ({ ...prev, serialNumber }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validación básica
      if (!formData.name || !formData.serialNumber) {
        throw new Error("Los campos nombre y número de serie son requeridos");
      }

      // Preparar TODOS los datos del formulario para enviar
      const completeData = {
        // Identificación básica
        name: formData.name,
        serialNumber: formData.serialNumber,
        type: "headset" as "headset" | "controller",
        descripcion: formData.descripcion,
        marca: formData.marca,
        modelo: formData.modelo,
        productTypeId: formData.productTypeId,
        tags: formData.tags,
        estado: formData.estado,

        // Ubicación
        ubicacionFisica: formData.ubicacionFisica,
        estadoUbicacion: formData.estadoUbicacion,
        edificio: formData.edificio,
        piso: formData.piso,
        oficina: formData.oficina,
        departamento: formData.departamento,
        centroCosto: formData.centroCosto,

        // Información financiera
        precioCompra: formData.precioCompra,
        moneda: formData.moneda,
        metodoDepreciacion: formData.metodoDepreciacion,
        fechaCompra: formData.fechaCompra,

        // Garantía
        tieneGarantia: formData.tieneGarantia,
        garantiaInicio: formData.garantiaInicio,
        garantiaFin: formData.garantiaFin,
        garantiaTipo: formData.garantiaTipo,
        garantiaProveedor: formData.garantiaProveedor,
        garantiaContacto: formData.garantiaContacto,
        garantiaTelefono: formData.garantiaTelefono,
        garantiaCobertura: formData.garantiaCobertura,

        // Información del proveedor
        proveedor: formData.proveedor,
        numeroFactura: formData.numeroFactura,
        numeroOrdenCompra: formData.numeroOrdenCompra,
        metodoPago: formData.metodoPago,
        terminos: formData.terminos,

        // Documentación
        imagenPrincipal: formData.imagenPrincipal,
        facturaURL: formData.facturaURL,
        manualURL: formData.manualURL,
      };

      console.log("Datos completos enviados al backend:", completeData);
      const result = await createProduct(completeData);

      if (result.success && result.product) {
        setCreatedProduct(result.product);
        setMessage({
          type: "success",
          text: `Activo "${result.product.name}" creado exitosamente`,
        });
        setShowPrintDialog(true);

        // Limpiar formulario después de éxito
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.error || "Error al crear el activo");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!createdProduct) return;

    setIsPrinting(true);
    const result = await printProductLabel(
      createdProduct.hexValue,
      "new-product"
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: "¡Etiqueta RFID enviada a imprimir!",
      });
      setTimeout(() => {
        setShowPrintDialog(false);
        setCreatedProduct(null);
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Error al imprimir etiqueta",
      });
    }
    setIsPrinting(false);
  };

  // Fetch existing products when component mounts
  useEffect(() => {
    if (showProductSearch && existingProducts.length === 0) {
      fetchExistingProducts();
    }
  }, [showProductSearch, existingProducts.length]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(existingProducts);
    } else {
      const filtered = existingProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, existingProducts]);

  const fetchExistingProducts = async () => {
    setIsSearchLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setExistingProducts(data);
        setFilteredProducts(data);
      } else {
        setMessage({
          type: "error",
          text: "Error al cargar productos existentes"
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Error de conexión al cargar productos"
      });
    } finally {
      setIsSearchLoading(false);
    }
  };

  const selectExistingProduct = (product: ExistingProduct) => {
    // Auto-fill form with existing product data, except serial number
    setFormData({
      name: product.name,
      descripcion: product.descripcion || "",
      marca: product.marca || "",
      modelo: product.modelo || "",
      serialNumber: "", // Keep empty for new serial number
      productTypeId: product.productTypeId,
      tags: product.tags || [],
      estado: product.estado || "Nuevo",
      precioCompra: product.precioCompra || 0,
      moneda: product.moneda || "USD",
      metodoDepreciacion: product.metodoDepreciacion || "Lineal",
      fechaCompra: product.fechaCompra || "",
      tieneGarantia: product.tieneGarantia || false,
      garantiaInicio: product.garantiaInicio || "",
      garantiaFin: product.garantiaFin || "",
      garantiaTipo: product.garantiaTipo || "Básica",
      garantiaProveedor: product.garantiaProveedor || "",
      garantiaContacto: product.garantiaContacto || "",
      garantiaTelefono: product.garantiaTelefono || "",
      garantiaCobertura: product.garantiaCobertura || "",
      ubicacionFisica: product.ubicacionFisica || "Laboratorio metaverso",
      estadoUbicacion: product.estadoUbicacion || "available",
      edificio: product.edificio || "",
      piso: product.piso || "",
      oficina: product.oficina || "",
      departamento: product.departamento || "",
      centroCosto: product.centroCosto || "",
      imagenPrincipal: product.imagenPrincipal || "",
      facturaURL: product.facturaURL || "",
      manualURL: product.manualURL || "",
      proveedor: product.proveedor || "",
      numeroFactura: product.numeroFactura || "",
      numeroOrdenCompra: product.numeroOrdenCompra || "",
      metodoPago: product.metodoPago || "Transferencia",
      terminos: product.terminos || "",
      tieneSeguro: product.tieneSeguro || false,
      aseguradora: product.aseguradora || "",
      numeroPoliza: product.numeroPoliza || "",
      vigenciaSeguroInicio: product.vigenciaSeguroInicio || "",
      vigenciaSeguroFin: product.vigenciaSeguroFin || "",
      valorAsegurado: product.valorAsegurado || 0,
      coberturaSeguro: product.coberturaSeguro || "",
      resolucion: product.resolucion || "",
      campoVision: product.campoVision || "",
      tasaRefresco: product.tasaRefresco || 90,
      pesoGramos: product.pesoGramos || 0,
    });
    
    setShowProductSearch(false);
    setMessage({
      type: "success",
      text: `Datos de "${product.name}" cargados. Recuerde ingresar un nuevo número de serie.`
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      descripcion: "",
      marca: "",
      modelo: "",
      serialNumber: "",
      productTypeId: undefined,
      tags: [],
      estado: "Nuevo",
      precioCompra: 0,
      moneda: "USD",
      metodoDepreciacion: "Lineal",
      fechaCompra: "",
      tieneGarantia: false,
      garantiaInicio: "",
      garantiaFin: "",
      garantiaTipo: "Básica",
      garantiaProveedor: "",
      garantiaContacto: "",
      garantiaTelefono: "",
      garantiaCobertura: "",
      ubicacionFisica: "Laboratorio metaverso",
      estadoUbicacion: "available",
      edificio: "",
      piso: "",
      oficina: "",
      departamento: "",
      centroCosto: "",
      imagenPrincipal: "",
      facturaURL: "",
      manualURL: "",
      proveedor: "",
      numeroFactura: "",
      numeroOrdenCompra: "",
      metodoPago: "Transferencia",
      terminos: "",
      tieneSeguro: false,
      aseguradora: "",
      numeroPoliza: "",
      vigenciaSeguroInicio: "",
      vigenciaSeguroFin: "",
      valorAsegurado: 0,
      coberturaSeguro: "",
      resolucion: "",
      campoVision: "",
      tasaRefresco: 90,
      pesoGramos: 0,
    });
    setActiveTab("basico");
    setShowExistingAssetQuestion(true);
    setShowProductSearch(false);
    setSearchQuery("");
  };

  // Show existing asset question first
  if (showExistingAssetQuestion) {
    return (
      <Card className="border-0 shadow-md max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
              <Search className="h-6 w-6" style={{ color: "#1859A9" }} />
            </div>
            <div>
              <CardTitle style={{ color: "#1859A9" }}>
                Tipo de Activo
              </CardTitle>
              <CardDescription>
                Selecciona si es un activo nuevo o basado en uno existente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#003087" }}>
              ¿Este activo ya existe en el sistema?
            </h3>
            <p className="text-gray-600 mb-6">
              Si seleccionas &ldquo;Sí&rdquo;, podrás buscar un producto existente para usar como plantilla.
              Solo necesitarás cambiar el número de serie.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              onClick={() => {
                setShowExistingAssetQuestion(false);
                setShowProductSearch(true);
              }}
              className="px-8 py-3 text-lg"
              style={{ backgroundColor: "#1859A9" }}
            >
              <Search className="h-5 w-5 mr-2" />
              Sí, buscar existente
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowExistingAssetQuestion(false);
              }}
              className="px-8 py-3 text-lg border-2"
              style={{ borderColor: "#FF8200", color: "#FF8200" }}
            >
              No, crear nuevo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show product search interface
  if (showProductSearch) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
                <Search className="h-6 w-6" style={{ color: "#1859A9" }} />
              </div>
              <div>
                <CardTitle style={{ color: "#1859A9" }}>
                  Buscar Activo Existente
                </CardTitle>
                <CardDescription>
                  Selecciona un producto para usar como plantilla
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowProductSearch(false);
                setShowExistingAssetQuestion(true);
                setSearchQuery("");
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert className={message.type === "success" ? "border-green-500" : "border-red-500"}>
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, marca, modelo o número de serie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          {isSearchLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Cargando productos...</span>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        {searchQuery ? "No se encontraron productos que coincidan con la búsqueda" : "No hay productos disponibles"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          {product.marca && product.modelo
                            ? `${product.marca} ${product.modelo}`
                            : product.marca || product.modelo || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.serialNumber}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.estado === "Nuevo" ? "bg-green-100 text-green-800" :
                            product.estado === "Usado" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {product.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => selectExistingProduct(product)}
                            style={{ backgroundColor: "#FF8200" }}
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && !showPrintDialog && (
          <Alert
            className={
              message.type === "success" ? "border-green-500" : "border-red-500"
            }
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                message.type === "success" ? "text-green-800" : "text-red-800"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 lg:grid-cols-4 h-14 p-1.5"
            style={{ backgroundColor: "#f9fafb" }}
          >
            <TabsTrigger
              value="basico"
              className="font-medium transition-all duration-200 data-[state=active]:shadow-sm"
              style={{
                backgroundColor: activeTab === "basico" ? "#1859A9" : "white",
                color: activeTab === "basico" ? "white" : "#6b7280",
                border:
                  activeTab === "basico"
                    ? "1px solid #1859A9"
                    : "1px solid #e5e7eb",
              }}
            >
              Básico
            </TabsTrigger>
            <TabsTrigger
              value="financiero"
              className="font-medium transition-all duration-200 data-[state=active]:shadow-sm"
              style={{
                backgroundColor:
                  activeTab === "financiero" ? "#1859A9" : "white",
                color: activeTab === "financiero" ? "white" : "#6b7280",
                border:
                  activeTab === "financiero"
                    ? "1px solid #1859A9"
                    : "1px solid #e5e7eb",
              }}
            >
              Financiero
            </TabsTrigger>
            <TabsTrigger
              value="garantia"
              className="font-medium transition-all duration-200 data-[state=active]:shadow-sm"
              style={{
                backgroundColor: activeTab === "garantia" ? "#1859A9" : "white",
                color: activeTab === "garantia" ? "white" : "#6b7280",
                border:
                  activeTab === "garantia"
                    ? "1px solid #1859A9"
                    : "1px solid #e5e7eb",
              }}
            >
              Garantía
            </TabsTrigger>
            <TabsTrigger
              value="compra"
              className="font-medium transition-all duration-200 data-[state=active]:shadow-sm"
              style={{
                backgroundColor: activeTab === "compra" ? "#1859A9" : "white",
                color: activeTab === "compra" ? "white" : "#6b7280",
                border:
                  activeTab === "compra"
                    ? "1px solid #1859A9"
                    : "1px solid #e5e7eb",
              }}
            >
              Proveedor
            </TabsTrigger>
          </TabsList>

          {/* Tab: Información Básica */}
          <TabsContent value="basico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica del Activo</CardTitle>
                <CardDescription>
                  Datos esenciales de identificación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProductTypeSelector
                  selectedTypeId={formData.productTypeId}
                  onTypeSelect={handleProductTypeSelect}
                  disabled={isLoading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Activo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Ej: MetaQuest 3 "
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="serialNumber">
                      Número de Serie * 
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Ingrese manualmente o genere automáticamente)
                      </span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) =>
                          handleInputChange("serialNumber", e.target.value)
                        }
                        placeholder="Ej: 123456789012"
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateSerialNumber}
                        title="Generar número de serie automático"
                        className="px-3 hover:bg-blue-50 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Haga clic en &ldquo;Generar&rdquo; para crear un número de serie único automáticamente
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) =>
                        handleInputChange("marca", e.target.value)
                      }
                      placeholder="Ej: Meta, HTC, Pico"
                    />
                  </div>
                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) =>
                        handleInputChange("modelo", e.target.value)
                      }
                      placeholder="Ej: Quest 3, Vive Pro 2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="estado">Estado del Activo *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) =>
                      handleInputChange("estado", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nuevo">Nuevo</SelectItem>
                      <SelectItem value="Usado">Usado</SelectItem>
                      <SelectItem value="Reacondicionado">
                        Reacondicionado
                      </SelectItem>
                      <SelectItem value="Para reparación">
                        Para reparación
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      handleInputChange("descripcion", e.target.value)
                    }
                    placeholder="Descripción detallada del activo..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ubicacionFisica">Ubicación Física</Label>
                    <Select
                      value={formData.ubicacionFisica}
                      onValueChange={(value) =>
                        handleInputChange("ubicacionFisica", value)
                      }
                    >
                      <SelectTrigger id="ubicacionFisica">
                        <SelectValue placeholder="Selecciona una ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laboratorio metaverso">
                          Laboratorio metaverso
                        </SelectItem>
                        <SelectItem value="Laboratorio Principal">
                          Laboratorio Principal
                        </SelectItem>
                        <SelectItem value="Sala de Realidad Virtual">
                          Sala de Realidad Virtual
                        </SelectItem>
                        <SelectItem value="Área de Desarrollo">
                          Área de Desarrollo
                        </SelectItem>
                        <SelectItem value="Bodega">
                          Bodega
                        </SelectItem>
                        <SelectItem value="Oficina Administrativa">
                          Oficina Administrativa
                        </SelectItem>
                        <SelectItem value="Sala de Reuniones">
                          Sala de Reuniones
                        </SelectItem>
                        <SelectItem value="Centro de Datos">
                          Centro de Datos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estadoUbicacion">Estado de Ubicación</Label>
                    <Select
                      value={formData.estadoUbicacion || "available"}
                      onValueChange={(value) =>
                        handleInputChange("estadoUbicacion", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="in_use">En Uso</SelectItem>
                        <SelectItem value="maintenance">
                          En Mantenimiento
                        </SelectItem>
                        <SelectItem value="retired">Retirado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Información Financiera */}
          <TabsContent value="financiero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Financiera</CardTitle>
                <CardDescription>Valor, depreciación y costos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="precioCompra">Precio de Compra</Label>
                    <Input
                      id="precioCompra"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.precioCompra}
                      onChange={(e) =>
                        handleInputChange(
                          "precioCompra",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="moneda">Moneda</Label>
                    <Select
                      value={formData.moneda}
                      onValueChange={(value) =>
                        handleInputChange("moneda", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - Dólar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="COP">
                          COP - Peso Colombiano
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="metodoDepreciacion">
                    Método de Depreciación
                  </Label>
                  <Select
                    value={formData.metodoDepreciacion}
                    onValueChange={(value) =>
                      handleInputChange("metodoDepreciacion", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lineal">Lineal</SelectItem>
                      <SelectItem value="Acelerada">Acelerada</SelectItem>
                      <SelectItem value="Unidades">
                        Por Unidades Producidas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fechaCompra">Fecha de Compra</Label>
                  <Input
                    id="fechaCompra"
                    type="date"
                    value={formData.fechaCompra}
                    onChange={(e) =>
                      handleInputChange("fechaCompra", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Garantía */}
          <TabsContent value="garantia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Garantía</CardTitle>
                <CardDescription>Cobertura y soporte técnico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="tieneGarantia"
                    checked={formData.tieneGarantia}
                    onChange={(e) =>
                      handleInputChange("tieneGarantia", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="tieneGarantia">
                    ¿El activo tiene garantía?
                  </Label>
                </div>

                {formData.tieneGarantia && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="garantiaInicio">
                          Fecha Inicio de Garantía
                        </Label>
                        <Input
                          id="garantiaInicio"
                          type="date"
                          value={formData.garantiaInicio}
                          onChange={(e) =>
                            handleInputChange("garantiaInicio", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="garantiaFin">
                          Fecha Fin de Garantía
                        </Label>
                        <Input
                          id="garantiaFin"
                          type="date"
                          value={formData.garantiaFin}
                          onChange={(e) =>
                            handleInputChange("garantiaFin", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="garantiaTipo">Tipo de Garantía</Label>
                        <Select
                          value={formData.garantiaTipo}
                          onValueChange={(value) =>
                            handleInputChange("garantiaTipo", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Básica">Básica</SelectItem>
                            <SelectItem value="Extendida">Extendida</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Platinum">Platinum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="garantiaProveedor">
                          Proveedor de Garantía
                        </Label>
                        <Input
                          id="garantiaProveedor"
                          value={formData.garantiaProveedor}
                          onChange={(e) =>
                            handleInputChange(
                              "garantiaProveedor",
                              e.target.value
                            )
                          }
                          placeholder="Ej: Meta Support"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="garantiaContacto">
                          Contacto de Soporte
                        </Label>
                        <Input
                          id="garantiaContacto"
                          value={formData.garantiaContacto}
                          onChange={(e) =>
                            handleInputChange(
                              "garantiaContacto",
                              e.target.value
                            )
                          }
                          placeholder="Nombre del contacto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="garantiaTelefono">
                          Teléfono de Soporte
                        </Label>
                        <Input
                          id="garantiaTelefono"
                          value={formData.garantiaTelefono}
                          onChange={(e) =>
                            handleInputChange(
                              "garantiaTelefono",
                              e.target.value
                            )
                          }
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="garantiaCobertura">
                        Cobertura de Garantía
                      </Label>
                      <Textarea
                        id="garantiaCobertura"
                        value={formData.garantiaCobertura}
                        onChange={(e) =>
                          handleInputChange("garantiaCobertura", e.target.value)
                        }
                        placeholder="Descripción de lo que cubre la garantía..."
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Información del Proveedor */}
          <TabsContent value="compra" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Proveedor</CardTitle>
                <CardDescription>
                  Datos del proveedor y facturación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proveedor">Proveedor</Label>
                    <Input
                      id="proveedor"
                      value={formData.proveedor}
                      onChange={(e) =>
                        handleInputChange("proveedor", e.target.value)
                      }
                      placeholder="Nombre del proveedor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numeroFactura">Número de Factura</Label>
                    <Input
                      id="numeroFactura"
                      value={formData.numeroFactura}
                      onChange={(e) =>
                        handleInputChange("numeroFactura", e.target.value)
                      }
                      placeholder="FAC-2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numeroOrdenCompra">
                      Número de Orden de Compra
                    </Label>
                    <Input
                      id="numeroOrdenCompra"
                      value={formData.numeroOrdenCompra}
                      onChange={(e) =>
                        handleInputChange("numeroOrdenCompra", e.target.value)
                      }
                      placeholder="OC-2024-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select
                      value={formData.metodoPago}
                      onValueChange={(value) =>
                        handleInputChange("metodoPago", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transferencia">
                          Transferencia Bancaria
                        </SelectItem>
                        <SelectItem value="Tarjeta">
                          Tarjeta de Crédito
                        </SelectItem>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="terminos">Términos de Pago</Label>
                  <Textarea
                    id="terminos"
                    value={formData.terminos}
                    onChange={(e) =>
                      handleInputChange("terminos", e.target.value)
                    }
                    placeholder="Ej: 30 días neto, 2% descuento pago anticipado..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isLoading}
          >
            Limpiar Formulario
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: "#FF8200" }}
            className="px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando Activo...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Crear Activo
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Dialog para imprimir etiqueta */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¡Activo Creado Exitosamente!</DialogTitle>
            <DialogDescription>
              ¿Deseas imprimir la etiqueta RFID ahora?
            </DialogDescription>
          </DialogHeader>

          {createdProduct && (
            <div className="space-y-3 py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Nombre:</strong> {createdProduct.name}
                  </p>
                  <p>
                    <strong>Serial:</strong> {createdProduct.serialNumber}
                  </p>
                  <p>
                    <strong>Código:</strong> {createdProduct.codigo}
                  </p>
                  <p className="font-mono text-xs">
                    <strong>RFID:</strong> {createdProduct.hexValue}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              className="w-full"
              style={{ backgroundColor: isPrinting ? "#ccc" : "#FF8200" }}
            >
              {isPrinting ? (
                <>
                  <Printer className="h-4 w-4 mr-2 animate-pulse" />
                  Imprimiendo...
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Etiqueta RFID
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowPrintDialog(false);
                setCreatedProduct(null);
              }}
              disabled={isPrinting}
            >
              Omitir por Ahora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
