"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onApproveAll: () => Promise<void>;
  onRejectAll: (reason: string) => Promise<void>;
  onClearSelection: () => void;
  className?: string;
}

export function BulkActionBar({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onClearSelection,
  className = "",
}: BulkActionBarProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (selectedCount === 0) return null;

  const handleApproveAll = async () => {
    setIsApproving(true);
    setError(null);
    try {
      await onApproveAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectAll = async () => {
    if (rejectionReason.length < 10) {
      setError("La razón debe tener al menos 10 caracteres");
      return;
    }

    setIsRejecting(true);
    setError(null);
    try {
      await onRejectAll(rejectionReason);
      setShowRejectDialog(false);
      setRejectionReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-4 px-6 py-4
          bg-white border-2 border-gray-200 rounded-2xl shadow-2xl
          animate-in slide-in-from-bottom-4 fade-in duration-300
          ${className}
        `}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Selection count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1859A9]/10">
            <span className="text-lg font-bold text-[#1859A9]">{selectedCount}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {selectedCount} {selectedCount === 1 ? "solicitud" : "solicitudes"}
            </span>
            <span className="text-gray-500 block text-xs">seleccionadas</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-200" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleApproveAll}
            disabled={isApproving || isRejecting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-5 h-10 rounded-xl font-semibold shadow-lg shadow-emerald-200"
          >
            {isApproving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Aprobar {selectedCount > 1 ? "todas" : ""}
          </Button>

          <Button
            onClick={() => setShowRejectDialog(true)}
            disabled={isApproving || isRejecting}
            variant="outline"
            className="border-rose-300 text-rose-600 hover:bg-rose-50 gap-2 px-5 h-10 rounded-xl font-semibold"
          >
            <XCircle className="h-4 w-4" />
            Rechazar
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-200" />

        {/* Clear selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isApproving || isRejecting}
          className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
          title="Deseleccionar todo"
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              Rechazar {selectedCount} {selectedCount === 1 ? "solicitud" : "solicitudes"}
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Proporciona una razón para el rechazo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">
                Razón del rechazo
                <Badge variant="secondary" className="ml-2 text-xs">
                  mínimo 10 caracteres
                </Badge>
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explica por qué estás rechazando estas solicitudes..."
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{rejectionReason.length} caracteres</span>
                {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                  <span className="text-rose-500">
                    Faltan {10 - rejectionReason.length} caracteres
                  </span>
                )}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
                setError(null);
              }}
              disabled={isRejecting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectAll}
              disabled={isRejecting || rejectionReason.length < 10}
              className="gap-2"
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Rechazar {selectedCount} {selectedCount === 1 ? "solicitud" : "solicitudes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
