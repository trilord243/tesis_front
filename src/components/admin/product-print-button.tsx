"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { printProductLabel } from "@/lib/products";
import type { Product } from "@/types/product";

interface ProductPrintButtonProps {
  product: Product;
}

export function ProductPrintButton({ product }: ProductPrintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printType, setPrintType] = useState<"new-product" | "reprint">(
    "new-product"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    setError(null);
    setSuccess(false);

    const result = await printProductLabel(product.hexValue, printType);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } else {
      setError(result.error || "Error al imprimir etiqueta");
    }

    setIsPrinting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Imprimir etiqueta RFID">
          <Printer className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[28rem] sm:w-[32rem]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base">
            Imprimir Etiqueta RFID
          </DialogTitle>
          <DialogDescription className="text-xs">
            Imprimir etiqueta RFID para {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Activo:
              </p>
              <p className="font-semibold text-gray-900 text-sm">
                {product.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Serial:
              </p>
              <p className="font-semibold text-gray-900 text-sm">
                {product.serialNumber}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Código:
              </p>
              <p className="font-semibold text-gray-900 text-sm">
                {product.codigo}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                RFID Tag:
              </p>
              <p className="font-mono text-xs font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded break-all">
                {product.hexValue}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">
              Tipo de impresión:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={printType === "new-product" ? "primary" : "outline"}
                size="sm"
                onClick={() => setPrintType("new-product")}
                disabled={isPrinting}
                className="py-2 px-3 text-xs"
              >
                Nueva Etiqueta
              </Button>
              <Button
                type="button"
                variant={printType === "reprint" ? "primary" : "outline"}
                size="sm"
                onClick={() => setPrintType("reprint")}
                disabled={isPrinting}
                className="py-2 px-3 text-xs"
              >
                Reimpresión
              </Button>
            </div>
            <p className="text-xs text-gray-500 italic">
              {printType === "new-product"
                ? "Para activos recién creados"
                : "Para reemplazar etiquetas dañadas o perdidas"}
            </p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ¡Etiqueta enviada a imprimir correctamente!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="w-full px-6 py-2 text-sm"
            style={{ backgroundColor: isPrinting ? "#ccc" : "#FF8200" }}
          >
            {isPrinting ? (
              <>
                <Printer className="h-4 w-4 mr-2 animate-pulse" />
                Imprimiendo...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Etiqueta
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPrinting}
            className="w-full px-6 py-2 text-sm"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
