"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
  Calendar,
  FileText,
  User,
  QrCode,
  ClipboardList,
  Package2,
  Tags,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  isAuthenticated?: boolean;
  showAuthButtons?: boolean;
  isAdmin?: boolean;
}

export function Navbar({
  isAuthenticated = false,
  showAuthButtons = true,
  isAdmin = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Items para usuarios no autenticados
  const publicNavItems = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "#reservas",
      label: "Reservas",
      icon: Calendar,
    },
    {
      href: "/demo-reserva",
      label: "¿Cómo Reservar?",
      icon: FileText,
    },
    {
      href: "#contacto",
      label: "Contacto",
      icon: Home,
    },
  ];

  // Items para usuarios autenticados regulares
  const regularUserNavItems = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/reservas",
      label: "Solicitar Lentes",
      icon: Calendar,
    },
    {
      href: "/dashboard/mis-reservas",
      label: "Mis Solicitudes",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/perfil",
      label: "Mi Perfil",
      icon: User,
    },
    {
      href: "/dashboard/qr",
      label: "Mi QR",
      icon: QrCode,
    },
  ];

  // Items para administradores
  const adminNavItems = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/admin/dashboard",
      label: "Dashboard Admin",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/activos",
      label: "Gestión de Activos",
      icon: Package2,
    },
    {
      href: "/admin/tipos-activos",
      label: "Tipos de Activos",
      icon: Tags,
    },
    {
      href: "/admin/solicitudes",
      label: "Solicitudes de Préstamo",
      icon: ClipboardList,
    },
    {
      href: "/admin/qr",
      label: "Mi QR Admin",
      icon: QrCode,
    },
  ];

  const authNavItems = isAdmin ? adminNavItems : regularUserNavItems;

  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  const authItems = [
    {
      href: "/auth/login",
      label: "Iniciar Sesión",
      icon: LogIn,
      variant: "outline" as const,
      show: !isAuthenticated && showAuthButtons,
    },
    {
      href: "/auth/register",
      label: "Registrarse",
      icon: UserPlus,
      variant: "secondary" as const,
      show: !isAuthenticated && showAuthButtons,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 via-white to-orange-50 backdrop-blur-sm border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/centro-mundo-x-logo.png"
              alt="Centro Mundo X"
              width={240}
              height={80}
              className="h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? "text-brand-primary bg-blue-50"
                      : "text-brand-secondary hover:text-brand-primary hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Botón Reservar Ahora para usuarios no autenticados */}
            {!isAuthenticated && !isAdmin && (
              <a href="/demo-reserva">
                <Button className="bg-brand-orange hover:bg-brand-orange-secondary text-white font-semibold px-6 py-2">
                  Reservar Ahora
                </Button>
              </a>
            )}

            {/* Botón Solicitar Lentes para usuarios autenticados */}
            {isAuthenticated && !isAdmin && (
              <Link href="/dashboard/reservas">
                <Button
                  className="bg-brand-orange hover:bg-brand-orange-secondary text-white font-semibold px-6 py-2"
                  style={{ backgroundColor: "#FF8200" }}
                >
                  Solicitar Lentes
                </Button>
              </Link>
            )}

            {/* Botones de autenticación */}
            {authItems.map((item) => {
              if (!item.show) return null;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.variant}
                    size="sm"
                    data-tour={
                      item.href === "/auth/register"
                        ? "register-button"
                        : item.href === "/auth/login"
                        ? "login-button"
                        : undefined
                    }
                    className={`flex items-center space-x-2 ${
                      item.variant === "secondary"
                        ? "text-white hover:opacity-90"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    } ${pathname === item.href ? "ring-2 ring-blue-200" : ""}`}
                    style={
                      item.variant === "secondary"
                        ? { backgroundColor: "#FF8200", borderColor: "#FF8200" }
                        : undefined
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* Botón de logout para usuarios autenticados */}
            {isAuthenticated && <LogoutButton />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-b from-blue-50/50 to-white border-t border-gray-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? "text-brand-primary bg-blue-50"
                        : "text-brand-secondary hover:text-brand-primary hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2">
                {!isAuthenticated && !isAdmin && (
                  <a href="/demo-reserva" className="block">
                    <Button
                      className="w-full bg-brand-orange hover:bg-brand-orange-secondary text-white font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Reservar Ahora
                    </Button>
                  </a>
                )}

                {isAuthenticated && !isAdmin && (
                  <Link href="/dashboard/reservas" className="block">
                    <Button
                      className="w-full bg-brand-orange hover:bg-brand-orange-secondary text-white font-semibold"
                      style={{ backgroundColor: "#FF8200" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Solicitar Lentes
                    </Button>
                  </Link>
                )}

                {authItems.map((item) => {
                  if (!item.show) return null;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="block">
                      <Button
                        variant={item.variant}
                        className={`w-full flex items-center justify-center space-x-2 ${
                          item.variant === "secondary"
                            ? "text-white"
                            : "border-blue-600 text-blue-600"
                        }`}
                        style={
                          item.variant === "secondary"
                            ? {
                                backgroundColor: "#FF8200",
                                borderColor: "#FF8200",
                              }
                            : undefined
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}

                {/* Logout button en móvil */}
                {isAuthenticated && (
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <LogoutButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
