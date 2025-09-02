"use client";

import { useState, useEffect } from "react";
import { ProductType, CreateProductTypeData } from "@/types/product";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "@/lib/product-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Tag, Package2, ArrowLeft } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function TiposActivosPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState<CreateProductTypeData>({
    name: "",
    description: "",
    defaultTags: [],
    isActive: true,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      const types = await getAllProductTypes();
      setProductTypes(types);
    } catch (err) {
      setError("Error al cargar los tipos de productos");
      console.error("Error loading product types:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) {
        await updateProductType(editingType._id, formData);
      } else {
        await createProductType(formData);
      }
      await loadProductTypes();
      resetForm();
      setIsCreateDialogOpen(false);
      setEditingType(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar el tipo de producto";
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este tipo de producto?")) {
      try {
        await deleteProductType(id);
        await loadProductTypes();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al eliminar el tipo de producto";
        setError(errorMessage);
      }
    }
  };

  const handleEdit = (type: ProductType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
      defaultTags: [...type.defaultTags],
      isActive: type.isActive,
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      defaultTags: [],
      isActive: true,
    });
    setTagInput("");
    setEditingType(null);
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


  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Activos</h1>
          <p className="text-gray-600">
            Gestiona los tipos de activos y sus etiquetas predefinidas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/products">
            <Button variant="outline" style={{ borderColor: "#1859A9", color: "#1859A9" }}>
              <Package2 className="w-4 h-4 mr-2" />
              Ver Activos
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Tipo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl mx-auto w-full">
              <DialogHeader className="pb-3">
                <DialogTitle className="text-lg">
                  {editingType ? "Editar Tipo de Activo" : "Crear Nuevo Tipo de Activo"}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {editingType 
                    ? "Modifica los detalles del tipo de activo"
                    : "Crea un nuevo tipo de activo con sus etiquetas predefinidas"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <form id="product-type-form" onSubmit={handleSubmit} className="space-y-6">
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
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="isActive">Activo</Label>
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
                  form="product-type-form"
                  style={{ backgroundColor: "#FF8200" }}
                  className="px-6 py-2 text-sm"
                >
                  {editingType ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Activos Registrados</CardTitle>
          <CardDescription>
            Lista de todos los tipos de activos y sus etiquetas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Etiquetas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productTypes.map((type) => (
                <TableRow key={type._id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {type.defaultTags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={type.isActive ? "default" : "secondary"}>
                      {type.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(type._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {productTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No hay tipos de activos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}