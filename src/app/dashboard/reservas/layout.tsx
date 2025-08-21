import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva Reserva - CentroMundoX",
  description: "Reserva equipos y espacios de investigación",
};

export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
