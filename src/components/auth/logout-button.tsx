"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { clearClientAuthToken } from "@/lib/client-auth";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      // Limpiar token del cliente primero
      clearClientAuthToken();
      
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Usar window.location para forzar una recarga completa
        window.location.href = "/auth/login";
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así limpiar token del cliente si hay error
      clearClientAuthToken();
      window.location.href = "/auth/login";
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center space-x-2 border-gray-300 hover:bg-gray-50"
      style={{
        color: "#1859A9",
        borderColor: "#1859A9",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f8fafc";
        e.currentTarget.style.borderColor = "#003087";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "#1859A9";
      }}
    >
      <LogOut className="h-4 w-4" />
      <span>Cerrar Sesión</span>
    </Button>
  );
}
