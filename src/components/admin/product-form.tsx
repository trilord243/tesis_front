"use client";

import { useState } from "react";
import { createProduct, getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Package,
  Loader2,
} from "lucide-react";
import type { CreateProductData, Product } from "@/types/product";

export function ProductForm() {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    serialNumber: "",
    type: "headset",
    headsetId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    product?: Product;
  } | null>(null);
  const [headsets, setHeadsets] = useState<Product[]>([]);
  const [headsetsLoaded, setHeadsetsLoaded] = useState(false);

  // Load headsets when controller type is selected
  const loadHeadsets = async () => {
    if (headsetsLoaded) return;
    
    const result = await getProducts();
    if (result.success) {
      const headsetProducts = result.products?.filter(p => p.type === "headset") || [];
      setHeadsets(headsetProducts);
      setHeadsetsLoaded(true);
    }
  };

  const handleTypeChange = (type: "headset" | "controller") => {
    setFormData(prev => ({ ...prev, type, headsetId: "" }));
    if (type === "controller") {
      loadHeadsets();
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
        });
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
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: MetaQuest 3, Controller izquierdo MQ3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Serial Number */}
        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Serie *
          </label>
          <input
            type="text"
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
            placeholder="Ej: MQ3-12345, CTRL-L-67890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Producto *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="headset"
                checked={formData.type === "headset"}
                onChange={() => handleTypeChange("headset")}
                className="mr-2"
              />
              Headset
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