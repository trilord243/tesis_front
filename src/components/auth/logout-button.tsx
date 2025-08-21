"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
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
