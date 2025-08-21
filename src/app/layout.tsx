import type { Metadata, Viewport } from "next";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Centro Mundo X - Reservas",
  description:
    "Sistema de reservas Centro Mundo X - Excelencia, Innovación y espíritu emprendedor",
  keywords: ["reservas", "centro mundo x", "innovación", "excelencia"],
  authors: [{ name: "Centro Mundo X" }],
  other: {
    // Preconnect to Google Fonts
    preconnect: "https://fonts.googleapis.com",
    "preconnect-crossorigin": "https://fonts.gstatic.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Roboto+Condensed:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-background font-roboto antialiased"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
