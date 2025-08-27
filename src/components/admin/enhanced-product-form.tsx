"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  X,
  Tag,
  Package,
  Printer,
} from "lucide-react";
import type { CreateProductData, Product, ProductType } from "@/types/product";
import { createProduct, printProductLabel, getProducts } from "@/lib/products";
import { getActiveProductTypes } from "@/lib/product-types";
import { ProductTypeSelector } from "./product-type-selector";
import { ProductNameInput } from "./product-name-input";

export function EnhancedProductForm() {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    serialNumber: "",
    type: "",
    productTypeId: undefined,
    tags: [],
  });
  
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [defaultTags, setDefaultTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    product?: Product;
  } | null>(null);

  // Cargar tipos de productos y productos existentes
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [typesResult, productsResult] = await Promise.all([
        getActiveProductTypes(),
        getProducts()
      ]);

      setProductTypes(typesResult);
      if (productsResult.success) {
        setAllProducts(productsResult.products || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Obtener el tipo de producto seleccionado
  const selectedProductType = useMemo(() => {
    return productTypes.find(type => type._id === formData.productTypeId);
  }, [productTypes, formData.productTypeId]);

  // Verificar si el número de serie ya existe
  const serialNumberExists = useMemo(() => {
    return allProducts.some(p => 
      p.serialNumber.toLowerCase() === formData.serialNumber.toLowerCase()
    );
  }, [formData.serialNumber, allProducts]);

  const handleProductTypeSelect = (productTypeId: string | undefined, tags: string[]) => {
    const selectedType = productTypes.find(type => type._id === productTypeId);
    
    setFormData(prev => ({ 
      ...prev, 
      productTypeId,
      type: selectedType?.name || "",
    }));
    setDefaultTags(tags);
  };

  const addCustomTag = () => {
    const trimmedTag = customTagInput.trim();
    if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), trimmedTag],
      }));
      setCustomTagInput("");
    }
  };

  const removeCustomTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      serialNumber: "",
      type: "",
      productTypeId: undefined,
      tags: [],
    });
    setDefaultTags([]);
    setCustomTagInput("");
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (serialNumberExists) {
      setMessage({
        type: "error",
        text: "Ya existe un producto con este número de serie"
      });
      return;
    }

    if (!selectedProductType) {
      setMessage({
        type: "error",
        text: "Por favor selecciona un tipo de producto"
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const productData: CreateProductData = {
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim(),
        type: selectedProductType.name,
        productTypeId: formData.productTypeId,
        tags: formData.tags || [],
      };

      const result = await createProduct(productData);

      if (result.success) {
        if (result.product) {
          setMessage({
            type: "success",
            text: `Producto creado exitosamente con código EPC: ${result.product.hexValue}`,
            product: result.product,
          });
        } else {
          setMessage({
            type: "success",
            text: "Producto creado exitosamente",
          });
        }
        
        // Recargar la lista de productos
        const productsResult = await getProducts();
        if (productsResult.success) {
          setAllProducts(productsResult.products || []);
        }

        // No resetear el formulario para permitir impresión
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al crear el producto",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error inesperado al crear el producto",
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!message?.product?.hexValue) return;

    try {
      setIsPrinting(true);
      const printResult = await printProductLabel(message.product.hexValue);

      if (printResult.success) {
        setMessage(prev => prev ? {
          ...prev,
          text: prev.text + " - Etiqueta enviada a impresión"
        } : null);
      } else {
        setMessage(prev => prev ? {
          ...prev,
          text: prev.text + " - Error al imprimir etiqueta"
        } : null);
      }
    } catch (error) {
      console.error("Error printing:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" style={{ color: "#1859A9" }} />
          <span>Crear Nuevo Activo</span>
        </CardTitle>
        <CardDescription>
          Completa la información del activo. Los tipos y sugerencias se cargan automáticamente.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {message && (
          <Alert className={`${
            message.type === "success" 
              ? "border-green-200 bg-green-50" 
              : "border-red-200 bg-red-50"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription 
              className={message.type === "success" ? "text-green-800" : "text-red-800"}
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de Tipo de Producto */}
          <ProductTypeSelector
            selectedTypeId={formData.productTypeId}
            onTypeSelect={handleProductTypeSelect}
            disabled={isLoading}
          />

          {/* Input de Nombre con Sugerencias */}
          <ProductNameInput
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            productTypeName={selectedProductType?.name}
            disabled={isLoading}
            placeholder="Ej: Meta Quest 3, Dell OptiPlex..."
          />

          {/* Número de Serie */}
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Número de Serie</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              placeholder="Número de serie único del activo"
              disabled={isLoading}
              required
            />
            {serialNumberExists && formData.serialNumber && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Este número de serie ya existe
              </p>
            )}
          </div>

          {/* Etiquetas del Tipo */}
          {defaultTags.length > 0 && (
            <div className="space-y-2">
              <Label>Etiquetas del Tipo</Label>
              <div className="flex flex-wrap gap-2">
                {defaultTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Etiquetas Personalizadas */}
          <div className="space-y-3">
            <Label>Etiquetas Adicionales (Opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                placeholder="Agregar etiqueta personalizada..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addCustomTag} 
                size="sm" 
                disabled={isLoading || !customTagInput.trim()}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-red-50"
                    onClick={() => removeCustomTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isLoading || serialNumberExists || !selectedProductType}
              className="flex-1"
              style={{ backgroundColor: "#1859A9" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Activo
                </>
              )}
            </Button>

            {message?.product && (
              <Button
                type="button"
                onClick={handlePrint}
                disabled={isPrinting}
                variant="outline"
                style={{ 
                  borderColor: "#FF8200", 
                  color: "#FF8200",
                  backgroundColor: isPrinting ? "#FFF8F0" : "white"
                }}
              >
                {isPrinting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Imprimiendo...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir Etiqueta
                  </>
                )}
              </Button>
            )}

            {message?.product && (
              <Button
                type="button"
                onClick={resetForm}
                variant="ghost"
                className="text-gray-600"
              >
                Crear Otro
              </Button>
            )}
          </div>
        </form>

        {/* Información del EPC generado */}
        {message?.product && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                Información del Activo Creado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Código EPC:</span>
                  <p className="font-mono text-xs bg-white p-2 rounded border">
                    {message.product.hexValue}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Código Interno:</span>
                  <p className="font-mono text-xs bg-white p-2 rounded border">
                    {message.product.codigo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}