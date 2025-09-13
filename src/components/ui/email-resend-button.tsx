"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertTriangle, CheckCircle, Inbox } from "lucide-react";
import { resendUserAccessCodeEmail } from "@/lib/actions/whatsapp-actions";

interface EmailResendButtonProps {
  userEmail?: string | undefined;
  accessCode?: string | undefined;
  disabled?: boolean;
  isEmailVerified?: boolean;
}

export function EmailResendButton({
  userEmail,
  accessCode,
  disabled = false,
  isEmailVerified = true
}: EmailResendButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await resendUserAccessCodeEmail();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(result.message);

      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
        setError(null);
      }, 3000);

    } catch (error) {
      console.error('Error resending email:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setError(null);
    setSuccess(null);
    setIsLoading(false);
  };

  // No mostrar el botón si no hay código de acceso, email o email no verificado
  if (!accessCode || !userEmail || disabled || !isEmailVerified) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          style={{
            borderColor: "#FF8200",
            color: "#FF8200",
            backgroundColor: "white"
          }}
          disabled={disabled}
        >
          <Mail className="h-4 w-4" />
          Enviar por Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: "#FF8200" }}>
            <Mail className="h-5 w-5" />
            Reenviar Código QR por Email
          </DialogTitle>
          <DialogDescription>
            Se enviará tu código QR de acceso al correo electrónico registrado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del envío */}
          <Alert style={{ borderColor: "#FF8200", backgroundColor: "#FFF7ED" }}>
            <Inbox className="h-4 w-4" style={{ color: "#FF8200" }} />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Email de destino:</strong> <code className="font-mono">{userEmail}</code></p>
                <p><strong>Código a enviar:</strong> <code className="font-mono">{accessCode}</code></p>
                <p className="text-sm text-gray-600">
                  El correo incluirá tu código QR con formato profesional de Centro Mundo X.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert style={{ borderColor: "#22C55E", backgroundColor: "#F0FDF4" }}>
              <CheckCircle className="h-4 w-4" style={{ color: "#22C55E" }} />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{success}</p>
                  <p className="text-sm text-gray-600">
                    Revisa tu bandeja de entrada en {userEmail}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResendEmail}
              disabled={isLoading}
              style={{ backgroundColor: "#FF8200", color: "white" }}
              className="hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </>
              )}
            </Button>
          </div>

          {/* Información adicional */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              📧 El correo se enviará con el diseño corporativo de Centro Mundo X y tu código QR incluido.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}