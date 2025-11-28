"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  UserPlus,
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
  Mail,
  Crown,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/auth";

interface UserWithRoles extends User {
  phone?: string;
}

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Create user dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    cedula: "",
    phone: "",
    role: "user" as "superadmin" | "admin" | "user",
  });

  const loadUsers = useCallback(async (userIsSuperAdmin: boolean) => {
    try {
      // Use different endpoint based on role
      const endpoint = userIsSuperAdmin ? "/api/admin/users/roles" : "/api/admin/users";
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }

      const data = await response.json();
      // Handle different response formats
      const usersData = userIsSuperAdmin ? data.data : data;
      setUsers(usersData);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  }, []);

  const checkAdminAndLoadUsers = useCallback(async () => {
    try {
      const userResponse = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!userResponse.ok) {
        router.push("/auth/login");
        return;
      }

      const userData = await userResponse.json();
      setCurrentUser(userData);

      const userIsSuperAdmin = userData.role === "superadmin";
      const userIsAdmin = userData.role === "admin" || userIsSuperAdmin;

      setIsSuperAdmin(userIsSuperAdmin);

      if (!userIsAdmin) {
        router.push("/dashboard");
        return;
      }

      await loadUsers(userIsSuperAdmin);
    } catch (error) {
      console.error("Error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router, loadUsers]);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [checkAdminAndLoadUsers]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!isSuperAdmin) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await loadUsers(isSuperAdmin);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "No se pudo cambiar el rol"}`);
      }
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await loadUsers(isSuperAdmin);
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const handleSendAccessCodeEmail = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Enviar código de acceso por email a ${userEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/send-access-code-email`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Código enviado exitosamente a ${data.data.email}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || errorData.error}`);
      }
    } catch (error) {
      console.error("Error enviando código por email:", error);
      alert("Error enviando código por email");
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.lastName || !newUser.email || !newUser.password || !newUser.cedula) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Usuario creado exitosamente: ${data.data.email}`);
        setCreateDialogOpen(false);
        setNewUser({
          name: "",
          lastName: "",
          email: "",
          password: "",
          cedula: "",
          phone: "",
          role: "user",
        });
        await loadUsers(isSuperAdmin);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
      alert("Error al crear usuario");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula?.includes(searchTerm)
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-600 hover:bg-red-700";
      case "admin":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Crown className="h-3 w-3 mr-1" />;
      case "admin":
        return <Shield className="h-3 w-3 mr-1" />;
      default:
        return <UserIcon className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      default:
        return "Usuario";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center"
          style={{ paddingTop: "64px" }}
        >
          <div className="flex items-center space-x-2">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: "#1859A9" }}
            />
            <span className="text-lg">Cargando usuarios...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={true}
        isSuperAdmin={isSuperAdmin}
      />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Panel Admin
              </Link>
              <div className="flex justify-between items-center">
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#1859A9" }}
                  >
                    Gestión de Usuarios
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isSuperAdmin
                      ? "Administra usuarios y asigna roles"
                      : "Administra los usuarios del sistema"}
                  </p>
                </div>
                {isSuperAdmin && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Usuario
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#1859A9" }}
                >
                  {users.length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Super Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.role === "superadmin").length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Administradores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#FF8200" }}
                >
                  {users.filter((u) => u.role === "admin").length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Usuarios Regulares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#003087" }}
                >
                  {users.filter((u) => u.role === "user").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-md mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, email o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuarios encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Código Acceso</TableHead>
                      <TableHead>Verificado</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{
                                backgroundColor:
                                  user.role === "superadmin"
                                    ? "#DC2626"
                                    : user.role === "admin"
                                      ? "#FF8200"
                                      : "#1859A9",
                              }}
                            >
                              {user.name?.charAt(0) || "?"}
                              {user.lastName?.charAt(0) || "?"}
                            </div>
                            <span>
                              {user.name} {user.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.cedula}</TableCell>
                        <TableCell>
                          {isSuperAdmin && user._id !== currentUser?._id ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`${getRoleBadgeColor(user.role)} text-white px-2 py-1 h-auto`}
                                >
                                  {getRoleIcon(user.role)}
                                  {getRoleLabel(user.role)}
                                  <ChevronDown className="h-3 w-3 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleChangeRole(user._id, "superadmin")}
                                  className="text-red-600"
                                >
                                  <Crown className="h-4 w-4 mr-2" />
                                  Super Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleChangeRole(user._id, "admin")}
                                  className="text-orange-600"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleChangeRole(user._id, "user")}
                                  className="text-blue-600"
                                >
                                  <UserIcon className="h-4 w-4 mr-2" />
                                  Usuario
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                              {getRoleIcon(user.role)}
                              {getRoleLabel(user.role)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs font-mono">
                            {user.codigo_acceso || "-"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.emailVerified ? "default" : "secondary"}>
                            {user.emailVerified ? "Sí" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.registrationDate
                            ? new Date(user.registrationDate).toLocaleDateString("es-ES")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {user.codigo_acceso && !user.codigo_acceso.startsWith("TEMP_") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => handleSendAccessCodeEmail(user._id, user.email)}
                                title="Enviar código por email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            {user._id !== currentUser?._id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Usuario Privilegiado</DialogTitle>
            <DialogDescription>
              Crea un usuario sin necesidad de verificación de email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  value={newUser.cedula}
                  onChange={(e) => setNewUser({ ...newUser, cedula: e.target.value })}
                  placeholder="12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+584121234567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value as "superadmin" | "admin" | "user" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Usuario
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-orange-600" />
                      Administrador
                    </div>
                  </SelectItem>
                  <SelectItem value="superadmin">
                    <div className="flex items-center">
                      <Crown className="h-4 w-4 mr-2 text-red-600" />
                      Super Administrador
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={creating}
              className="bg-green-600 hover:bg-green-700"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
