"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// Note: Table y Select se usan solo para Computadoras
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Settings,
  Users,
  Package,
  Target,
  Monitor,
  RefreshCw,
  LayoutGrid,
} from "lucide-react";
import { LabLayoutEditor } from "@/components/admin/lab-layout-editor";
import Link from "next/link";

interface LabConfig {
  _id: string;
  type: "user_type" | "software" | "purpose";
  value: string;
  label: string;
  isActive: boolean;
  order: number;
}

interface Computer {
  _id: string;
  number: number;
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  software: string[];
  specialization: string;
  description: string;
  isAvailable: boolean;
  maintenanceNotes: string;
  accessLevel: "normal" | "special";
  allowedUserTypes: string[];
  gridRow: number;
  gridCol: number;
}

type ConfigType = "user_type" | "software" | "purpose";

const CONFIG_LABELS: Record<ConfigType, { title: string; icon: typeof Users }> = {
  user_type: { title: "Tipos de Usuario", icon: Users },
  software: { title: "Software Disponible", icon: Package },
  purpose: { title: "Propósitos de Uso", icon: Target },
};

export default function ConfigLaboratorioPage() {
  const [configs, setConfigs] = useState<LabConfig[]>([]);
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("user_type");

  // Dialog states
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [computerDialogOpen, setComputerDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<LabConfig | null>(null);
  const [editingComputer, setEditingComputer] = useState<Computer | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states for config
  const [configForm, setConfigForm] = useState({
    type: "software" as ConfigType,
    value: "",
    label: "",
  });

  // Form states for computer
  const [computerForm, setComputerForm] = useState({
    number: 0,
    name: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    software: "",
    specialization: "",
    description: "",
    accessLevel: "normal" as "normal" | "special",
    allowedUserTypes: [] as string[],
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [configsRes, computersRes] = await Promise.all([
        fetch("/api/lab-config"),
        fetch("/api/computers"),
      ]);

      if (configsRes.ok) {
        const configsData = await configsRes.json();
        setConfigs(configsData);
      }

      if (computersRes.ok) {
        const computersData = await computersRes.json();
        setComputers(computersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrar configs por tipo
  const getConfigsByType = (type: ConfigType) => {
    return configs.filter((c) => c.type === type).sort((a, b) => a.order - b.order);
  };

  // Handlers para configuraciones
  const handleOpenConfigDialog = (config?: LabConfig) => {
    if (config) {
      setEditingConfig(config);
      setConfigForm({
        type: config.type,
        value: config.value,
        label: config.label,
      });
    } else {
      setEditingConfig(null);
      setConfigForm({
        type: activeTab as ConfigType,
        value: "",
        label: "",
      });
    }
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const url = editingConfig
        ? `/api/lab-config/${editingConfig._id}`
        : "/api/lab-config";

      const method = editingConfig ? "PATCH" : "POST";

      const body = editingConfig
        ? { label: configForm.label }
        : configForm;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchData();
        setConfigDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving config:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta opción?")) return;

    try {
      const response = await fetch(`/api/lab-config/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting config:", error);
    }
  };

  // Handlers para computadoras
  const handleOpenComputerDialog = (computer?: Computer) => {
    if (computer) {
      setEditingComputer(computer);
      setComputerForm({
        number: computer.number,
        name: computer.name,
        cpu: computer.cpu,
        gpu: computer.gpu,
        ram: computer.ram,
        storage: computer.storage,
        software: computer.software.join(", "),
        specialization: computer.specialization,
        description: computer.description,
        accessLevel: computer.accessLevel,
        allowedUserTypes: computer.allowedUserTypes || [],
      });
    } else {
      setEditingComputer(null);
      const maxNumber = computers.length > 0
        ? Math.max(...computers.map((c) => c.number))
        : 0;
      setComputerForm({
        number: maxNumber + 1,
        name: "",
        cpu: "",
        gpu: "",
        ram: "",
        storage: "",
        software: "",
        specialization: "",
        description: "",
        accessLevel: "normal",
        allowedUserTypes: [],
      });
    }
    setComputerDialogOpen(true);
  };

  const handleSaveComputer = async () => {
    setSaving(true);
    try {
      const url = editingComputer
        ? `/api/computers/${editingComputer.number}`
        : "/api/computers";

      const method = editingComputer ? "PATCH" : "POST";

      const body = {
        ...computerForm,
        software: computerForm.software.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchData();
        setComputerDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving computer:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteComputer = async (number: number) => {
    if (!confirm(`¿Estás seguro de eliminar la computadora #${number}?`)) return;

    try {
      const response = await fetch(`/api/computers/${number}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting computer:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar isAuthenticated showAuthButtons={false} isAdmin isSuperAdmin />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar isAuthenticated showAuthButtons={false} isAdmin isSuperAdmin />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#FF820020", color: "#FF8200" }}
                  >
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                      Configuración del Laboratorio
                    </h1>
                    <p className="text-sm text-gray-600">
                      Gestiona opciones del formulario de reservas y computadoras
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="user_type">
                <Users className="h-4 w-4 mr-2" />
                Tipos de Usuario
              </TabsTrigger>
              <TabsTrigger value="software">
                <Package className="h-4 w-4 mr-2" />
                Software
              </TabsTrigger>
              <TabsTrigger value="purpose">
                <Target className="h-4 w-4 mr-2" />
                Propósitos
              </TabsTrigger>
              <TabsTrigger value="computers">
                <Monitor className="h-4 w-4 mr-2" />
                Computadoras
              </TabsTrigger>
              <TabsTrigger value="layout">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Plano
              </TabsTrigger>
            </TabsList>

            {/* Config Tabs */}
            {(["user_type", "software", "purpose"] as ConfigType[]).map((type) => (
              <TabsContent key={type} value={type}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{CONFIG_LABELS[type].title}</CardTitle>
                        <CardDescription>
                          Opciones que aparecen en el formulario de reservas
                        </CardDescription>
                      </div>
                      <Button onClick={() => handleOpenConfigDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {getConfigsByType(type).length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <p className="mb-4">No hay opciones configuradas</p>
                        <Button onClick={() => handleOpenConfigDialog()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar primera opción
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {getConfigsByType(type).map((config, index) => (
                          <div
                            key={config._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                              <span className="font-medium">{config.label}</span>
                              {!config.isActive && (
                                <Badge variant="secondary" className="text-xs">
                                  Inactivo
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenConfigDialog(config)}
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteConfig(config._id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            {/* Computers Tab */}
            <TabsContent value="computers">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Computadoras del Laboratorio</CardTitle>
                      <CardDescription>
                        Gestiona las computadoras disponibles para reservar
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleOpenComputerDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Computadora
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Especialización</TableHead>
                        <TableHead>Nivel de Acceso</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {computers
                        .sort((a, b) => a.number - b.number)
                        .map((computer) => (
                          <TableRow key={computer._id}>
                            <TableCell className="font-bold">{computer.number}</TableCell>
                            <TableCell>{computer.name}</TableCell>
                            <TableCell>{computer.specialization}</TableCell>
                            <TableCell>
                              <Badge variant={computer.accessLevel === "special" ? "default" : "outline"}>
                                {computer.accessLevel === "special" ? "Especial" : "Normal"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={computer.isAvailable ? "default" : "secondary"}>
                                {computer.isAvailable ? "Disponible" : "No disponible"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenComputerDialog(computer)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComputer(computer.number)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      {computers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            No hay computadoras configuradas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Plano del Laboratorio</CardTitle>
                    <CardDescription>
                      Organiza visualmente la distribución de las computadoras en el laboratorio
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <LabLayoutEditor
                    computers={computers}
                    userTypes={configs.filter((c) => c.type === "user_type").map((c) => ({
                      _id: c._id,
                      value: c.value,
                      label: c.label,
                      isActive: c.isActive,
                    }))}
                    onSave={async (computer) => {
                      const response = await fetch(`/api/computers/${computer.number}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: computer.name,
                          cpu: computer.cpu,
                          gpu: computer.gpu,
                          ram: computer.ram,
                          storage: computer.storage,
                          software: computer.software,
                          specialization: computer.specialization,
                          description: computer.description,
                          accessLevel: computer.accessLevel,
                          allowedUserTypes: computer.allowedUserTypes,
                          isAvailable: computer.isAvailable,
                          maintenanceNotes: computer.maintenanceNotes,
                          gridRow: computer.gridRow,
                          gridCol: computer.gridCol,
                        }),
                      });
                      if (response.ok) {
                        await fetchData();
                      }
                    }}
                    onAdd={async (computer) => {
                      const response = await fetch("/api/computers", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(computer),
                      });
                      if (response.ok) {
                        await fetchData();
                      }
                    }}
                    onDelete={async (computerNumber) => {
                      const response = await fetch(`/api/computers/${computerNumber}`, {
                        method: "DELETE",
                      });
                      if (response.ok) {
                        await fetchData();
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Config Dialog - Simplificado */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? "Editar" : "Agregar"} {CONFIG_LABELS[activeTab as ConfigType]?.title.slice(0, -1) || "Opción"}
              </DialogTitle>
              <DialogDescription>
                {editingConfig
                  ? "Modifica el nombre de esta opción"
                  : `Escribe el nombre que verán los usuarios`}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={configForm.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    // Generar valor automático del label
                    const value = label
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                      .replace(/[^a-z0-9\s]/g, "") // Solo letras, números y espacios
                      .trim()
                      .replace(/\s+/g, "_"); // Espacios a guiones bajos
                    setConfigForm({
                      ...configForm,
                      label,
                      value: editingConfig ? configForm.value : value,
                    });
                  }}
                  placeholder={
                    activeTab === "user_type"
                      ? "Ej: Profesor, Estudiante, Investigador..."
                      : activeTab === "software"
                        ? "Ej: Unity, Blender, MATLAB..."
                        : "Ej: Tesis, Clases, Investigación..."
                  }
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveConfig}
                disabled={saving || !configForm.label.trim()}
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingConfig ? "Guardar" : "Agregar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Computer Dialog */}
        <Dialog open={computerDialogOpen} onOpenChange={setComputerDialogOpen}>
          <DialogContent className="w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingComputer ? "Editar Computadora" : "Nueva Computadora"}
              </DialogTitle>
              <DialogDescription>
                {editingComputer
                  ? "Modifica las características de la computadora"
                  : "Agrega una nueva computadora al laboratorio"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  type="number"
                  value={computerForm.number}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, number: parseInt(e.target.value) })
                  }
                  disabled={!!editingComputer}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={computerForm.name}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, name: e.target.value })
                  }
                  placeholder="Workstation VR-01"
                />
              </div>
              <div className="space-y-2">
                <Label>CPU</Label>
                <Input
                  value={computerForm.cpu}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, cpu: e.target.value })
                  }
                  placeholder="Intel Core i9-14900K"
                />
              </div>
              <div className="space-y-2">
                <Label>GPU</Label>
                <Input
                  value={computerForm.gpu}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, gpu: e.target.value })
                  }
                  placeholder="NVIDIA RTX 4090 24GB"
                />
              </div>
              <div className="space-y-2">
                <Label>RAM</Label>
                <Input
                  value={computerForm.ram}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, ram: e.target.value })
                  }
                  placeholder="128GB DDR5"
                />
              </div>
              <div className="space-y-2">
                <Label>Almacenamiento</Label>
                <Input
                  value={computerForm.storage}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, storage: e.target.value })
                  }
                  placeholder="2TB NVMe SSD"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Software (separado por comas)</Label>
                <Input
                  value={computerForm.software}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, software: e.target.value })
                  }
                  placeholder="Unity, Blender, Unreal Engine 5"
                />
              </div>
              <div className="space-y-2">
                <Label>Especialización</Label>
                <Input
                  value={computerForm.specialization}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, specialization: e.target.value })
                  }
                  placeholder="Desarrollo VR/AR"
                />
              </div>
              <div className="space-y-2">
                <Label>Nivel de Acceso</Label>
                <Select
                  value={computerForm.accessLevel}
                  onValueChange={(v) =>
                    setComputerForm({
                      ...computerForm,
                      accessLevel: v as "normal" | "special",
                      // Limpiar allowedUserTypes si cambia a normal
                      allowedUserTypes: v === "normal" ? [] : computerForm.allowedUserTypes,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (todos los usuarios)</SelectItem>
                    <SelectItem value="special">Especial (restringido)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {computerForm.accessLevel === "special" && (
                <div className="col-span-2 space-y-2">
                  <Label>Tipos de Usuario Permitidos</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Selecciona los tipos de usuario que pueden acceder a esta computadora.
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md bg-gray-50">
                    {configs
                      .filter((c) => c.type === "user_type" && c.isActive)
                      .map((userType) => {
                        const isSelected = computerForm.allowedUserTypes.includes(userType.value);
                        return (
                          <div
                            key={userType._id}
                            className={`
                              flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                              ${isSelected ? "bg-blue-100 border-blue-300 border" : "bg-white border border-gray-200 hover:bg-gray-100"}
                            `}
                            onClick={() => {
                              const newAllowed = isSelected
                                ? computerForm.allowedUserTypes.filter((t) => t !== userType.value)
                                : [...computerForm.allowedUserTypes, userType.value];
                              setComputerForm({
                                ...computerForm,
                                allowedUserTypes: newAllowed,
                              });
                            }}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm">{userType.label}</span>
                          </div>
                        );
                      })}
                  </div>
                  {computerForm.allowedUserTypes.length > 0 && (
                    <p className="text-xs text-blue-600">
                      {computerForm.allowedUserTypes.length} tipo(s) seleccionado(s)
                    </p>
                  )}
                </div>
              )}
              <div className="col-span-2 space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={computerForm.description}
                  onChange={(e) =>
                    setComputerForm({ ...computerForm, description: e.target.value })
                  }
                  placeholder="Descripción de la computadora y sus capacidades..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setComputerDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveComputer} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
