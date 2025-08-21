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
  const [printType, setPrintType] = useState<"new-product" | "reprint">("new-product");
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
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Imprimir Etiqueta RFID</DialogTitle>
          <DialogDescription>
            Imprimir etiqueta RFID para {product.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Activo:</p>
              <p className="font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Serial:</p>
              <p className="font-medium">{product.serialNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Código:</p>
              <p className="font-medium">{product.codigo}</p>
            </div>
            <div>
              <p className="text-gray-500">RFID Tag:</p>
              <p className="font-mono text-xs">{product.hexValue}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de impresión:</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={printType === "new-product" ? "default" : "outline"}
                size="sm"
                onClick={() => setPrintType("new-product")}
                disabled={isPrinting}
              >
                Nueva Etiqueta
              </Button>
              <Button
                type="button"
                variant={printType === "reprint" ? "default" : "outline"}
                size="sm"
                onClick={() => setPrintType("reprint")}
                disabled={isPrinting}
              >
                Reimpresión
              </Button>
            </div>
            <p className="text-xs text-gray-500">
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPrinting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
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
                Imprimir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}