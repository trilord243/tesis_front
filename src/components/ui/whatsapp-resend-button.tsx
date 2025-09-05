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
import { MessageCircle, AlertTriangle, CheckCircle, Phone } from "lucide-react";
import { resendUserAccessCode, resendAdminAccessCode } from "@/lib/actions/whatsapp-actions";

interface WhatsAppResendButtonProps {
  isAdmin?: boolean;
  userPhone?: string | undefined;
  accessCode?: string | undefined;
  disabled?: boolean;
}

export function WhatsAppResendButton({ 
  isAdmin = false, 
  userPhone, 
  accessCode,
  disabled = false 
}: WhatsAppResendButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResendWhatsApp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Usar server actions según el tipo de usuario
      const result = isAdmin 
        ? await resendAdminAccessCode()
        : await resendUserAccessCode();

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
      console.error('Error resending WhatsApp:', error);
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

  // No mostrar el botón si no hay código de acceso o no hay teléfono
  if (!accessCode || !userPhone || disabled) {
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
            borderColor: "#25D366", 
            color: "#25D366",
            backgroundColor: "white"
          }}
          disabled={disabled}
        >
          <MessageCircle className="h-4 w-4" />
          Enviar por WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: "#25D366" }}>
            <MessageCircle className="h-5 w-5" />
            Reenviar Código QR por WhatsApp
          </DialogTitle>
          <DialogDescription>
            Se enviará tu código QR de acceso al número registrado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del envío */}
          <Alert style={{ borderColor: "#25D366", backgroundColor: "#F0FDF4" }}>
            <Phone className="h-4 w-4" style={{ color: "#25D366" }} />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Número de destino:</strong> <code className="font-mono">{userPhone}</code></p>
                <p><strong>Código a enviar:</strong> <code className="font-mono">{accessCode}</code></p>
                <p><strong>Tipo:</strong> {isAdmin ? "Código Administrativo (permanente)" : "Código de Usuario"}</p>
                <p className="text-sm text-gray-600">
                  El mensaje incluirá tu código QR listo para usar en el acceso físico.
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
                    Revisa tu WhatsApp en el número {userPhone}
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
              onClick={handleResendWhatsApp}
              disabled={isLoading}
              style={{ backgroundColor: "#25D366", color: "white" }}
              className="hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar por WhatsApp
                </>
              )}
            </Button>
          </div>

          {/* Información adicional */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 El mensaje se enviará usando la plantilla &quot;reserva_reenvio&quot; con tu código QR incluido.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}