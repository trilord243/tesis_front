"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Users, Code, Target, Plus, Trash2, Edit, Save, X, Loader2 } from "lucide-react";
import { UserTypeConfig, SoftwareConfig, PurposeConfig } from "@/types/lab-config";

export default function LabConfigPage() {
  const [activeTab, setActiveTab] = useState("user-types");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for each config type
  const [userTypes, setUserTypes] = useState<UserTypeConfig[]>([]);
  const [software, setSoftware] = useState<SoftwareConfig[]>([]);
  const [purposes, setPurposes] = useState<PurposeConfig[]>([]);

  // Edit/Create states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ value: "", label: "", order: 0 });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "user-types") {
        const res = await fetch("/api/lab-config/user-types");
        const data = await res.json();
        setUserTypes(data);
      } else if (activeTab === "software") {
        const res = await fetch("/api/lab-config/software");
        const data = await res.json();
        setSoftware(data);
      } else if (activeTab === "purposes") {
        const res = await fetch("/api/lab-config/purposes");
        const data = await res.json();
        setPurposes(data);
      }
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.value || !formData.label) {
      setError("Value y Label son requeridos");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const endpoint =
        activeTab === "user-types"
          ? "/api/lab-config/user-types"
          : activeTab === "software"
          ? "/api/lab-config/software"
          : "/api/lab-config/purposes";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear");
      }

      setSuccess("Creado exitosamente");
      setIsCreating(false);
      setFormData({ value: "", label: "", order: 0 });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        activeTab === "user-types"
          ? `/api/lab-config/user-types/${id}`
          : activeTab === "software"
          ? `/api/lab-config/software/${id}`
          : `/api/lab-config/purposes/${id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al actualizar");
      }

      setSuccess("Actualizado exitosamente");
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, isFixed?: boolean) => {
    if (isFixed) {
      setError("No se puede eliminar un elemento fijo");
      return;
    }

    if (!confirm("¿Está seguro de eliminar este elemento?")) return;

    setLoading(true);
    setError(null);
    try {
      const endpoint =
        activeTab === "user-types"
          ? `/api/lab-config/user-types/${id}`
          : activeTab === "software"
          ? `/api/lab-config/software/${id}`
          : `/api/lab-config/purposes/${id}`;

      const res = await fetch(endpoint, { method: "DELETE" });

      if (!res.ok && res.status !== 204) {
        const error = await res.json();
        throw new Error(error.message || "Error al eliminar");
      }

      setSuccess("Eliminado exitosamente");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: UserTypeConfig | SoftwareConfig | PurposeConfig) => {
    setEditingId(item._id);
    setFormData({ value: item.value, label: item.label, order: item.order });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ value: "", label: "", order: 0 });
  };

  const isSoftwareConfig = (item: UserTypeConfig | SoftwareConfig | PurposeConfig): item is SoftwareConfig => {
    return "isFixed" in item;
  };

  const renderList = () => {
    const items =
      activeTab === "user-types" ? userTypes : activeTab === "software" ? software : purposes;

    return (
      <div className="space-y-4">
        {isCreating && (
          <Card className="border-2 border-blue-500">
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <Label>Value (identificador único)</Label>
                  <Input
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="ej: profesor, unity, tesis"
                  />
                </div>
                <div>
                  <Label>Label (nombre visible)</Label>
                  <Input
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="ej: Profesor, Unity, Tesis"
                  />
                </div>
                <div>
                  <Label>Orden</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {items.map((item) => (
          <Card key={item._id}>
            <CardContent className="pt-6">
              {editingId === item._id ? (
                <div className="grid gap-4">
                  <div>
                    <Label>Value</Label>
                    <Input value={formData.value} disabled className="bg-gray-100" />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Orden</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(item._id)} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    <p className="text-sm text-gray-600">Value: {item.value}</p>
                    <p className="text-xs text-gray-500">Orden: {item.order}</p>
                    {isSoftwareConfig(item) && item.isFixed && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                        Fijo - No eliminable
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDelete(item._id, isSoftwareConfig(item) ? item.isFixed : false)}
                      disabled={isSoftwareConfig(item) && item.isFixed}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} isSuperAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Configuración del Laboratorio</h1>
                <p className="text-gray-600">Gestiona tipos de usuario, software y propósitos de uso</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user-types">
                <Users className="h-4 w-4 mr-2" />
                Tipos de Usuario
              </TabsTrigger>
              <TabsTrigger value="software">
                <Code className="h-4 w-4 mr-2" />
                Software
              </TabsTrigger>
              <TabsTrigger value="purposes">
                <Target className="h-4 w-4 mr-2" />
                Propósitos
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        {activeTab === "user-types" && "Tipos de Usuario"}
                        {activeTab === "software" && "Software Disponible"}
                        {activeTab === "purposes" && "Propósitos de Uso"}
                      </CardTitle>
                      <CardDescription>
                        {activeTab === "user-types" && "Configura los tipos de usuario del sistema"}
                        {activeTab === "software" && "Gestiona el software disponible en el laboratorio"}
                        {activeTab === "purposes" && "Define los propósitos de uso de las computadoras"}
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading && !isCreating && !editingId ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    renderList()
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
