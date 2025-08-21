import { User } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, User as UserIcon, Shield, Clock } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const isAdmin = user.role === "admin";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5" />
          <CardTitle>Perfil de Usuario</CardTitle>
        </div>
        <CardDescription>Información de tu cuenta</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información Básica */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nombre Completo
            </label>
            <p className="text-sm font-medium">
              {user.name} {user.lastName}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-sm">{user.email}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Cédula
            </label>
            <p className="text-sm font-mono">{user.cedula}</p>
          </div>
        </div>

        {/* Rol y Estado */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Rol
              </span>
            </div>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Administrador" : "Usuario"}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Fecha de Registro
              </label>
              <p className="text-sm">
                {new Date(user.registrationDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Información de Acceso */}
        {user.codigo_acceso && (
          <div className="space-y-3 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Código de Acceso
              </label>
              <p className="text-lg font-mono font-bold text-primary">
                {user.codigo_acceso}
              </p>
            </div>

            {user.accessCodeExpiresAt && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Expira
                  </label>
                  <p className="text-sm">
                    {new Date(user.accessCodeExpiresAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Equipos Reservados */}
        {user.equipos_reservados && user.equipos_reservados.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <label className="text-sm font-medium text-muted-foreground">
              Equipos Reservados ({user.equipos_reservados.length})
            </label>
            <div className="space-y-1">
              {user.equipos_reservados.slice(0, 3).map((equipo, index) => (
                <p
                  key={index}
                  className="text-xs font-mono bg-muted px-2 py-1 rounded"
                >
                  {equipo}
                </p>
              ))}
              {user.equipos_reservados.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  y {user.equipos_reservados.length - 3} más...
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
