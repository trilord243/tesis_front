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
import { RefreshCcw, AlertTriangle, CheckCircle, Trash2, Plus } from "lucide-react";
import { WhatsAppResendButton } from "@/components/ui/whatsapp-resend-button";
import { EmailResendButton } from "@/components/ui/email-resend-button";

interface AccessCodeManagerProps {
  currentCode?: string | null | undefined;
  userPhone?: string | undefined;
  userEmail?: string | undefined;
  isEmailVerified?: boolean;
}

export function AccessCodeManager({ currentCode, userPhone, userEmail, isEmailVerified = true }: AccessCodeManagerProps) {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCode, setNewCode] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Si hay código actual, primero eliminarlo
      if (currentCode) {
        const removeResponse = await fetch('/api/admin/remove-access-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!removeResponse.ok) {
          const errorData = await removeResponse.json();
          // Si el error es que no hay código que eliminar, continuamos
          if (!errorData.error?.includes("no tiene un código")) {
            throw new Error(errorData.error || 'Error al eliminar código actual');
          }
        }
      }

      // Generar nuevo código
      const generateResponse = await fetch('/api/admin/generate-access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Error al generar nuevo código');
      }

      const result = await generateResponse.json();
      setNewCode(result.data.codigo_acceso);
      setSuccess('¡Código de acceso generado exitosamente!');
      
      // Refrescar página después de 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error generating access code:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const removeResponse = await fetch('/api/admin/remove-access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!removeResponse.ok) {
        const errorData = await removeResponse.json();
        throw new Error(errorData.error || 'Error al eliminar código');
      }

      setSuccess('Código de acceso eliminado exitosamente');
      
      // Refrescar página después de 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error removing access code:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Botones de reenvío (solo si hay código) */}
      {currentCode && (
        <>
          <WhatsAppResendButton
            isAdmin={true}
            userPhone={userPhone}
            accessCode={currentCode}
            disabled={!userPhone}
          />
          <EmailResendButton
            userEmail={userEmail}
            accessCode={currentCode}
            disabled={!userEmail}
            isEmailVerified={isEmailVerified}
          />
        </>
      )}
      {/* Botón Generar/Regenerar */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            style={{ 
              borderColor: currentCode ? "#FF8200" : "#22C55E", 
              color: currentCode ? "#FF8200" : "#22C55E" 
            }}
          >
            {currentCode ? (
              <>
                <RefreshCcw className="h-4 w-4" />
                Regenerar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generar Código
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
              {currentCode ? (
                <>
                  <RefreshCcw className="h-5 w-5" />
                  Regenerar Código de Acceso
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Generar Código de Acceso
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentCode 
                ? "Se eliminará el código actual y se generará uno nuevo."
                : "Se generará un nuevo código de acceso administrativo."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {currentCode && (
              <Alert style={{ borderColor: "#FF8200", backgroundColor: "#FFF7ED" }}>
                <AlertTriangle className="h-4 w-4" style={{ color: "#FF8200" }} />
                <AlertDescription>
                  <strong>Código actual:</strong> <code className="font-mono">{currentCode}</code>
                  <br />
                  <br />
                  Este código será reemplazado por uno nuevo.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && newCode && (
              <Alert style={{ borderColor: "#22C55E", backgroundColor: "#F0FDF4" }}>
                <CheckCircle className="h-4 w-4" style={{ color: "#22C55E" }} />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{success}</p>
                    <p><strong>Nuevo código:</strong> <code className="font-mono bg-white px-2 py-1 rounded">{newCode}</code></p>
                    <p className="text-sm text-gray-600">La página se actualizará automáticamente...</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {success && !newCode && (
              <Alert style={{ borderColor: "#22C55E", backgroundColor: "#F0FDF4" }}>
                <CheckCircle className="h-4 w-4" style={{ color: "#22C55E" }} />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsGenerateOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGenerateCode}
                disabled={isLoading}
                style={{ backgroundColor: "#FF8200", color: "white" }}
                className="hover:opacity-90"
              >
                {isLoading ? "Procesando..." : (currentCode ? "Regenerar Código" : "Generar Código")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Botón Eliminar (solo si hay código) */}
      {currentCode && (
        <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              style={{ borderColor: "#EF4444", color: "#EF4444" }}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Eliminar Código de Acceso
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar tu código de acceso?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Código a eliminar:</strong> <code className="font-mono">{currentCode}</code>
                  <br />
                  <br />
                  Una vez eliminado, no tendrás acceso hasta generar uno nuevo.
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
                    <p>{success}</p>
                    <p className="text-sm text-gray-600">La página se actualizará automáticamente...</p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRemoveOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRemoveCode}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? "Eliminando..." : "Eliminar Código"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}