"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  User as UserIcon,
  Mail,
  CreditCard,
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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types/auth";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    cedula: "",
  });

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error("Error al cargar datos del usuario");
      }

      const userData = await response.json();
      if (userData?.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }
      setUser(userData);
      setFormData({
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        cedula: userData.cedula,
      });
    } catch (err) {
      setError("Error al cargar los datos del perfil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Cargar datos del usuario
    fetchUserData();
  }, [fetchUserData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess("Perfil actualizado exitosamente");

      // Recargar datos después de 2 segundos
      setTimeout(() => {
        fetchUserData();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el perfil"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (loading) {
    return (
      <>
        <Navbar isAuthenticated={true} showAuthButtons={false} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 md:pt-24">
          <div className="flex items-center space-x-2">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: "#1859A9" }}
            />
            <span className="text-lg">Cargando perfil...</span>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar
          isAuthenticated={true}
          showAuthButtons={false}
          isAdmin={false}
        />
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">
                Error al cargar el perfil. Por favor, intente nuevamente.
              </AlertDescription>
            </Alert>
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
        isAdmin={user?.role === "admin"}
      />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Dashboard
              </Link>
              <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                Mi Perfil
              </h1>
              <p className="text-gray-600 mt-1">
                Actualiza tu información personal
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del usuario */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#1859A9" }}
                  >
                    <UserIcon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-center">
                    {user.name} {user.lastName}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {user.role === "admin" ? "Administrador" : "Usuario"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Miembro desde</p>
                      <p className="font-medium">
                        {new Date(user.registrationDate).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Código de acceso</p>
                      {user.codigo_acceso ? (
                        <div>
                          <p
                            className="font-mono font-bold"
                            style={{ color: "#FF8200" }}
                          >
                            {user.codigo_acceso}
                          </p>
                          {user.accessCodeExpiresAt && (
                            <p className="text-xs text-amber-700 mt-1">
                              Expira: {new Date(user.accessCodeExpiresAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-amber-600 text-sm italic">
                          Pendiente de aprobación de solicitud
                        </p>
                      )}
                    </div>
                    {user.equipos_reservados &&
                      user.equipos_reservados.length > 0 && (
                        <div>
                          <p className="text-gray-500">Equipos reservados</p>
                          <p className="font-medium">
                            {user.equipos_reservados.length} equipos
                          </p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulario de edición */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tus datos personales. Los cambios se guardarán
                    automáticamente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4 bg-red-50 border-red-200">
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                      <AlertDescription className="text-green-700">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange("name")}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange("lastName")}
                          placeholder="Tu apellido"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cedula">
                        <CreditCard className="inline h-4 w-4 mr-1" />
                        Cédula
                      </Label>
                      <Input
                        id="cedula"
                        value={formData.cedula}
                        onChange={handleInputChange("cedula")}
                        placeholder="Tu número de cédula"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tu cédula es importante para la identificación en el
                        centro
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full md:w-auto"
                        style={{ backgroundColor: "#FF8200" }}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
