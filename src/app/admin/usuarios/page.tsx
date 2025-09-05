"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/auth";

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  }, []);

  const checkAdminAndLoadUsers = useCallback(async () => {
    try {
      // Verificar que el usuario actual es admin
      const userResponse = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!userResponse.ok) {
        router.push("/auth/login");
        return;
      }

      const userData = await userResponse.json();
      setCurrentUser(userData);

      if (userData.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      // Cargar todos los usuarios
      await loadUsers();
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

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await loadUsers();
      }
    } catch (error) {
      console.error("Error actualizando rol:", error);
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
        await loadUsers();
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm)
  );

  if (loading) {
    return (
      <>
        <Navbar isAuthenticated={true} showAuthButtons={false} />
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
      <Navbar isAuthenticated={true} showAuthButtons={false} />
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
                    Administra los usuarios del sistema
                  </p>
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => router.push("/admin/usuarios/nuevo")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                      <TableHead>Equipos</TableHead>
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
                                  user.role === "admin" ? "#FF8200" : "#1859A9",
                              }}
                            >
                              {user.name.charAt(0)}
                              {user.lastName.charAt(0)}
                            </div>
                            <span>
                              {user.name} {user.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.cedula}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              if (user._id !== currentUser?._id) {
                                handleToggleRole(user._id, user.role);
                              }
                            }}
                          >
                            {user.role === "admin" ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : (
                              <UserIcon className="h-3 w-3 mr-1" />
                            )}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs font-mono">
                            {user.codigo_acceso || "-"}
                          </code>
                        </TableCell>
                        <TableCell>
                          {user.equipos_reservados?.length || 0}
                        </TableCell>
                        <TableCell>
                          {new Date(user.registrationDate).toLocaleDateString(
                            "es-ES"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/usuarios/${user._id}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
    </>
  );
}
