"use client";

import QRCode from "react-qr-code";
import { WhatsAppResendButton } from "@/components/ui/whatsapp-resend-button";
import { EmailResendButton } from "@/components/ui/email-resend-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, Shield } from "lucide-react";

interface UserQRDisplayProps {
  qrData: string;
  currentCode?: string | null | undefined;
  userPhone?: string | undefined;
  userEmail?: string | undefined;
  isEmailVerified?: boolean;
  isAdmin?: boolean;
}

export function UserQRDisplay({ qrData, currentCode, userPhone, userEmail, isEmailVerified = true, isAdmin = false }: UserQRDisplayProps) {
  const hasAccessCode = currentCode || isAdmin;
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" style={{ color: isAdmin ? "#FF8200" : "#1859A9" }} />
              <span>
                {isAdmin
                  ? "Código QR Administrativo"
                  : "Código QR Personal"}
              </span>
            </CardTitle>
            <CardDescription>
              {isAdmin
                ? "Presenta este código para acceso administrativo completo"
                : "Presenta este código en la entrada del centro"}
            </CardDescription>
          </div>
          {/* Botones de reenvío solo si hay código */}
          {hasAccessCode && (
            <div className="flex gap-2">
              <WhatsAppResendButton
                isAdmin={isAdmin}
                userPhone={userPhone}
                accessCode={currentCode || undefined}
                disabled={!userPhone || !currentCode}
              />
              <EmailResendButton
                userEmail={userEmail}
                accessCode={currentCode || undefined}
                disabled={!userEmail || !currentCode}
                isEmailVerified={isEmailVerified}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {hasAccessCode ? (
          <div className="bg-white p-6 rounded-lg shadow-inner">
            <QRCode
              value={qrData}
              size={250}
              level="H"
              fgColor={isAdmin ? "#FF8200" : "#1859A9"}
              bgColor="#FFFFFF"
            />
          </div>
        ) : (
          <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-8 rounded-lg text-center">
            <Shield className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-800 mb-2">
              Código de acceso pendiente
            </h3>
            <p className="text-amber-700 text-sm">
              Tu código QR se generará cuando un administrador apruebe tu solicitud de equipos
            </p>
          </div>
        )}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {isAdmin ? "Código de Acceso Admin" : "Código de Acceso"}
          </p>
          <p
            className="font-mono font-bold text-lg"
            style={{ color: "#FF8200" }}
          >
            {isAdmin ? (currentCode || "ADMIN_FULL_ACCESS") : (currentCode || "Pendiente")}
          </p>
          {isAdmin && (
            <div className="mt-2">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: "#FF8200" }}
              >
                <Shield className="h-3 w-3 mr-1" />
                ADMINISTRADOR
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}