"use client";

import { useState, useEffect } from "react";
import { ProductType, CreateProductTypeData } from "@/types/product";
import { getActiveProductTypes, createProductType } from "@/lib/product-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Plus, Tag } from "lucide-react";

interface ProductTypeSelectorProps {
  selectedTypeId?: string;
  onTypeSelect: (typeId: string | undefined, tags: string[]) => void;
  disabled?: boolean;
}

export function ProductTypeSelector({ 
  selectedTypeId, 
  onTypeSelect, 
  disabled = false 
}: ProductTypeSelectorProps) {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateProductTypeData>({
    name: "",
    description: "",
    defaultTags: [],
    isActive: true,
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      const types = await getActiveProductTypes();
      setProductTypes(types);
    } catch (err) {
      console.error("Error loading product types:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = productTypes.find(type => type._id === selectedTypeId);

  const handleTypeSelect = (typeId: string) => {
    if (typeId === "create-new") {
      setIsCreateDialogOpen(true);
      return;
    }
    
    const type = productTypes.find(t => t._id === typeId);
    onTypeSelect(typeId, type?.defaultTags || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const newType = await createProductType(formData);
      await loadProductTypes();
      onTypeSelect(newType._id, newType.defaultTags);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el tipo de producto";
      setError(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      defaultTags: [],
      isActive: true,
    });
    setTagInput("");
    setError(null);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.defaultTags.includes(trimmedTag)) {
      setFormData({
        ...formData,
        defaultTags: [...formData.defaultTags, trimmedTag],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      defaultTags: formData.defaultTags.filter(tag => tag !== tagToRemove),
    });
  };


  return (
    <>
      <div className="space-y-2">
        <Label>Tipo de Activo</Label>
        <Select
          value={selectedTypeId || ""}
          onValueChange={handleTypeSelect}
        >
          <SelectTrigger disabled={disabled || loading}>
            <SelectValue placeholder="Seleccionar tipo de activo..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin tipo específico</SelectItem>
            {productTypes.map((type) => (
              <SelectItem key={type._id} value={type._id}>
                {type.name} - {type.description}
              </SelectItem>
            ))}
            <SelectItem value="create-new">
              <div className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Crear nuevo tipo...
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {selectedType && (
          <div className="mt-2">
            <Label className="text-sm text-gray-600">Etiquetas del tipo:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedType.defaultTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-4xl mx-auto w-full">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">Crear Nuevo Tipo de Activo</DialogTitle>
            <DialogDescription className="text-sm">
              Crea un nuevo tipo de activo con sus etiquetas predefinidas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <form id="new-product-type-form" onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej: COMPUTADORA"
                    required
                  />
                </div>
                
                <div>
                  <Label>Estado</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <input
                      type="checkbox"
                      id="isActive-selector"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isActive-selector">Activo</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe este tipo de activo..."
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label>Etiquetas Predefinidas</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Agregar etiqueta..."
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.defaultTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

            </form>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
              className="px-6 py-2 text-sm"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              form="new-product-type-form"
              style={{ backgroundColor: "#FF8200" }}
              className="px-6 py-2 text-sm"
            >
              Crear y Seleccionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}