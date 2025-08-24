"use client";

import { useState, useEffect } from "react";
import { createProduct, getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  AlertCircle,
  Package,
  Loader2,
  Tag,
} from "lucide-react";
import type { CreateProductData, Product } from "@/types/product";
import { ProductTypeSelector } from "./product-type-selector";

export function ProductForm() {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    serialNumber: "",
    type: "headset",
    headsetId: "",
    productTypeId: "",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    product?: Product;
  } | null>(null);
  const [headsets, setHeadsets] = useState<Product[]>([]);
  const [headsetsLoaded, setHeadsetsLoaded] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");
  const [defaultTags, setDefaultTags] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<string[]>([]);
  const [serialExists, setSerialExists] = useState(false);

  // Load all products for suggestions and headsets for controllers
  const loadProducts = async () => {
    const result = await getProducts();
    if (result.success && result.products) {
      setAllProducts(result.products);
      const headsetProducts = result.products.filter(p => p.type === "headset");
      setHeadsets(headsetProducts);
      setHeadsetsLoaded(true);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Update similar products when name changes
  useEffect(() => {
    if (formData.name.length >= 3 && allProducts.length > 0) {
      const searchTerm = formData.name.toLowerCase();
      const uniqueNames = [...new Set(allProducts.map(p => p.name))];
      const similar = uniqueNames
        .filter(name => 
          name.toLowerCase().includes(searchTerm) || 
          searchTerm.includes(name.toLowerCase())
        )
        .filter(name => name !== formData.name)
        .slice(0, 5);
      setSimilarProducts(similar);
    } else {
      setSimilarProducts([]);
    }
  }, [formData.name, allProducts]);

  // Check if serial number exists
  useEffect(() => {
    if (formData.serialNumber.length >= 3 && allProducts.length > 0) {
      const exists = allProducts.some(p => p.serialNumber === formData.serialNumber);
      setSerialExists(exists);
    } else {
      setSerialExists(false);
    }
  }, [formData.serialNumber, allProducts]);

  const handleTypeChange = (type: "headset" | "controller") => {
    setFormData(prev => ({ ...prev, type, headsetId: "" }));
  };

  const handleProductTypeSelect = (productTypeId: string | undefined, tags: string[]) => {
    setFormData(prev => ({ ...prev, productTypeId }));
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

  const handleCustomTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("El nombre del producto es requerido");
      }
      if (!formData.serialNumber.trim()) {
        throw new Error("El número de serie es requerido");
      }
      if (formData.type === "controller" && !formData.headsetId) {
        throw new Error("Selecciona el headset asociado para el controlador");
      }
      if (serialExists) {
        throw new Error("El número de serie ya existe. Debe ser único para cada activo");
      }

      const productData: CreateProductData = {
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim(),
        type: formData.type,
      };

      if (formData.type === "controller" && formData.headsetId) {
        productData.headsetId = formData.headsetId;
      }

      const result = await createProduct(productData);

      if (result.success && result.product) {
        setMessage({
          type: "success",
          text: `Producto "${result.product.name}" creado exitosamente`,
          product: result.product,
        });
        // Reset form
        setFormData({
          name: "",
          serialNumber: "",
          type: "headset",
          headsetId: "",
          productTypeId: "",
          tags: [],
        });
        setCustomTagInput("");
        setDefaultTags([]);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al crear el producto",
        });
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

  return (
    <div className="space-y-6">
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
          <AlertDescription className={
            message.type === "success" ? "text-green-800" : "text-red-800"
          }>
            {message.text}
            {message.product && (
              <div className="mt-2 text-sm">
                <p><strong>Código:</strong> {message.product.codigo}</p>
                <p><strong>EPC:</strong> {message.product.hexValue}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Type Selector - Primero */}
        <ProductTypeSelector
          selectedTypeId={formData.productTypeId}
          onTypeSelect={handleProductTypeSelect}
          disabled={isLoading}
        />

        {/* Product Name with suggestions */}
        <div>
          <Label htmlFor="name">Nombre del Activo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Computadora Dell, MetaQuest 3, Silla Ergonómica"
            required
            list="product-names-suggestions"
          />
          <datalist id="product-names-suggestions">
            {similarProducts.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
          {similarProducts.length > 0 && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <p className="text-blue-800 font-medium mb-1">Productos similares encontrados:</p>
              <div className="flex flex-wrap gap-1">
                {similarProducts.map((name, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-100 text-xs"
                    onClick={() => setFormData(prev => ({ ...prev, name }))}
                  >
                    {name}
                  </Badge>
                ))}
              </div>
              <p className="text-blue-600 text-xs mt-1">
                💡 Haz clic en una sugerencia para usar el mismo nombre y mantener consistencia
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            💡 Tip: Si existe un producto similar, usa el mismo nombre para mantener consistencia
          </p>
        </div>

        {/* Serial Number with numeric validation */}
        <div>
          <Label htmlFor="serialNumber">Número de Serie (Solo números) *</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => {
              // Solo permitir números
              const numericValue = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, serialNumber: numericValue }));
            }}
            placeholder="Ej: 123456789"
            required
            pattern="[0-9]+"
            title="Solo se permiten números"
            className={serialExists ? "border-red-500 bg-red-50" : ""}
          />
          {serialExists && (
            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm">
              <p className="text-red-800 font-medium">⚠️ Este número de serie ya existe</p>
              <p className="text-red-600 text-xs">Cada activo debe tener un número de serie único</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Solo números. Cada activo debe tener un número único.
          </p>
        </div>

        {/* Product Type (Hardware) */}
        <div>
          <Label>Categoría de Hardware *</Label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="headset"
                checked={formData.type === "headset"}
                onChange={() => handleTypeChange("headset")}
                className="mr-2"
              />
              Headset/VR
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="controller"
                checked={formData.type === "controller"}
                onChange={() => handleTypeChange("controller")}
                className="mr-2"
              />
              Controlador
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Categoría técnica del hardware para el sistema
          </p>
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          {/* Default Tags from Product Type */}
          {defaultTags.length > 0 && (
            <div>
              <Label className="text-sm text-gray-600">Etiquetas del tipo:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {defaultTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tags */}
          <div>
            <Label>Etiquetas Personalizadas</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyPress={handleCustomTagKeyPress}
                placeholder="Agregar etiqueta personalizada..."
              />
              <Button type="button" onClick={addCustomTag} size="sm" variant="outline">
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer text-xs"
                    onClick={() => removeCustomTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Headset Selection (only for controllers) */}
        {formData.type === "controller" && (
          <div>
            <label htmlFor="headsetId" className="block text-sm font-medium text-gray-700 mb-1">
              Headset Asociado *
            </label>
            <select
              id="headsetId"
              value={formData.headsetId}
              onChange={(e) => setFormData(prev => ({ ...prev, headsetId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un headset</option>
              {headsets.map((headset) => (
                <option key={headset._id} value={headset._id}>
                  {headset.name} - {headset.serialNumber}
                </option>
              ))}
            </select>
            {headsets.length === 0 && headsetsLoaded && (
              <p className="text-sm text-amber-600 mt-1">
                No hay headsets disponibles. Crea un headset primero.
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          style={{ backgroundColor: "#1859A9" }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando producto...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Crear Producto
            </>
          )}
        </Button>
      </form>
    </div>
  );
}