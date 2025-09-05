"use client";

import QRCode from "react-qr-code";
import { AccessCodeManager } from "./access-code-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, Shield, Key } from "lucide-react";

interface AdminQRDisplayProps {
  qrData: string;
  currentCode?: string | null | undefined;
  userPhone?: string | undefined;
}

export function AdminQRDisplay({ qrData, currentCode, userPhone }: AdminQRDisplayProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" style={{ color: "#FF8200" }} />
              <span>Código QR Administrativo</span>
            </CardTitle>
            <CardDescription>
              Presenta este código para acceso administrativo completo
            </CardDescription>
          </div>
          <AccessCodeManager currentCode={currentCode} userPhone={userPhone} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-inner">
          <QRCode
            value={qrData}
            size={250}
            level="H"
            fgColor="#FF8200"
            bgColor="#FFFFFF"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Código de Acceso Administrativo</p>
          <p
            className="font-mono font-bold text-lg"
            style={{ color: "#FF8200" }}
          >
            {currentCode || "ADMIN_FULL_ACCESS"}
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: "#FF8200" }}
            >
              <Shield className="h-3 w-3 mr-1" />
              ADMINISTRADOR
            </span>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: "#1859A9" }}
            >
              <Key className="h-3 w-3 mr-1" />
              ACCESO TOTAL
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}