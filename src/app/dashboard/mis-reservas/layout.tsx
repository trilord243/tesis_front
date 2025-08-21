import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Solicitudes - CentroMundoX",
  description: "Gestiona tus solicitudes de lentes VR/AR e historial",
};

export default function MisReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
