"use client";

import { useState, useActionState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LensRequest, updateLensRequest } from "@/lib/lens-requests";

interface LensRequestDialogProps {
  request: LensRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  approved: {
    label: "Aprobada",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rechazada",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export function LensRequestDialog({
  request,
  isOpen,
  onClose,
  onUpdate,
}: LensRequestDialogProps) {
  const [accessCode, setAccessCode] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [expirationDays, setExpirationDays] = useState("30");

  // Server actions with useActionState
  const [approveState, approveAction] = useActionState(
    async () => {
      if (!request) return { error: "No hay solicitud seleccionada" };

      const result = await updateLensRequest(request._id, {
        status: "approved",
        accessCode: accessCode || undefined,
        expiration: {
          days: parseInt(expirationDays) || 30,
        },
      });

      if (result.success) {
        onUpdate();
        onClose();
        return { success: true, message: result.message };
      }

      return { error: result.error };
    },
    {}
  );

  const [rejectState, rejectAction] = useActionState(
    async () => {
      if (!request) return { error: "No hay solicitud seleccionada" };

      const result = await updateLensRequest(request._id, {
        status: "rejected",
        rejectionReason: rejectionReason || "Sin razón especificada",
      });

      if (result.success) {
        onUpdate();
        onClose();
        return { success: true, message: result.message };
      }

      return { error: result.error };
    },
    {}
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClose = () => {
    setAccessCode("");
    setRejectionReason("");
    setExpirationDays("30");
    onClose();
  };

  if (!request) return null;

  const StatusIcon = statusConfig[request.status].icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Solicitud</DialogTitle>
          <DialogDescription>
            Revisar y gestionar la solicitud de acceso a lentes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center space-x-2">
            <Badge className={`${statusConfig[request.status].color} border`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[request.status].label}
            </Badge>
          </div>

          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              Información del Usuario
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{request.userName}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{request.userEmail}</p>
              </div>
              <div>
                <span className="text-gray-600">Fecha de solicitud:</span>
                <p className="font-medium">{formatDate(request.createdAt)}</p>
              </div>
              {request.processedAt && (
                <div>
                  <span className="text-gray-600">Procesada:</span>
                  <p className="font-medium">{formatDate(request.processedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Request Reason */}
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Razón de la solicitud
            </h4>
            <div className="bg-gray-50 p-3 rounded border text-sm">
              {request.requestReason}
            </div>
          </div>

          {/* Access Information (if approved) */}
          {request.status === "approved" && request.accessCode && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium mb-3 text-green-800">
                Información de Acceso
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Código:</span>
                  <p className="font-mono bg-white px-2 py-1 rounded border">
                    {request.accessCode}
                  </p>
                </div>
                {request.expiresAt && (
                  <div>
                    <span className="text-green-700">Expira:</span>
                    <p className="font-medium">{formatDate(request.expiresAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Information */}
          {request.status === "rejected" && request.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium mb-2 text-red-800">
                Razón del rechazo
              </h4>
              <p className="text-sm text-red-700">{request.rejectionReason}</p>
            </div>
          )}

          {/* Actions for pending requests */}
          {request.status === "pending" && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Acciones de Administrador</h4>
              
              <div className="space-y-4">
                {/* Approval Section */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-3">
                    Aprobar Solicitud
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="accessCode" className="text-sm">
                        Código de acceso (opcional)
                      </Label>
                      <Input
                        id="accessCode"
                        placeholder="Se generará automáticamente si se deja vacío"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expirationDays" className="text-sm">
                        Días de expiración
                      </Label>
                      <Input
                        id="expirationDays"
                        type="number"
                        min="1"
                        max="365"
                        value={expirationDays}
                        onChange={(e) => setExpirationDays(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Rejection Section */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h5 className="font-medium text-red-800 mb-3">
                    Rechazar Solicitud
                  </h5>
                  <div>
                    <Label htmlFor="rejectionReason" className="text-sm">
                      Razón del rechazo
                    </Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Explica el motivo del rechazo..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <form action={rejectAction}>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={!rejectionReason.trim()}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {rejectState.pending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Rechazar
                    </Button>
                  </form>
                  
                  <form action={approveAction}>
                    <Button
                      type="submit"
                      style={{ backgroundColor: "#1859A9" }}
                      className="text-white hover:bg-blue-700"
                    >
                      {approveState.pending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Aprobar
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {(approveState.error || rejectState.error) && (
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-700 text-sm">
                {approveState.error || rejectState.error}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}